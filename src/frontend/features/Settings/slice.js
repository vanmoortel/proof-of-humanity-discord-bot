// @flow
import { createSlice } from '@reduxjs/toolkit';
import LANGUAGE from '../../translations/types';
import type { Language } from '../../translations/types';
import type { RootState } from '../../utils/types';

/* $FlowIgnore */
export default createSlice({
  name: 'settings',
  initialState: { language: LANGUAGE.EN },
  reducers: {
    setLanguage: (state: RootState, action: {payload: Language}) => ({
      ...state,
      language: action.payload,
    }),
  },
});
