// @flow

import type { Fetching } from '../../../utils/types';

export type Props = {
    /** Object containing translated text */
    messages: any,
    statePutUserFetching: Fetching,
    onSign: (string) => void,
    errorCode: number,
    address: string
}
