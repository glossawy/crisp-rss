export type WithoutChildren<P extends { children?: React.ReactNode }> = Omit<
  P,
  'children'
>
