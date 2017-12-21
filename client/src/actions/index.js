const axios = require('axios');
const API = 'http://localhost:8080/api'

export const REQUEST_LISTINGS = 'REQUEST_LISTINGS ';
export const RECEIVE_LISTINGS = 'RECEIVE_LISTINGS';

export const requestListings = subreddit => ({
  type: REQUEST_LISTINGS,
});

export const receiveListings = (data) => ({
  type: RECEIVE_LISTINGS,
  data
});

export const getListings = (location, distance) => {
  return (dispatch) => {
    dispatch(requestListings());
    axios.get(`${API}/properties`, {
      params: {
        location,
        distance
      }
    }).then(({ data }) => {
      console.log('action', data, distance);
      return dispatch(receiveListings(data));
    }).catch((err) => {
      console.error(err);
      return dispatch(receiveListings(null));
    });
  }
}
