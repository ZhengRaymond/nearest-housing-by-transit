const axios = require('axios');
const API = 'http://localhost:8080/api'
const lodash = require('lodash');

export const REQUEST_LISTINGS = 'REQUEST_LISTINGS ';
export const RECEIVE_LISTINGS = 'RECEIVE_LISTINGS';

export const requestListings = subreddit => ({
  type: REQUEST_LISTINGS,
});

export const receiveListings = (listings) => ({
  type: RECEIVE_LISTINGS,
  listings
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
      return dispatch(receiveListings(data));
    }).catch((err) => {
      console.error(err);
      return dispatch(receiveListings([]));
    });
  }
}
