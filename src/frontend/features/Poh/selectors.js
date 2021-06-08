// @flow
import type { Fetching, RootState } from '../../utils/types';

export const selectErrorCode = (state: RootState): number => state.poh.errorCode;
export const selectStatePutUserFetching = (state: RootState): Fetching => state.poh
  .statePutUserFetching;
