import * as mongo from './mongo.js'
import cors from 'cors'
import express from 'express'
import { limiter } from './middlewares/rate-limit.js'
import shortenRoutes from './routes/shorten.js'
import apiRoutes from './routes/auth.js'
import requestRoute from './routes/recoveryRoute.js'

import { setupSwagger } from './swagger/swagger.js'

const app = express()

const PORT = process.env.PORT ?? 3000
const isProduction = process.env.NODE_ENV === 'production'

// Add trust proxy configuration
app.set('trust proxy', 1)

setupSwagger(app)
app.use(express.json())
app.use(cors())
app.use(limiter)

app.use('/', requestRoute)
app.use('/api/token', apiRoutes)
app.use('/api/shorten', shortenRoutes)

app.listen(PORT, () => {
  if (isProduction) {
    console.log(`Server running in production mode on port ${PORT}`)
    console.log(`Swagger docs available at ${process.env.BASE_URL}/api-docs`)
  } else {
    console.log(`Server running in development mode at http://localhost:${PORT}`)
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`)
  }
})
