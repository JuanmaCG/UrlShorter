import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'
import { isTokenValid, saveToken } from '../redis/redisClient.js'

export const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Access Denied' })

  const valid = await isTokenValid(token)
  if (!valid) return res.status(403).json({ message: 'Invalid or Expired Token' })

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' })

    req.user = user

    await User.updateOne({ username: user.username }, { $inc: { tokenUsage: 1 } })

    next()
  })
}

export const generateToken = async (username) => {
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  })

  await saveToken(token, 3600)

  return token
}
