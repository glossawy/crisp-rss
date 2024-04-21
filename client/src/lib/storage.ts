import { SessionInfo } from '@/features/authentication/hooks/useSession'
import { StorageKeys } from '@/lib/storageKeys'

declare global {
  interface WindowEventMap {
    'crisprss:storage-update': StoreUpdateEvent
  }
}

type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys]

export type StorableMap = {
  [StorageKeys.session]: SessionInfo
}

type StoreUpdateEventPayload = { key: StorageKey }

export class StoreUpdateEvent extends CustomEvent<StoreUpdateEventPayload> {
  static type: keyof WindowEventMap = 'crisprss:storage-update' as const

  constructor(key: StorageKey) {
    super(StoreUpdateEvent.type, { detail: { key } })
  }
}

export function storeData<K extends keyof StorableMap, V = StorableMap[K]>(
  key: K,
  value: V,
) {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new StoreUpdateEvent(key))
}

export function fetchStoredData<
  K extends keyof StorableMap,
  V = StorableMap[K],
>(key: K, defaultValue: V | null = null): V | null {
  const stored = localStorage.getItem(key)

  return stored == null ? defaultValue : (JSON.parse(stored) as V)
}

export function clearStoredData<K extends keyof StorableMap>(key: K) {
  localStorage.removeItem(key)
  window.dispatchEvent(new StoreUpdateEvent(key))
}
