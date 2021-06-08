import { Router } from 'express';
import ENDPOINTS from '../../common/endpoints';
import { answer } from '../../service/winston';
import checkAlive from '../../business/ucc/alive';

const { endpoints } = ENDPOINTS.alive;
const router = Router();

router.get(endpoints.getAlive.path, async (req, res) => {
  const result = await checkAlive();
  return answer(result.status, result, req, res);
});

export default router;
