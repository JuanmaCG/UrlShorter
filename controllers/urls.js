import Url from '../models/urls.js'

export default class UrlController {
  saveUrl = async (url, alias) => {
    console.log('url', url, 'alias', alias)

    const newUrl = new Url({
      originalUrl: url.longUrl,
      shortedUrl: url.shortUrl,
      alias: alias ?? ''
    })
    try {
      const savedUrl = await newUrl.save()
      return savedUrl
    } catch (error) {
      throw new Error('Failed to save URL')
    }
  }

  saveUrlWithAlias = async (url, aliasRequested) => {
    try {
      const aliasUrl = await Url.findOne({ alias: aliasRequested })
      if (aliasUrl) {
        throw Error('Alias already exists')
      }

      const newUrl = new Url({
        originalUrl: url.longUrl,
        shortedUrl: aliasRequested,
        alias: aliasRequested
      })
      console.log(newUrl, 'url a crear con alias')
      const savedUrl = await newUrl.save()
      return savedUrl
    } catch (error) {
      throw new Error(error.message)
    }
  }

  getUrlByShortUrl = async (shortUrl) => {
    try {
      const url = await Url.findOneAndUpdate(
        { shortedUrl: shortUrl },
        {
          $inc: { visits: 1 },
          $set: {
            lastVisited: Date.now(),
            expireAt: new Date(+new Date() + 30 * 24 * 60 * 60 * 1000)
          }
        },
        {
          new: true, // Return updated document
          upsert: false, // Don't create if not exists
          runValidators: true
        }
      )
      console.log('url', url)
      if (!url) {
        throw new Error('URL not found')
      }
      return url
    } catch (error) {
      throw new Error(error.message)
    }
  }

  findExistingAliasUrl = async (alias) => {
    try {
      const aliasUrl = await Url.findOne({ alias })
      return aliasUrl
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
