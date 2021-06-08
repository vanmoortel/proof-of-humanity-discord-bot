import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { reducer as settings } from './features/Settings';
import { reducer as poh, sagas as pohSagas } from './features/Poh';

const combinedSagas = function* () {
  yield all([
    fork(pohSagas),
  ]);
};

const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  sagaMiddleware,
];

export const reducer = combineReducers({
  settings,
  poh,
});

export default () => {
  const store = configureStore({
    reducer,
    middleware: [...getDefaultMiddleware({ thunk: false }), ...middlewares],
    devTools: process.env.NODE_ENV !== 'production',
  });

  sagaMiddleware.run(combinedSagas);

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./redux', () => {
      store.replaceReducer(reducer);
    });
  }

  return store;
};
