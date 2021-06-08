// @flow
import type { Error } from '../business/type/response';

export const ERROR_INVALID_INPUT: Error = { status: 400, code: 1000, message: 'Invalid body arguments...' };

export const ERROR_USER_UNEXPECTED: Error = { status: 400, code: 3000, message: 'Unexpected error in user.' };
export const ERROR_USER_QUERY_UNEXPECTED: Error = { status: 400, code: 3001, message: 'Unexpected error in query user.' };
export const ERROR_USER_NOT_FOUND: Error = { status: 404, code: 3002, message: 'User not found.' };
export const ERROR_USER_VERIFY_MESSAGE: Error = { status: 400, code: 3003, message: 'Failed to verify signed message.' };
export const ERROR_USER_TIMESTAMP_EXPIRED: Error = { status: 400, code: 3004, message: 'Signed message timestamp has expired.' };
export const ERROR_USER_NOT_REGISTERED: Error = { status: 400, code: 3005, message: 'User is not registered on POH.' };

export const ERROR_POH_QUERY_UNEXPECTED: Error = { status: 400, code: 4001, message: 'Unexpected error in POH.' };
