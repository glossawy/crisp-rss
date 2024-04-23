export type User = {
  id: string
  display_name: string
  email: string
}

export type GetUserResponse = {
  user: User
}
