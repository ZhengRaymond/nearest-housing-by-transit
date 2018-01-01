'use strict';

import axios from 'axios';
import request from 'request-promise';
import cheerio from 'cheerio';
const API = 'http://localhost:8080/api'

export const REQUEST_LISTINGS = 'REQUEST_LISTINGS';
export const RECEIVE_LISTINGS = 'RECEIVE_LISTINGS';
export const REQUEST_LISTING_DETAILS = 'REQUEST_LISTING_DETAILS';
export const RECEIVE_LISTING_DETAILS = 'RECEIVE_LISTING_DETAILS';

export const requestListings = () => ({
  type: REQUEST_LISTINGS,
});

export const receiveListings = (listingsData) => ({
  type: RECEIVE_LISTINGS,
  listingsData
});

export const getListings = (location, distance) => {
  return (dispatch) => {
    dispatch(requestListings());
    request.get({
      url: `${API}/properties`,
      qs: { location, distance }
    })
      .then((response) => JSON.parse(response))
      .then((listingsData) => dispatch(receiveListings(listingsData)))
      .catch((err) => dispatch(receiveListings(null)))
  }
}

export const requestListingDetails = () => ({
  type: REQUEST_LISTING_DETAILS,
});

export const receiveListingDetails = (listingDetails) => ({
  type: RECEIVE_LISTING_DETAILS,
  listingDetails
});

export const getListingDetails = ({ url, lat, lng }) => {
  return (dispatch) => {
    dispatch(requestListingDetails());

    console.log('url', url);
    request.get({
      url: `${API}/propertyDetails`,
      qs: { url }
    })
      .then((response) => JSON.parse(response))
      .then((response) => dispatch(receiveListingDetails(response)))
      .catch((err) => dispatch(receiveListingDetails(null)));

    // const address = "1407 oak knoll drive";
    // const description = "nice house for sale near lynbrook high school with lots of local amenities";
    // const images = null;
    // setTimeout(() => dispatch(receiveListingDetails({
    //   address, description, images
    // })), 500);
  }
}
