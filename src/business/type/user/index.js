// @flow

/**
 * A User link Discord Identity with an Ethereum wallet registered on Proof Of Humanity
 */
export type User = {
  discordId: string,
  publicKey: string,
  registered: boolean,
  createdAt: string,
  updatedAt: string,
}
