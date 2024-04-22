export function bearerToken(token?: string | null): string {
  return `Bearer ${token || ''}`
}
