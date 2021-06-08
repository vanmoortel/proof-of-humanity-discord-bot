// @flow
import Moment from 'moment';
import type { User } from '../../type/user';
import { type UserFsDb } from '../../../persistance/type/user/index';

export const makeUser = (
  discordId: string,
  publicKey: string,
  registered: boolean,
  createdAt: string = Moment().toISOString(),
  updatedAt: string = Moment().toISOString(),
): User => ({
  discordId,
  publicKey,
  registered,
  createdAt,
  updatedAt,
});

export const makeUserFsDbFromUser = (user: User): UserFsDb => ({
  discordId: user.discordId,
  publicKey: user.publicKey,
  registered: user.registered,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const makeUserFromUserFsDb = (userFsDb: UserFsDb): User => ({
  discordId: userFsDb.discordId || '',
  publicKey: userFsDb.publicKey || '',
  registered: userFsDb.registered || false,
  createdAt: userFsDb.createdAt || Moment().toISOString(),
  updatedAt: userFsDb.updatedAt || Moment().toISOString(),
});
