const axios = require('axios');
const API = 'http://localhost:8080/api'

export const REQUEST_LISTINGS = 'REQUEST_LISTINGS';
export const RECEIVE_LISTINGS = 'RECEIVE_LISTINGS';
export const REQUEST_LISTING_DETAILS = 'REQUEST_LISTING_DETAILS';
export const RECEIVE_LISTING_DETAILS = 'RECEIVE_LISTING_DETAILS';

export const requestListings = () => ({
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

export const requestListingDetails = () => ({
  type: REQUEST_LISTING_DETAILS,
});

export const receiveListingDetails = (data) => ({
  type: RECEIVE_LISTING_DETAILS,
  data
});

export const getListingDetails = (url, lat, lng) => {
  return (dispatch) => {
    dispatch(requestListingDetails());
    // axios.get(`${API}/properties`, {
    //   params: {
    //     location,
    //     distance
    //   }
    // }).then(({ data }) => {
    //   console.log('action', data, distance);
    //   return dispatch(receiveListings(data));
    // }).catch((err) => {
    //   console.error(err);
    //   return dispatch(receiveListings(null));
    // });
  }
}
