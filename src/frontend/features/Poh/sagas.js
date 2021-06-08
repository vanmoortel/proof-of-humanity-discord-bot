import { all, takeLatest } from 'redux-saga/effects';
import { put } from '@redux-saga/core/effects';
import axios from 'axios';
import slice from './slice';
import ENDPOINTS from '../../../common/endpoints';

const { putUserFetching, putUserFetchingSuccess, putUserFetchingError } = slice.actions;

export const fetchFakeFetching = function* (action) {
  try {
    const res = yield axios.put(`${process.env.REACT_APP_BACKEND_URL}${ENDPOINTS.user.path}${ENDPOINTS.user.endpoints.putUser.path}`, action.payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      crossdomain: true,
    });
    yield put({ type: putUserFetchingSuccess.type });
  } catch (error) {
    yield put({
      type: putUserFetchingError.type,
      errorCode: error.response ? error.response.data.code : -1,
    });
  }
};

export default function* () {
  yield all([
    takeLatest(putUserFetching.type, fetchFakeFetching),
  ]);
}
