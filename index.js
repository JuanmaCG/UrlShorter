import * as mongo from './mongo.js'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import URLService from './services/urlService.js'

const app = express()

dotenv.config()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use(cors())

// {
//   "longUrl": "url"
// }
app.post('/', async (req, res) => {
  const urlService = new URLService()
  console.log('req.body', req.body)
  const { longUrl } = req.body
  try {
    const shortUrl = await urlService.longToShort(longUrl)
    res.json(shortUrl)
  } catch (error) {
    res.status(500).json({ error: 'Error converting long url to short url' })
  }
})

app.get('/:url', async (req, res) => {
  const urlService = new URLService()
  console.log('req.params', req.params)
  const { url } = req.params
  try {
    const longUrl = await urlService.shortToLong(url)
    console.log('longUrl', longUrl)
    res.redirect(longUrl)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
