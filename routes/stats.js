import express from 'express'
import URLService from '../services/urlService.js'
import { authenticateToken } from '../middlewares/auth.js'

const router = express.Router()
const urlService = new URLService()

router.use(authenticateToken)

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query
    const urls = await urlService.getTotalUrls({ limit, page })
    res.json(urls)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:shortId', async (req, res) => {
  try {
    const stats = await urlService.getUrlStats(req.params.shortId)
    res.json(stats)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

router.get('/analytics/top', async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const topUrls = await urlService.getTopUrls(limit)
    res.json(topUrls)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
