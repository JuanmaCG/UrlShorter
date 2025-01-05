import express from 'express'
import { getToken } from '../controllers/auth.js'
import { limiter } from '../utils/rate-limit.js'

const router = express.Router()

router.post('/get-token', limiter, getToken)

export default router
