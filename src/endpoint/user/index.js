import { Router } from 'express';
import ENDPOINTS from '../../common/endpoints';
import { answer } from '../../service/winston';
import { putUser } from '../../business/ucc/user';

const { endpoints } = ENDPOINTS.user;
const router = Router();

router.put(endpoints.putUser.path, async (req, res) => {
  const result = await putUser(req.body, req.app.locals.guild, req.app.locals.mutexFsDb);
  return answer(result.status, result, req, res);
});

export default router;
