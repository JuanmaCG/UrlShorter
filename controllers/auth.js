import { generateToken } from '../middlewares/auth.js'
import { User } from '../models/user.js'

export const getToken = async (req, res) => {
  const { username } = req.body

  let user = await User.findOne({ username })
  if (!user) {
    user = new User({ username })
    await user.save()
  }

  const token = await generateToken(username)
  res.json({ token, message: 'Token generated successfully', limit: '500 requests per 15 minutes' })
}
