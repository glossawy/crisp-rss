import { AppRouter } from '@ts-rest/core'
import { initQueryClient } from '@ts-rest/react-query'

export default function createClient<T extends AppRouter>(contract: T) {
  return initQueryClient(contract, {
    baseUrl: import.meta.env.VITE_API_URL,
    validateResponse: true,
  })
}
