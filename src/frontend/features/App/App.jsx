/**
 *
 * Main component, containing the router and basic structure of the APP
 *
 */
import React from 'react';
import { Card, Layout } from 'antd';
import Router from './Router';
import './App.less';

const { Content } = Layout;

const App = () => (
  <Layout className="h100p w100p">
    <Content className="h100p w100p content-main">
      <Card className="card-main">
        <Router />
      </Card>
    </Content>
  </Layout>
);

export default App;
