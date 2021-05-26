// Get Random Item of Array
export function rand<T>(arr: Record<string | number | symbol, T>): T {
  const keys = Object.keys(arr)
  const k = keys[Math.floor(Math.random() * keys.length)]
  return arr[k]
}

// Remove Cyclic References from Object
export function serialize(obj: unknown): unknown {
  const seen = new WeakSet()
  const getCircularReplacer = (k, value) => {
  if (this.typeGuards.isObject(value)) {
    if (seen.has(value)) return
      else seen.add(value)
    }
    return value
  }
  return JSON.parse(
    JSON.stringify(obj, getCircularReplacer)
  )
}