import * as mongo from './mongo.js'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import URLService from './services/urlService.js'
import QRCode from 'qrcode'
import { limiter } from './utils/rate-limit.js'

const app = express()

dotenv.config()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use(cors())
app.use(limiter)

app.post('/', async (req, res) => {
  const urlService = new URLService()
  const { longUrl, alias } = req.body
  try {
    const shortUrl = await urlService.longToShort(longUrl, alias)
    res.json(shortUrl)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/:url', async (req, res) => {
  const urlService = new URLService()
  const { url } = req.params
  try {
    const longUrl = await urlService.shortToLong(url)
    res.redirect(longUrl)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/generateQr', async (req, res) => {
  const { url } = req.body

  try {
    const qrCodeImage = await QRCode.toDataURL(url)
    res.json({ qrCodeImage })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
