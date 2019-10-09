/* eslint-disable no-unused-vars */
import { queryExample } from '../../services/example';

export default {
  namespace: 'home',

  state: {
    openAction: null,
  },

  subscriptions: {
    setup({ dispatch }) {
      // console.log(dispatch)
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      // eslint-disable-line
      // const result = yield call(queryExample);
      const fakeresult = yield fakeRequest({ a: 1 });
      // console.log(result, 'result');
      yield put({ type: 'updateState', payload: fakeresult });
      yield put({ type: 'save' });
    },
  },

  /* 自带 updateState 跟新state*/
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

function fakeRequest(result) {
  return new Promise(resolve => {
    setTimeout(() => resolve(result), 1000);
  });
}
