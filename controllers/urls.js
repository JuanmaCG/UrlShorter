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

  getUrlByShortUrl = async (shortUrl) => {
    try {
      const url = await Url.findOneAndUpdate(
        { shortedUrl: shortUrl },
        {
          $inc: { visits: 1 },
          $set: { lastVisited: Date.now() }
        },
        {
          new: true, // Return updated document
          upsert: false, // Don't create if not exists
          runValidators: true
        }
      )
      console.log('url', url)
      if (!url) {
        console.log('url not found')
        throw new Error('URL not found')
      }
      return url
    } catch (error) {
      throw new Error(error.message)
    }
  }

  getUrlByLongId = async () => {

  }
}
