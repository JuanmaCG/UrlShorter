import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  tokenUsage: { type: Number, default: 0 }
})

export const User = mongoose.model('User', userSchema)
