import { useCallback, useSyncExternalStore } from 'react'

import {
  StorableMap,
  StoreUpdateEvent,
  clearStoredData,
  storeData,
} from '@/lib/storage'

export default function useLocalStorage<K extends keyof StorableMap>(
  key: K,
  initialValue: StorableMap[K] | null,
) {
  const storedValue = useSyncExternalStore(
    (callback) => {
      const listener = (evt: StoreUpdateEvent) => {
        if (evt.detail.key === key) callback()
      }

      const storageListener = (evt: StorageEvent) => {
        if (evt.key === key) callback()
      }

      window.addEventListener('crisprss:storage-update', listener)
      window.addEventListener('storage', storageListener)
      return () => {
        window.removeEventListener('crisprss:storage-update', listener)
        window.removeEventListener('storage', storageListener)
      }
    },
    () => localStorage.getItem(key),
  )

  const setStoredValue = useCallback(
    (newValue: StorableMap[K]) => {
      storeData(key, newValue)
    },
    [key],
  )

  const clearStoredValue = useCallback(() => {
    clearStoredData(key)
  }, [key])

  const value =
    storedValue == null
      ? initialValue
      : (JSON.parse(storedValue) as StorableMap[K])

  return { value, setStoredValue, clearStoredValue }
}
