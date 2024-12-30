import { model, Schema } from 'mongoose'

const counterSchema = new Schema({
  currentIncrement: { type: Number, required: true },
  nextIncrement: { type: Number, required: true },
  previousIncrement: { type: Date, default: Date.now }
})

const Counter = model('Counter', counterSchema)

export default Counter
