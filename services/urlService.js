import { base10ToBase62, base62ToBase10 } from '../baseConvertion/utils.js'
import UrlController from '../controllers/urls.js'
import CounterController from '../controllers/counters.js'

class URLService {
  constructor () {
    this.urlController = new UrlController()
    this.counterController = new CounterController()
  }

  longToShort = async (longUrl) => {
    try {
      const counter = await this.counterController.getCurrentCounter()

      if (!counter || !counter.currentIncrement) {
        throw new Error('Invalid counter state')
      }

      const shortUrl = base10ToBase62(counter.currentIncrement)
      const [savedUrl, updatedCounter] = await Promise.all([
        this.urlController.saveUrl({ shortUrl, longUrl }),
        this.counterController.updateCounter(counter)
      ])
      console.log('savedUrl', savedUrl, 'updatedCounter', updatedCounter)
      return {
        shortUrl,
        longUrl,
        counter: counter.currentIncrement
      }
    } catch (error) {
      throw new Error(`Error converting long to short: ${error.message}`)
    }
  }

  shortToLong = async (url) => {
    try {
      const urlDb = await this.urlController.getUrlByShortUrl(url)
      console.log('urlDb', urlDb)
      return urlDb.originalUrl
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

export default URLService
