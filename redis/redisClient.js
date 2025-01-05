import redis from 'redis'

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
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
