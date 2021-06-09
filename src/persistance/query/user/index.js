// @flow
import fs from 'fs';
import { join } from 'path';
import config from 'config';
import type { Response } from '../../../business/type/response';
import type { User } from '../../../business/type/user';
import type { UserFsDb } from '../../type/user';

import { makeUserFromUserFsDb, makeUserFsDbFromUser } from '../../../business/factory/user';
import logger from '../../../service/winston';
import {
  ERROR_USER_QUERY_UNEXPECTED,
  ERROR_USER_NOT_FOUND,
} from '../../../common/errors';

const collection = 'user';

const readDb = async (): Promise<{ user: any[] }> => fs.promises.readFile(join(config.get('DAL.FS_DB.PATH') || process.cwd(), config.get('DAL.FS_DB.NAME') || 'db.json'), 'utf8').then((raw) => JSON.parse(raw));
const writeDb = async (db: {user: any[]}): Promise<void> => fs.promises.writeFile(join(config.get('DAL.FS_DB.PATH') || process.cwd(), config.get('DAL.FS_DB.NAME') || 'db.json'), JSON.stringify(db), 'utf8');

const readOne = async (
  filter: Object,
  mutex: any,
): Promise<Response<User>> => {
  try {
    return await mutex.runExclusive(async () => {
      const db = await readDb();
      const userFsDb: UserFsDb = (db[collection] || []).filter(filter)[0];

      if (!userFsDb) return ERROR_USER_NOT_FOUND;

      return { status: 200, data: makeUserFromUserFsDb(userFsDb) };
    });
  } catch (err) {
    logger.error(err.stack);
    return ERROR_USER_NOT_FOUND;
  }
};

export const readOneByDiscordId = (
  discordId: string,
  mutex: any,
): Promise<Response<User>> => readOne((u) => u.discordId === discordId, mutex);

export const readOneByPublicKey = (
  publicKey: string,
  mutex: any,
): Promise<Response<User>> => readOne((u) => u.publicKey === publicKey, mutex);

const read = async (
  offset: number = 0,
  limit: number = 999999999,
  filter: Object,
  mutex: any,
): Promise<Response<User[]>> => {
  try {
    return await mutex.runExclusive(async () => {
      const db = await readDb();
      const userFsDb: UserFsDb[] = (db[collection] || [])
        .filter(filter)
        .slice(offset, limit);
      return {
        status: 200,
        data: userFsDb.map((p) => makeUserFromUserFsDb(p)),
      };
    });
  } catch (err) {
    logger.error(err.stack);
    return ERROR_USER_QUERY_UNEXPECTED;
  }
};

export const readAll = async (
  offset: number = 0,
  limit: number = 999999999,
  mutex: any,
): Promise<Response<User[]>> => read(offset, limit, () => true, mutex);

const upsertOne = async (
  filter: Object,
  updateOp: UserFsDb,
  mutex: any,
): Promise<Response<User>> => {
  try {
    return await mutex.runExclusive(async () => {
      const db = await readDb();
      db[collection] = [...(db[collection] || []).filter(filter), updateOp];
      await writeDb(db);

      return { status: 200, data: makeUserFromUserFsDb(updateOp) };
    });
  } catch (err) {
    logger.error(err.stack);
    return ERROR_USER_QUERY_UNEXPECTED;
  }
};

export const upsertOneByPublicKey = async (
  user: User,
  mutex: any,
): Promise<Response<User>> => upsertOne((u) => u.publicKey !== user.publicKey,
  { ...makeUserFsDbFromUser(user) }, mutex);
