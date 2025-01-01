import Counter from '../models/counter.js'
export default class CounterController {
  getCurrentCounter = async () => {
    try {
      const counter = await Counter.find({})
      if (counter.length === 0) {
        const newCounter = await this.createCounter()
        return newCounter
      }
      return counter[0]
    } catch (error) {
      throw new Error(error)
    }
  }

  updateCounter = async (currentCounter) => {
    try {
      const updatedCounter = await Counter.findByIdAndUpdate(
        currentCounter._id,
        {
          previousIncrement: currentCounter.currentIncrement,
          currentIncrement: currentCounter.nextIncrement,
          nextIncrement: currentCounter.nextIncrement + 1
        },
        { new: true }
      )
      return updatedCounter
    } catch (error) {
      throw new Error('Error updating counter')
    }
  }

  createCounter = async () => {
    const newCounter = new Counter({
      currentIncrement: 100000000000,
      nextIncrement: 100000000001
    })
    return await newCounter.save()
  }
}
