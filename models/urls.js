import { model, Schema } from 'mongoose'

const urlSchema = new Schema({
  originalUrl: { type: String, required: true },
  shortedUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 }
})

const Url = model('URL', urlSchema)

export default Url
