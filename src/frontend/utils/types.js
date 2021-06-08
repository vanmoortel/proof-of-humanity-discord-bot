// @flow

import { PayloadAction } from '@reduxjs/toolkit';
import type { Language } from '../translations/types';

// CONSTANTS
/** Enum for status of async fetching IDLE => DOING => SUCCESS || ERROR */
export const FETCHING = {
  IDLE: 0,
  DOING: 1,
  SUCCESS: 2,
  ERROR: 3,
};
export type Fetching = 'IDLE' | 'DOING' | 'SUCCESS' | 'ERROR';

// REDUX
/** Global state */
export type RootState = {
  settings: {
    language: Language,
    setLanguage: (state: RootState, action: PayloadAction<Language>) => void,
  },
  counter: {
    value: number,
    stateGetFakeFetching: Fetching,
    addOne: (state: RootState) => void,
    minusOne: (state: RootState) => void,
    getFakeFetching: (state: RootState) => void,
    getFakeFetchingSuccess: (state: RootState) => void,
    getFakeFetchingError: (state: RootState) => void,
  },
  poh: {
    errorCode: number,
    statePutUserFetching: Fetching,
    putUserFetching: (state: RootState) => void,
    putUserFetchingSuccess: (state: RootState) => void,
    putUserFetchingError: (state: RootState) => void,
  }
}
