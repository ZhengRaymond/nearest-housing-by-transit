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
      const removeDuplicates = lodash.uniqBy(data, (listing) => listing.title.toLocaleLowerCase());

      // return dispatch(receiveListings(data));
      return dispatch(receiveListings(Object.values(removeDuplicates)));
    }).catch((err) => console.error(err));
  }
}
