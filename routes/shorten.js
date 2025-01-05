import express from 'express'
import URLService from '../services/urlService.js'
import QRCode from 'qrcode'
import { authenticateToken, generateToken } from '../middlewares/auth.js'

const router = express.Router()
const urlService = new URLService()

router.post('/', async (req, res) => {
  const { longUrl, alias } = req.body
  try {
    const shortUrl = await urlService.longToShort(longUrl, alias)
    const token = await generateToken(shortUrl.shortedUrl)

    res.status(201).json({
      ...shortUrl,
      token,
      message: 'Save this token for stats and qr requests'
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:shortId', async (req, res) => {
  try {
    const longUrl = await urlService.shortToLong(req.params.shortId)
    res.redirect(longUrl)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

router.post('/:shortId/qr', authenticateToken, async (req, res) => {
  try {
    const url = `${process.env.BASE_URL}/api/shorten/${req.params.shortId}`
    const qrCodeImage = await QRCode.toDataURL(url)
    res.json({ qrCodeImage })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

export default router
