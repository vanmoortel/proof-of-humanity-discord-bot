// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../utils/types';
import { FETCHING } from '../../utils/types';

/* $FlowIgnore */
const slice = createSlice({
  name: 'poh',
  initialState: { errorCode: 0, statePutUserFetching: FETCHING.IDLE },
  reducers: {
    putUserFetching: (state: RootState,
      body: {discordTag: string,
        timestamp: string,
        signedMessage: string}) => ({ ...state, statePutUserFetching: FETCHING.DOING }),
    putUserFetchingSuccess: (state: RootState) => ({
      ...state,
      statePutUserFetching: FETCHING.SUCCESS,
      errorCode: 0,
    }),
    putUserFetchingError: (state: RootState, action: {errorCode: number}) => ({
      ...state,
      statePutUserFetching: FETCHING.ERROR,
      errorCode: action.errorCode,
    }),
  },
});

export default slice;
