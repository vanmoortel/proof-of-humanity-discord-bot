import config from 'config';
import { join } from 'path';
import { ethers } from 'ethers';
import { Client } from 'discord.js';
import fs from 'fs';

import logger from '../../service/winston';

export const initFsDb = async () => {
  try {
    let db = {};
    const filepath = join(config.get('DAL.FS_DB.PATH') || process.cwd(), config.get('DAL.FS_DB.NAME') || 'db.json');

    logger.debug('Check if json DB exist...');
    try {
      const rawData = await fs.promises.readFile(filepath, 'utf8');
      db = JSON.parse((rawData));
    } catch (err) {
      logger.debug('Json DB doesnt exist.');
      await fs.promises.writeFile(filepath, JSON.stringify(db), 'utf8');
    }
    logger.debug('Check if json DB exist done.');
  } catch (err) {
    logger.error(err.stack);
    throw new Error(err);
  }
};

export const ethProvider = () => {
  try {
    return new ethers.providers.JsonRpcProvider(config.get('DAL.ETH_PROVIDER.URL') || 'http://localhost:8545');
  } catch (err) {
    logger.error(err.stack);
    throw new Error(err);
  }
};

export const loadDiscordGuild = async () => {
  try {
    const client = new Client({ fetchAllMembers: true });
    await client.login(config.get('SERVICE.DISCORD.TOKEN'));
    return await client.guilds.fetch(config.get('SERVICE.DISCORD.GUILD'));
  } catch (err) {
    logger.error(err.stack);
    throw new Error(err);
  }
};
