export function sequentialIdGenerator() {
  let current = 0

  return () => {
    current = (current + 1) % Number.MAX_SAFE_INTEGER
    return current
  }
}

export function hexIdGenerator(bytesize: number) {
  const buffer = new Uint8Array(bytesize)
  return () => {
    crypto.getRandomValues(buffer)

    return [...buffer].map((v) => v.toString(16).padStart(2, '0')).join('')
  }
}

export function getUUID() {
  return crypto.randomUUID()
}
