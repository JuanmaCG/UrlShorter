import express from 'express'
import URLService from '../services/urlService.js'

const router = express.Router()
const urlService = new URLService()

/**
 * @swagger
 * /{shortUrl}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortUrl
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
router.get('/:shortUrl', async (req, res) => {
  try {
    const longUrl = await urlService.shortToLong(req.params.shortUrl)
    res.redirect(longUrl)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

export default router
