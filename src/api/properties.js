const Promise = require('promise');
const moment = require('moment');
const { parseLocation: parseAddress } = require('parse-address');
const craigslist = require('node-craigslist');
const google_maps = require('@google/maps');
const fs = require('fs');

/* Craigslist configuration; mapping of cities to craigslist sites and clients */
const craigslist_cities = require('./craigslist_cities');
const craigslist_clients = {
  // citySearchKeyword/Name:  client with options xxx.craigslist.com
};

/* Google Maps API client */
const googleMapsClient = google_maps.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY
});

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



const properties = (req, res) => {
  const { query, distance } = req.params;
  let listings = [];
  /* Get source location information from Google's Places API */
  new Promise((resolve, reject) => {
    googleMapsClient.places({ query }, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  }).then((data) => {
    const { lat, lng } = data.json.results[0].geometry.location;
    const addr_string = data.json.results[0].formatted_address;
    const addr_parsed = parseAddress(addr_string);

    const get_listings = [];

    /* Craigslist */
    let listings = getListingsCraigslist(addr_parsed.zip, addr_parsed.city.toLocaleLowerCase(), distance);
    if (listings) get_listings.push(listings);

    return new Promise.all(get_listings);
  }).then((data) => {
    listings = [].concat.apply([], data);
    res.send(listings).status(200);
  }).catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });

  // res.send(result);
};



/**
 * Finds craigslist listings near the specified location
 * @param zip the zip of the location, used to specify location
 * @param city the city of the location, used to find craigslist subdomain
 * @param distance max distance of search to location
 * @returns promise for asynch call to scrape craigslist housing listings
**/
function getListingsCraigslist(zip, city, distance) {
  if (zip && city) { // if client doesn't exist, create a new mapping to a new client
    if (!(city in craigslist_clients)) {
      let url = findCraigslistSite(city);
      if (!url) {
        craigslist_clients[city] = null;
        return null;
      }
      craigslist_clients[city] = new craigslist.Client({ city: url });
    }
    const client = craigslist_clients[city];

    if (client) { // get listings from client
      return (
        client.list({
          category: 'hhh',
          postal: zip,
          searchDistance: distance / 4  // assumes 4 minutes per mile
        }).then((listings) => {
          var noduplicate = {};
          listings.forEach((listing) => {
            const { title } = listing;
            if (!(title in noduplicate)) {
              noduplicate[title] = listing;
            }
          });
          return noduplicate;
        })
      )
    }

    return null;
  }
}


/**
 * Finds a craigslist site corresponding to a specific city
 * @param city the city name of interest
 * @returns the url of the craigslist subdomain
**/
function findCraigslistSite(city) {
  if (city in craigslist_cities) return craigslist_cities[city];

  for (let name in craigslist_cities) {
    if (name.indexOf(city) !== -1) {
      const craigslist_site = craigslist_cities[name];
      // fs.appendFile('craigslist_cities.json', '') ????
      return craigslist_site;
    }
  }
  // final alternatives, search google city/zip as keyword, specifying
  // "craigslist.com" or "craigslist.ca", etc. as the domain
}

export default properties;
