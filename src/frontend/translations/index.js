// @flow
import en from './en';
import fr from './fr';
import LANGUAGE from './types';
import type { Language } from './types';

export default (language: Language): any => {
  switch (language) {
    case LANGUAGE.EN:
      return en;
    case LANGUAGE.FR:
      return fr;
    default:
      return en;
  }
};
