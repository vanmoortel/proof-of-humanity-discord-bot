import config from 'config';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const req = async (method, path, data, contentType = 'application/json') => {
  const baseURL = `http://localhost:${config.get('HTTP.PORT')}`;
  let response = {};
  const headers = contentType ? { headers: { 'Content-Type': contentType } } : {};
  const configReq = {
    validateStatus: ((status) => status < 500),
    ...headers,
    maxContentLength: 50 * 1024 * 1024 * 1024,
  };

  try {
    if (method === 'get') {
      const res = await axios.get(
        baseURL + path,
        configReq,
      );
      response = res.data;
    } if (method === 'post') {
      const res = await axios.post(
        baseURL + path,
        data,
        configReq,
      );
      response = res.data;
    } if (method === 'put') {
      const res = await axios.put(
        baseURL + path,
        data,
        configReq,
      );
      response = res.data;
    }
  } catch (e) {
    process.exit(1);
  }
  return response;
};
