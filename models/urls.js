import { model, Schema } from 'mongoose'

const urlSchema = new Schema({
  originalUrl: { type: String, required: true, unique: true },
  shortedUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  visits: { type: Number, default: 0 },
  lastVisited: { type: Date }
})

const Url = model('URL', urlSchema)

export default Url
