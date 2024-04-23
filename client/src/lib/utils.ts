import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type WithoutChildren<P extends { children?: React.ReactNode }> = Omit<
  P,
  'children'
>

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
