import * as mongo from './mongo.js'
import cors from 'cors'
import express from 'express'
import { limiter } from './utils/rate-limit.js'
import shortenRoutes from './routes/shorten.js'
import apiRoutes from './routes/auth.js'

const app = express()

const PORT = process.env.PORT ?? 3000
const isProduction = process.env.NODE_ENV === 'production'

app.use(express.json())
app.use(cors())
app.use(limiter)

app.use('/api/token', apiRoutes)
app.use('/api/shorten', shortenRoutes)

app.listen(PORT, () => {
  if (isProduction) {
    console.log(`Server running in production mode on port ${PORT}`)
  } else {
    console.log(`Server running in development mode at http://localhost:${PORT}`)
  }
})
