import { useCallback, useSyncExternalStore } from 'react'
import { Primitive } from 'zod'

import { StorageKeys } from '@/lib/storageKeys'

declare global {
  interface WindowEventMap {
    'crisprss:storage-event': StorageEvent
  }
}

type Serializable = Serializable[] | { [key: string]: Serializable } | Primitive
type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys]

type StorageEventPayload = { key: StorageKey }

class StorageEvent extends CustomEvent<StorageEventPayload> {
  static type = 'crisprss:storage-event' as const

  constructor(key: StorageKey) {
    super(StorageEvent.type, { detail: { key } })
  }
}

export default function useLocalStorage<T extends Serializable>(
  key: StorageKey,
  initialValue: T,
): [T, (newValue: T) => void] {
  const storedValue = useSyncExternalStore(
    (callback) => {
      const listener = (evt: StorageEvent) => {
        if (evt.detail.key === key) callback()
      }

      window.addEventListener(StorageEvent.type, listener)
      return () => {
        window.removeEventListener(StorageEvent.type, listener)
      }
    },
    () => localStorage.getItem(key),
  )

  const setStoredValue = useCallback(
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue))
      window.dispatchEvent(new StorageEvent(key))
    },
    [key],
  )

  const value =
    storedValue == null ? initialValue : (JSON.parse(storedValue) as T)

  return [value, setStoredValue]
}
