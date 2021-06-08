// @flow

/**
 * An HTTP response
 */
export type Success<T> = {|
  status: number,
  data: T,
|}
export type Error = {|
  status: number,
  message: string,
  code: number,
|}
export type Response<T> = Success<T> | Error
