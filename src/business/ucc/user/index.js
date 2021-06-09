// @flow

import { ethers } from 'ethers';
import Moment from 'moment';
import config from 'config';
import type { Response } from '../../type/response';
import type { User } from '../../type/user';
import {
  ERROR_INVALID_INPUT,
  ERROR_USER_NOT_FOUND,
  ERROR_USER_NOT_REGISTERED,
  ERROR_USER_TIMESTAMP_EXPIRED,
  ERROR_USER_UNEXPECTED,
  ERROR_USER_VERIFY_MESSAGE,
} from '../../../common/errors';
import { makeUser } from '../../factory/user';
import logger from '../../../service/winston';
import { isRegistered } from '../../../persistance/query/poh';
import { ethProvider } from '../../../persistance/dal';
import { readAll, upsertOneByPublicKey } from '../../../persistance/query/user';

/*
 *
 *  PUT /user Upsert a new user discord
 *  discordName: "Nolan Vanmoortel#0429"
 *  timestamp: "1318874398806" (Unix Timestamp milliseconds)
 *  signedMessage: "0x21fbf0696d5e0aa2ef41a2b4ffb623bcaf070461d..."
 *
 */
export const putUser = async (
  body: { discordTag: string, timestamp: string, signedMessage: string},
  guild: any, mutex: any,
): Promise<Response<User>> => {
  try {
    logger.debug('Check body...');
    if (!body.discordTag || !body.timestamp || !body.signedMessage
        || body.signedMessage.length !== 132) return ERROR_INVALID_INPUT;
    logger.debug('Check body done.');

    logger.debug('Check if timestamp is not older than one hour...');
    if (Moment(body.timestamp)
      .isBefore(Moment().subtract(1, 'hours'))) return ERROR_USER_TIMESTAMP_EXPIRED;
    logger.debug('Check if timestamp is not older than one hour done.');

    logger.debug('Get DiscordID...');
    await guild.members.fetch();
    const discordMember = guild.members.cache.find((member) => member.user.tag === body.discordTag);
    if (!discordMember) return ERROR_USER_NOT_FOUND;
    const discordId = discordMember.id;
    logger.debug('Get DiscordID done.');

    logger.debug('Compute address from signed message...');
    let address = '';
    try {
      address = ethers.utils.verifyMessage(`${body.discordTag};${body.timestamp}`, body.signedMessage);
    } catch (err) {
      return ERROR_USER_VERIFY_MESSAGE;
    }
    if (!address) return ERROR_USER_VERIFY_MESSAGE;
    logger.debug('Compute address from signed message done.');

    logger.debug('Check if profile exist and is registered on Proof Of Humanity...');
    const isRegisteredResult: Response<boolean> = await isRegistered(address, ethProvider());
    if (!isRegisteredResult.data) return ERROR_USER_NOT_REGISTERED;
    logger.debug('Check if profile exist and is registered on Proof Of Humanity done.');

    logger.debug('Make user...');
    const user: User = makeUser(discordId, address, true, undefined, undefined);
    logger.debug('Make user done.');

    logger.debug('Upsert new/updated user...');
    const upsertResponse: Response<User> = await upsertOneByPublicKey(user, mutex);
    if (!upsertResponse.data) return upsertResponse;
    logger.debug('Upsert new/updated user done.');

    logger.debug('Sybil check...');
    await postCheckExpired({}, guild, mutex);
    logger.debug('Sybil check done.');

    logger.debug('Set discord role registered...');
    await discordMember.roles.add(config.get('SERVICE.DISCORD.REGISTERED_ROLE'));
    logger.debug('Set discord role registered done.');

    return upsertResponse;
  } catch (err) {
    logger.error(err.stack);
    return ERROR_USER_UNEXPECTED;
  }
};

/*
 *
 *  POST /user/check check if all users with discord role Registered are still registered on-chain
 *  Endpoint disabled to reduce risk of SPAM attack, run automatically each day
 *
 */
export const postCheckExpired = async (
  body: { },
  guild: any, mutex: any,
): Promise<Response<boolean>> => {
  try {
    logger.debug('Get all Discord member with role Registered...');
    await guild.members.fetch();
    const role = await guild.roles.fetch(config.get('SERVICE.DISCORD.REGISTERED_ROLE'));
    const discordMembers = role.members.array();
    if (!discordMembers) return ERROR_USER_NOT_FOUND;
    logger.debug('Get all Discord member with role Registered done.');

    logger.debug('Get all users...');
    const usersResult: Response<User[]> = await readAll(undefined, undefined, mutex);
    if (!usersResult.data) return usersResult;
    logger.debug('Get all users done.');

    logger.debug('Check if profile exist and is registered on Proof Of Humanity...');
    const result = await Promise.all(discordMembers.map(async (member) => {
      const user = usersResult.data.filter((u) => u.discordId === member.id)[0];
      if (!user) {
        await member.roles.remove(config.get('SERVICE.DISCORD.REGISTERED_ROLE'));
        return true;
      }

      const isRegisteredResult: Response<boolean> = await isRegistered(user.publicKey,
        ethProvider());
      if (!isRegisteredResult.data) {
        await member.roles.remove(config.get('SERVICE.DISCORD.REGISTERED_ROLE'));
        const upsertResponse: Response<User> = await upsertOneByPublicKey({
          ...user,
          registered: false,
          updatedAt: Moment().toISOString(),
        }, mutex);
        if (!upsertResponse.data) {
          logger.error(`Failed to upsert new unregistered user: ${member.id}`);
          return false;
        }
        return true;
      }

      await member.roles.add(config.get('SERVICE.DISCORD.REGISTERED_ROLE'));
      return true;
    }));
    logger.debug('Check if profile exist and is registered on Proof Of Humanity done.');

    return result.filter(Boolean).length === result.length
      ? { status: 200, data: true }
      : ERROR_USER_UNEXPECTED;
  } catch (err) {
    logger.error(err.stack);
    return ERROR_USER_UNEXPECTED;
  }
};
