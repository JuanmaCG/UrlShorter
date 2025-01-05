import { base10ToBase62 } from '../utils/baseConvertion.js'
import UrlController from '../controllers/urls.js'
import CounterController from '../controllers/counters.js'
import client from '../redis/redisClient.js'

class URLService {
  constructor () {
    this.urlController = new UrlController()
    this.counterController = new CounterController()
  }

  longToShort = async (longUrl, alias) => {
    try {
      if (alias) {
        const existingUrl = await this.urlController.findExistingAliasUrl(alias)
        if (existingUrl) {
          throw new Error('Alias already exists')
        }
      }

      const counter = await this.counterController.getCurrentCounter()
      if (!counter || !counter.currentIncrement) {
        throw new Error('Invalid counter state')
      }

      const shortUrl = base10ToBase62(counter.currentIncrement)

      const [savedUrl, updatedCounter, redis] = await Promise.all([
        this.urlController.saveUrl({ shortUrl, longUrl }, alias),
        this.counterController.updateCounter(counter),
        client.setEx(shortUrl, 24 * 60 * 60, longUrl) // 24 hours
      ])
      console.log('Url saved on redis', redis)
      return {
        shortedUrl: `${process.env.BASE_URL}/${savedUrl.shortedUrl}`,
        longUrl: savedUrl.originalUrl,
        alias: `${process.env.BASE_URL}/${savedUrl.alias}`
      }
    } catch (error) {
      throw new Error(`Error converting url: ${error.message}`)
    }
  }

  shortToLong = async (url) => {
    try {
      // Medir tiempo de Redis
      const redisStart = performance.now()
      const cachedUrl = await client.get(url)
      const redisTime = performance.now() - redisStart

      if (cachedUrl) {
        console.log('\x1b[32m%s\x1b[0m', `Redis response time: ${redisTime.toFixed(2)}ms`)
        return cachedUrl
      }

      // Medir tiempo de MongoDB
      const mongoStart = performance.now()
      const urlDb = await this.urlController.getUrlByShortUrl(url)
      const mongoTime = performance.now() - mongoStart

      console.log('\x1b[33m%s\x1b[0m', `MongoDB response time: ${mongoTime.toFixed(2)}ms`)
      console.log('\x1b[36m%s\x1b[0m', `Difference: ${(mongoTime - redisTime).toFixed(2)}ms`)

      if (!urlDb) throw new Error('URL not found')

      // Guardar en Redis para futuras consultas
      await client.setEx(url, 30 * 24 * 60 * 60, urlDb.originalUrl)

      return urlDb.originalUrl
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

export default URLService
