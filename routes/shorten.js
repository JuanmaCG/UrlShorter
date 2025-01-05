import express from 'express'
import URLService from '../services/urlService.js'
import QRCode from 'qrcode'
import { authenticateToken, generateToken } from '../middlewares/auth.js'

const router = express.Router()
const urlService = new URLService()

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a shortened URL
 *     tags: [URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longUrl
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The URL to shorten
 *               alias:
 *                 type: string
 *                 description: Optional custom alias for the URL
 *     responses:
 *       201:
 *         description: URL shortened successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortedUrl:
 *                   type: string
 *                 originalUrl:
 *                   type: string
 *                 token:
 *                   type: string
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/shorten/{shortId}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL ID
 *     responses:
 *       302:
 *         description: Redirects to original URL
 *       404:
 *         description: URL not found
 */
router.get('/:shortId', async (req, res) => {
  try {
    const longUrl = await urlService.shortToLong(req.params.shortId)
    res.redirect(longUrl)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

/**
 * @swagger
 * /api/shorten/{shortId}/qr:
 *   post:
 *     summary: Generate QR code for shortened URL
 *     tags: [URLs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *         description: The short URL ID
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCodeImage:
 *                   type: string
 *                   description: Base64 encoded QR code image
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: URL not found
 */
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
