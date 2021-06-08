import HeartBeats from 'heartbeats';

import logger from '../winston';
import { postCheckExpired } from '../../business/ucc/user';

const start = async (guild, mutex) => {
  try {
    await postCheckExpired({}, guild, mutex);
    logger.debug('Create heartbeat...');
    HeartBeats.killHeart('heartbeats');
    const heartbeats = HeartBeats.create(1000 * 60 * 60, 'heartbeats');
    heartbeats.createEvent(24, async () => {
      await postCheckExpired({}, guild, mutex);
    });
    logger.debug('Create heartbeat done.');
  } catch (err) {
    logger.error(err.stack);
    process.exit(1);
  }
};

export default start;
