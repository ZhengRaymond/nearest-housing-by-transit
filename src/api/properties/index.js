import lodash from 'lodash';
import Promise from 'promise';
import request from 'request-promise';
import moment from 'moment';

import { logger } from '../util';
import NodeGeocoder from 'node-geocoder';
const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
});
/* Google Maps API client */
import google_maps from '@google/maps';
const googleMapsClient = google_maps.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY
});

import getCraigslist from './craigslist';

async function properties(req, res) {
  const { location, distance } = req.query;

  let response;
  let output = {};

  /* Get source location information from Google's Places API */
  response = await new Promise((resolve, reject) => {
    googleMapsClient.places({ query: location }, (err, data) => {
      if (err) reject(err);
      if (data.json.status !== "OK") reject(data.json.status);

      const geodetail = data.json.results[0];
      resolve({
        lat: geodetail.geometry.location.lat,
        lng: geodetail.geometry.location.lng,
        addr_string: geodetail.formatted_address
      });
    });
  }).catch(logger.error);
  if (response === undefined) return res.sendStatus(400);
  const { lat, lng, addr_string } = response;
  output.lat = lat;
  output.lng = lng;
  output.addr_string = addr_string;

  response = await geocoder.reverse({ lat, lon: lng }).catch(logger.error);
  if (response === undefined) return res.sendStatus(400);
  const address = response[0];
  output.address = address;

  const async_listings = [];
  async_listings.push(getCraigslist(address.city, address.zipcode, distance));
  // async_listings.push(getFacebook(address.city, address.zipcode, distance));

  response = await Promise.all(async_listings).catch(logger.error);
  if (response === undefined) return res.sendStatus(400);
  const listings = [].concat.apply([], response);
  output.listings = listings.filter((listing) => listing);

  res.send(output).status(200);
};

export default properties;



//
// googleMapsClient.distanceMatrix({
//   origins: [
//     { lat: 43.472707, lng: -80.535779 },
//     { lat: 43.472419, lng: -80.533580 },
//     { lat: 43.475168, lng: -80.525113 }
//   ],
//   destinations: [
//     { lat: 43.463854, lng: -80.522622 }
//   ],
//   mode: 'transit',
//   arrival_time: Math.floor(moment().endOf('day').add(9, 'hours').valueOf() / 1000),
// }, (err, data) => {
//   console.log(JSON.stringify(data));
//   console.log("\n");
// });
//
// googleMapsClient.places({
//   query: 'AppDirect, San Francisco',
// }, (err, data) => {
//   console.log(JSON.stringify(data));
//   console.log("\n");
// });
//
