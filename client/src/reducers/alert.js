import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function (state = initialState, action) {
  const { type, error } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, error];
    case REMOVE_ALERT:
      return state.filter((item) => item.message !== error.message);
    default:
      return state;
  }
}
