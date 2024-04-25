export type JSendSuccess<Payload extends { [key: string]: unknown }> = {
  status: 'success'
  data: Payload
}

// eslint-disable-next-line
export type JSendFail<RequestKeys extends keyof any> = {
  status: 'fail'
  data: { [k in RequestKeys]: string }
}

export type JSendError = {
  status: 'error'
  message: string
}
