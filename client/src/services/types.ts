export type MessageResponse = {
  message: string
}

export type JSendSuccess<Payload extends { [key: string]: unknown }> = {
  status: 'success'
  data: Payload
}

export type JSendFail<RequestPayload extends { [key: string]: unknown }> = {
  status: 'fail'
  data: { [k in keyof RequestPayload]: string }
}

export type JSendError = {
  status: 'error'
  message: string
}
