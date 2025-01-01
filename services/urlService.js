import { base10ToBase62 } from '../baseConvertion/utils.js'
import UrlController from '../controllers/urls.js'
import CounterController from '../controllers/counters.js'
import dotenv from 'dotenv'
dotenv.config()

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

      const [savedUrl, updatedCounter] = await Promise.all([
        this.urlController.saveUrl({ shortUrl, longUrl }, alias),
        // # TODO: Change to urlController
        this.counterController.updateCounter(counter)
      ])
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
      const urlDb = await this.urlController.getUrlByShortUrl(url)
      return urlDb.originalUrl
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

export default URLService
