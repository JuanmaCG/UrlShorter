import { model, Schema } from 'mongoose'

const urlSchema = new Schema({
  originalUrl: { type: String, required: true, unique: true },
  shortedUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  visits: { type: Number, default: 0 },
  lastVisited: { type: Date },
  alias: { type: String },
  expireAt: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
    index: { expires: 0 }
  }
})

const Url = model('URL', urlSchema)

export default Url
