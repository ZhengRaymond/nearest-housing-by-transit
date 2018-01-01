import { REQUEST_LISTINGS, RECEIVE_LISTINGS } from '../actions';


export function listingsData(state = {}, { type, listingsData }) {
  switch (type) {
    case REQUEST_LISTINGS:
      return {
        ...state,
        initializing: false,
        loading: true,
      };

    case RECEIVE_LISTINGS:
      return {
        ...state,
        initializing: false,
        loading: false,
        ...listingsData
      };

    default:
      return {
        ...state,
        initializing: true,
        loading: false,
      };
  }
}
// const initialState = {};
// const initialState = { query: '', data: {}};
