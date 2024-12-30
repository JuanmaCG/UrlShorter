const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function base10ToBase62 (num) {
  if (num === 0) return '0'

  let result = ''

  while (num > 0) {
    result = charset[num % 62] + result
    num = Math.floor(num / 62)
  }

  return result
}

export function base62ToBase10 (str) {
  let result = 0

  for (const char of str) {
    const value = charset.indexOf(char)
    if (value === -1) {
      throw new Error(`Invalid character: '${char}'`)
    }
    result = result * 62 + value
  }

  return result
}
