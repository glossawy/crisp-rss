export type WithoutChildren<P extends { children?: React.ReactNode }> = Omit<
  P,
  'children'
>

export function parseDurationToMinutes(durationText: string): number {
  const parts = durationText
    .trim()
    .split(':')
    .map((p) => parseInt(p))

  switch (parts.length) {
    case 1:
      return parts[0]
    case 2:
      return parts[0] * 60 + parts[1]
    case 3:
      return parts[0] * 24 * 60 + parts[1] * 60 + parts[2]
    default:
      throw new Error('Can only handle up to 3 duration parts')
  }
}
