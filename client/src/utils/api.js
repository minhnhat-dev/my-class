import axios from 'axios';
import store from '../store';
import { LOGOUT, SET_ALERT } from '../actions/types';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Clear-Site-Data': '*',
  },
});

/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
* */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const { message } = err.response.data;
    store.dispatch({ type: SET_ALERT, error: { message } });
    if (err.response.status === 401) {
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(err);
  },
);

export default api;
