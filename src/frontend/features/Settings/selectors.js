// @flow
import translations from '../../translations';
import type { Language } from '../../translations/types';
import type { RootState } from '../../utils/types';

export const selectLanguage = (state: RootState): Language => state.settings.language;
export const selectMessages = (state: RootState): any => translations(state.settings.language)
    || {};
