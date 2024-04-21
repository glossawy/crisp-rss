import { AppRouter, ClientArgs } from '@ts-rest/core'
import { initQueryClient } from '@ts-rest/react-query'

export default function createClient<
  T extends AppRouter,
  TArgs extends ClientArgs,
>(contract: T, opts?: Partial<TArgs>) {
  return initQueryClient(contract, {
    baseUrl: import.meta.env.VITE_API_URL,
    validateResponse: true,
    ...(opts || {}),
  })
}
