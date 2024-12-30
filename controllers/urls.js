import Url from '../models/urls.js'

export default class UrlController {
  saveUrl = async (url) => {
    const newUrl = new Url({
      originalUrl: url.longUrl,
      shortedUrl: url.shortUrl
    })
    try {
      const savedUrl = await newUrl.save()
      return savedUrl
    } catch (error) {
      throw new Error('Failed to save URL')
    }
  }

  getUrlByShortUrl = async () => {

  }

  getUrlByLongId = async () => {

  }
}
