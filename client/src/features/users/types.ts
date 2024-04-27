export type UserConfigs = {
  color_scheme: 'light' | 'dark' | 'auto'
}

export type User = {
  id: string
  display_name: string
  email: string
  configs: UserConfigs
}
