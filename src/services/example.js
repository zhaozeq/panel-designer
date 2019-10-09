import request from '@utils/request';

export function queryExample(data) {
  return request({ url: '/api/users', data });
}
