import redis from 'redis'

const client = redis.createClient({
  url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})

export const saveToken = async (token, ttl) => {
  await client.set(token, 'valid', 'EX', ttl)
}

export const isTokenValid = async (token) => {
  const result = await client.get(token)
  return result === 'valid'
}

client.on('error', (err) => console.error('Redis Client Error:', err))
client.connect()

export default client
