// @flow
/**
 *
 * Poh page ask to sign a message containing your discord Tag;Timestamp and save them in DB
 *
 */
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Button, Space, Typography, Popover,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ethProvider from 'eth-provider';
import {
  TranslationOutlined,
} from '@ant-design/icons';

import { selectMessages } from '../Settings/selectors';
/* $FlowIgnore */
import './Poh.less';
import slice from './slice';
import sliceSettings from '../Settings/slice';
import { selectStatePutUserFetching, selectErrorCode } from './selectors';
import '../../assets/Oswald-VariableFont_wght.ttf';
import LANGUAGE from '../../translations/types';
import Connect from './Connect';
import Sign from './Sign';
import type { Props } from './Connect/types';

const { Title } = Typography;
const { putUserFetching } = slice.actions;
const { setLanguage } = sliceSettings.actions;

const Poh: React.AbstractComponent<Props> = () => {
  const messages = useSelector(selectMessages);
  const dispatch = useDispatch();
  const errorCode = useSelector(selectErrorCode);
  const statePutUserFetching = useSelector(selectStatePutUserFetching);
  const [web3, setWeb3] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    (async () => {
      try {
        if (web3 || !web3Modal) return;
        const provider = await web3Modal.connect();
        setWeb3(new ethers.providers.Web3Provider(provider));
      } catch (err) {
        resetWeb3();
      }
    })().then().catch();
  }, [web3, setWeb3, web3Modal]);

  const resetWeb3 = () => {
    if (web3Modal) web3Modal.clearCachedProvider();
    setWeb3Modal(null);
    setWeb3(null);
  };

  const sign = async (_web3, _discordTag) => {
    const timestamp = Moment().valueOf();
    const signedMessage = await _web3.getSigner().signMessage(`${_discordTag};${timestamp}`);
    const addr = await _web3.getSigner().getAddress();
    setAddress(addr);
    dispatch(putUserFetching({
      discordTag: _discordTag,
      timestamp,
      signedMessage,
    }));
  };

  return (
    <Space direction="vertical" size="large">
      <Popover
        className="popover-translation"
        content={(
          <Space direction="vertical">
            <Button
              type="text"
              color="primary"
              size="small"
              className="button-language"
              onClick={() => dispatch(setLanguage(LANGUAGE.EN))}
            >
              🍔 English
            </Button>
            <Button
              type="text"
              color="primary"
              size="small"
              className="button-language"
              onClick={() => dispatch(setLanguage(LANGUAGE.FR))}
            >
              🥐 Français
            </Button>
          </Space>
      )}
      >
        <Button type="primary" shape="circle" icon={<TranslationOutlined />} className="button-translation" />
      </Popover>
      <Title className="title-poh">
        {messages['Proof Of Humanity Discord verification']}
      </Title>
      {
        web3 ? (
          <Sign
            messages={messages}
            statePutUserFetching={statePutUserFetching}
            onSign={(discordTag) => sign(web3, discordTag)}
            errorCode={errorCode}
            address={address}
          />
        ) : (
          <Connect
            messages={messages}
            onConnect={() => setWeb3Modal(new Web3Modal({
              network: 'mainnet',
              cacheProvider: false,
              theme: 'dark',
              providerOptions: {
                metamask: {},
                walletconnect: {
                  package: WalletConnectProvider,
                  options: {
                    infuraId: '740f8a307aa34141a298506577f063bc',
                  },
                },
                frame: {
                  package: ethProvider, // required
                },
              },
            }))}
          />
        )
      }
    </Space>

  );
};
export default Poh;
