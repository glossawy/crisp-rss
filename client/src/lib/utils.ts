export type WithoutChildren<P extends { children?: React.ReactNode }> = Omit<
  P,
  'children'
>

const MIN_PER_HOUR = 60
const MIN_PER_DAY = 24 * MIN_PER_HOUR

export function divmod(value: number, divisor: number): [number, number] {
  const dividend = Math.floor(value / divisor)
  const remainder = value % divisor

  return [dividend, remainder]
}

export function parseDurationToMinutes(durationText: string): number {
  if (durationText.trim() === '') return 0

  const parts = durationText
    .trim()
    .split(':')
    .map((p) => parseInt(p))

  switch (parts.length) {
    case 1:
      return parts[0]
    case 2:
      return parts[0] * MIN_PER_HOUR + parts[1]
    case 3:
      return parts[0] * MIN_PER_DAY + parts[1] * MIN_PER_HOUR + parts[2]
    default:
      throw new Error('Can only handle up to 3 duration parts')
  }
}

export function formatMinutesAsDuration(minutes: number) {
  let days, hours
  ;[days, minutes] = divmod(minutes, MIN_PER_DAY)
  ;[hours, minutes] = divmod(minutes, MIN_PER_HOUR)

  const dayPart = days.toString().padStart(2, '0')
  const hourPart = hours.toString().padStart(2, '0')
  const minutePart = minutes.toString().padStart(2, '0')

  return `${dayPart}:${hourPart}:${minutePart}`
}
