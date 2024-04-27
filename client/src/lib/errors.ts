export const errors = {
  not_found: 'Resource not found',
  unavailable: 'Feed returned an error response, it is inaccessible',
  unsupported: 'This feed type is not supported',
} as const

export function getError(error: string) {
  if (error in errors) return errors[error as keyof typeof errors]

  return error
}
