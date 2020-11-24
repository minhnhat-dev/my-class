import api from './api';

const setAuthToken = (token) => {
  if (token) {
    console.log('api.defaults.headers.common', api.defaults.headers.common);
    api.defaults.headers.common.authorization = token;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common.authorization;
    localStorage.removeItem('token');
  }
};

export default setAuthToken;
