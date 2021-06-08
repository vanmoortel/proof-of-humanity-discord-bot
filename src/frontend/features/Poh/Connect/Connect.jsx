// @flow
/**
 *
 * Ask to connect ETH wallet
 *
 */
import * as React from 'react';
import { Button, Space, Typography } from 'antd';
import { WalletOutlined } from '@ant-design/icons';

/* $FlowIgnore */
import './Connect.less';
import type { Props } from './types';

const { Title } = Typography;

const Connect: React.AbstractComponent<Props> = React.memo < Props >(({
  messages,
  onConnect,
}: Props) => (
  <Space direction="vertical">
    <Button
      type="text"
      color="primary"
      size="large"
      onClick={onConnect}
      className="button-poh"
    >
      <WalletOutlined />
      {messages['Connect your wallet']}
    </Button>
    <Title className="subtitle-poh pl-15" level={5}>
      {messages['Please connect your wallet that has been validated on Proof Of Humanity to verify your humanity']}
    </Title>
  </Space>
));

export default Connect;
