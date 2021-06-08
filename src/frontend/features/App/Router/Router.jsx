/**
 *
 * Router with all route available
 *
 */
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import SuspenseLoading from '../../../components/SuspenseLoading';
import { selectLanguage } from '../../Settings/selectors';

const Home = lazy(() => import('../../Poh/Poh'));

const Router = () => {
  const language = useSelector(selectLanguage);

  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseLoading language={language} />}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
