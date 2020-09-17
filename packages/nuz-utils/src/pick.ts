function pick<T = any>(data: any, picks: string[]): T {
  const result = {} as any
  const keys = Object.keys(data || {})

  for (const key of keys) {
    if (picks.includes(key)) {
      result[key] = data[key]
    }
  }

  return result as T
}

export default pick
