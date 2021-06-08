// @flow

import type { Response } from '../../type/response';

const checkAlive = async (): Promise<Response<boolean>> => ({ status: 200, data: true });

export default checkAlive;
