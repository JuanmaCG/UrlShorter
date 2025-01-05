import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    status: 429,
    error: 'Too many requests',
    message: 'You have exceeded the rate limit. Try again later.'
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
})
