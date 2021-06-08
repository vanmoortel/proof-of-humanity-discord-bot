// @flow

/**
 *
 * Loading screen for first time app is open
 *
 */
import * as React from 'react';
import { Spin } from 'antd';
import translations from '../../translations';
import type { Props } from './types';

const SuspenseLoading: React.AbstractComponent<Props> = React.memo<Props>(({ language }: Props) => (
  <Spin tip={translations(language)['Loading...']} />
));

export default SuspenseLoading;
