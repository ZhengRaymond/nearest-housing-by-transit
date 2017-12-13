import lodash from 'lodash';
import Promise from 'promise';
import request from 'request-promise';
import moment from 'moment';

import chalk from 'chalk';
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

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

/* Craigslist configuration; mapping of cities to craigslist sites and clients */
import craigslist from 'node-craigslist';
const CL_hostLookup_BASE = 'https://craigslist.org/suggest?v=12&type=subarea&term=';
const CL_hostLookup_OPTS = {
  v: 12,
  type: 'subarea'
};
const craigslist_clients = {
  // citySearchKeyword/Name:  client with options xxx.craigslist.com
};

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



async function properties(req, res) {
  const { location, distance } = req.query;
  console.log('A')

  /* Get source location information from Google's Places API */
  try {
    const { lat, lng, addr_string } = await new Promise((resolve, reject) => {
      console.log('B')
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
    });
    console.log("C", lat, lng, addr_string);
  }
  catch(err) {
    console.error(error(err));
  }

  const reverseGeocode = await geocoder.reverse({ lat, lon: lng });
  const address = reverseGeocode[0];

  const async_listings = [];
  async_listings.push(getListingsCraigslist(address.city, distance));

  const data = await Promise.all(async_listings);
  const listings = [].concat.apply([], data);
  res.send(listings).status(200);
};



/**
 * Finds craigslist listings near the specified location
 * @param zip the zip of the location, used to specify location
 * @param city the city of the location, used to find craigslist subdomain
 * @param distance max distance of search to location
 * @returns promise for asynch call to scrape craigslist housing listings
**/
async function getListingsCraigslist(search, distance) {
  if (!search) return;
  if ((search in craigslist_clients) === false) {
    var url = await findCraigslistSite(search);
    console.log('URL@@@@:', url);
    if (!url) return;
    craigslist_clients[city] = new craigslist.Client({ city: url });
  }

  const client = craigslist_clients[search];
  if (!client) return;
  if (client) { // get listings from client
    const options = {
      category: 'hhh',
      postal: zip,
      searchDistance: distance / 4, // assumes 4 minutes per mile
      bundleDuplicates: true,
    };
    return (
      client.search(options, '')
        .then((listings) => lodash.uniqBy(listings, (listing) => listing.title))        // remove duplicate titles
        .then((listings) => lodash.map(listings, (listing) => client.details(listing))) // get details
        .then((listings) => Promise.all(listings))                                      // wait for all details
        .then((listings) => lodash.uniqBy(listings, (listing) => listing.description))  // remove duplicate descriptions
        .then((listings) => lodash.filter(listings, (listing) => listing.mapUrl))       // remove entries without map data
        .then((listings) => {
          var asyncReqs = [];
          listings.forEach((listing) => {
            const mapUrlRaw = listing.mapUrl;
            if (mapUrlRaw.indexOf('https://maps.google.com/maps/preview/@') !== -1) {
              const coordinates = mapUrlRaw.split('@')[1].split(',');
              const LatLng = {
                lat: coordinates[0],
                lon: coordinates[1]
              };
              asyncReqs.push(geocoder.reverse(LatLng).then((data) => listing.address = data[0].formattedAddress));
            }
            else {
              const mapUrlQueryString = listing.mapUrl.substr(listing.mapUrl.indexOf('?') + 1);
              const urlParams = QueryStringToJSON(mapUrlQueryString);
              listing.address = urlParams.q.replace(/\+/g, ' ').substr(5);
            }
          });
          return Promise.all(asyncReqs).then(() => {
            return listings;
          });
        })
    );

    return null;
  }
}


/**
 * Finds a craigslist site corresponding to a specific city
 * @param city the city name of interest
 * @returns the url of the craigslist subdomain
**/
function findCraigslistSite(city) {
  return request(`${CL_hostLookup_BASE}`, { qs: {
    ...CL_hostLookup_OPTS,
    term: city
  }})
    .then((dataStr) => JSON.parse(dataStr))
    .then((data) => { console.log(data); return data })
    .then((data) => data.length && data[0])
    .then((url) => { console.log("DATA is ", url); return url })
    .then((url) => { console.log("URL is ", url); return url })
    .then((url) => url && url.substring(0, url.indexOf('.')));
  // if (city in craigslist_cities) return craigslist_cities[city];
  //
  // for (let name in craigslist_cities) {
  //   if (name.indexOf(city) !== -1) {
  //     const craigslist_site = craigslist_cities[name];
  //     // fs.appendFile('craigslist_cities.json', '') ????
  //     return craigslist_site;
  //   }
  // }
  // final alternatives, search google city/zip as keyword, specifying
  // "craigslist.com" or "craigslist.ca", etc. as the domain
}

export default properties;
