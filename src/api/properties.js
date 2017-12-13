import lodash from 'lodash';
import Promise from 'promise';
import request from 'request-promise';
import moment from 'moment';

import chalk from 'chalk';
const TYPE_OBJECT = 1;
const logger = (msg, chalker, type) => {
  if (type === TYPE_OBJECT) return console.error(chalker(JSON.stringify(msg)));
  return console.error(chalker(msg));
}
const logError = (msg, type = 0) => logger(msg, chalk.bold.red, type);
const logWarning = (msg, type = 0) => logger(msg, chalk.bold.yellow, type);
const logSuccess = (msg, type = 0) => logger(msg, chalk.bold.green, type);
const logInfo = (msg, type = 0) => logger(msg, chalk.bold.cyan, type);

import NodeGeocoder from 'node-geocoder';
const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
});

import { googleAsynch, QueryStringToJSON } from '../lib/util';

/* Google Maps API client */
import google_maps from '@google/maps';
const googleMapsClient = google_maps.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY
});

/* Craigslist configuration; mapping of cities to craigslist sites and clients */
import craigslist from 'node-craigslist';
const CL_hostLookup_BASE = 'https://craigslist.org/suggest?v=12&type=subarea&term=';
const CL_hostLookup_OPTS = {
  v: 12,
  type: 'subarea'
};
const CL_clients = {
  // city:  client with options xxx.craigslist.com
};


async function properties(req, res) {
  const { location, distance } = req.query;

  let response;

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
  }).catch(logError);
  if (response === undefined) return res.sendStatus(400);
  const { lat, lng, addr_string } = response;

  response = await geocoder.reverse({ lat, lon: lng }).catch(logError);
  if (response === undefined) return res.sendStatus(400);
  const address = response[0];

  const async_listings = [];
  async_listings.push(getListingsCraigslist(address.city, address.zipcode, distance));

  response = await Promise.all(async_listings).catch(logError);
  if (response === undefined) return res.sendStatus(400);
  const listings = [].concat.apply([], response);

  res.send(listings).status(200);
};



/**
 * Finds craigslist listings near the specified location
 * @param zip the zip of the location, used to specify location
 * @param city the city of the location, used to find craigslist subdomain
 * @param distance max distance of search to location
 * @returns promise for asynch call to scrape craigslist housing listings
**/
async function getListingsCraigslist(city, zip, distance) {
  let response;

  if (!city) return;
  if ((city in CL_clients) === false) {
    const opts = { qs: { ...CL_hostLookup_OPTS,
      term: city
    }};
    response = await request(`${CL_hostLookup_BASE}`, opts)
      .then((dataStr) => JSON.parse(dataStr))
      .then((data) => data.length && data[0].url)
      .then((url) => url && url.substring(0, url.indexOf('.')))
      .catch(logError)
    if (response === undefined) return;
    CL_clients[city] = new craigslist.Client({ city: response });
  }

  const client = CL_clients[city];
  if (!client) return;
  const options = {
    category: 'hhh',
    postal: zip,
    searchDistance: distance / 4, // assumes 4 minutes per mile
    bundleDuplicates: true,
  };
  var geocoder_indices = []; /* For batch reverse geocoding: */
  var geocoder_coordinates = []; /* For batch reverse geocoding: */
  var listing_results = [];
  response = await client.search(options, '')
    .then((listings) => lodash.uniqBy(listings, (listing) => listing.title))        // remove duplicate titles
    .then((listings) => lodash.map(listings, (listing) => client.details(listing))) // get details
    .then((listings) => Promise.all(listings))                                      // wait for all details
    .then((listings) => lodash.uniqBy(listings, (listing) => listing.description))  // remove duplicate descriptions
    .then((listings) => lodash.filter(listings, (listing) => listing.mapUrl))       // remove entries without map data
    .then((listings) => {
      /* Can directly load listings with complete street addresses. However,
       * listings with latitude/longitude coordinates must be reverse
       * geocoded. We compile all latitude/longitude coordinates for batch
       * decoding.
       */
      listings.forEach((listing, index) => {
        const mapUrlRaw = listing.mapUrl;
        /* latitude longitude listing: */
        if (mapUrlRaw.indexOf('https://maps.google.com/maps/preview/@') !== -1) {
          const coordinates = mapUrlRaw.split('@')[1].split(',');
          const LatLng = {
            lat: coordinates[0],
            lon: coordinates[1]
          };
          /* Save coordinates for batch processing: */
          geocoder_indices.push(index);
          geocoder_coordinates.push(LatLng);
        }
        /* address listing: */
        else {
          const mapUrlQueryString = listing.mapUrl.substr(listing.mapUrl.indexOf('?') + 1);
          const urlParams = QueryStringToJSON(mapUrlQueryString);
          listing.address = urlParams.q.replace(/\+/g, ' ').substr(5);
        }
      });
      /* Save all pre-processing work into listing_results */
      listing_results = listings;
      /* Promise chain the batch reverse geocoding */
      return geocoder.batchGeocode(geocoder_coordinates);
    })
    .then((addresses) => { // <-- decoded addresses
       addresses.forEach((address, index) => {
         const { error, value } = address;
         const listingIndex = geocoder_indices[index];
         if (error) listing_results.splice(listingIndex, 1); // no address found, remove listing
         else listing_results[listingIndex].address = value; // address found, save it.
       });
       return 1; // success code for await error handling
    })
    .catch(logError)
  if (response === undefined) return;
  return listing_results;
}

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
