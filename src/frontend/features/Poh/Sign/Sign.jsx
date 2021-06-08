// @flow
/**
 *
 * Ask to sign Discord Tag and show result
 *
 */
import * as React from 'react';
import { useState } from 'react';
import {
  Button, Input, Space, Typography,
} from 'antd';
import {
  CheckCircleOutlined, EditOutlined, WarningOutlined,
} from '@ant-design/icons';

/* $FlowIgnore */
import './Sign.less';
import type { Props } from './types';
import { FETCHING } from '../../../utils/types';

const { Title } = Typography;

const Sign: React.AbstractComponent<Props> = React.memo < Props >(({
  messages, statePutUserFetching, onSign, errorCode, address,
}: Props) => {
  const [discordTag, setDiscordTag] = useState('');
  return (
    <Space direction="vertical">
      <Space direction="horizontal" size="large">
        <Input value={discordTag} onChange={(event) => setDiscordTag(event.target.value)} placeholder="Vitalik Buterin#1559" size="large" />
        <Button
          loading={statePutUserFetching === FETCHING.DOING}
          type="text"
          color="primary"
          size="large"
          onClick={() => onSign(discordTag)}
          className="button-poh"
        >
          <EditOutlined />
          {messages['Sign your tag']}
        </Button>
      </Space>
      <Title className="subtitle-poh" level={5}>
        {messages['Link your Discord Tag and Proof of Humanity wallet.']}
      </Title>
      {
            errorCode ? (
              <>
                <Title className="error-poh" level={5}>
                  <WarningOutlined />
                  {` ${messages[errorCode] ? messages[errorCode] : messages['Something went wrong']} `}
                  <WarningOutlined />
                </Title>
                <Title className="error-poh" level={5}>
                  {address}
                </Title>
              </>
            ) : ''
        }
      {
            statePutUserFetching === FETCHING.SUCCESS ? (
              <>
                <Title className="information-poh" level={5}>
                  <CheckCircleOutlined />
                  {` ${messages['Your Discord account is now verified !']}`}
                </Title>
                <Title className="information-poh" level={5}>
                  {address}
                </Title>
              </>
            ) : ''
        }
    </Space>
  );
});

export default Sign;
