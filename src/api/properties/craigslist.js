import lodash from 'lodash';
import Promise from 'promise';
import request from 'request-promise';
import moment from 'moment';
import { logger } from '../util';
/* Craigslist configuration; mapping of cities to craigslist sites and clients */
import craigslist from 'node-craigslist';
const CL_hostLookup_BASE = 'https://craigslist.org/suggest?v=12&type=subarea&term=';
const CL_hostLookup_OPTS = {
  v: 12,
  type: 'subarea'
};
const CL_clients = {
  // city:  client with options xxx.craigslist.com
}
const CLDomains = {
  // { "San Francisco": { host: "sfbay", category: "apa" }}
};


function QueryStringToJSON(input) {
  var pairs = input.split('&');

  var result = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });

  return JSON.parse(JSON.stringify(result));
}


/**
 * Finds craigslist listings near the specified location
 * @param zip the zip of the location, used to specify location
 * @param city the city of the location, used to find craigslist subdomain
 * @param distance max distance of search to location
 * @returns promise for asynch call to scrape craigslist housing listings
**/
function getCraigslist(city, zip, distance, max_price = 99999, min_price = 0) {
  const opts = { qs: { ...CL_hostLookup_OPTS,
    term: city
  }};

  return request(`${CL_hostLookup_BASE}`, opts)
    .then((dataStr) => JSON.parse(dataStr))
    .then((data) => data.length && `https://${data[0].url}/jsonsearch/`)
    .then(async (url) => {
      const opts = {
        bundleDuplicates: 1,
        search_distance: 45,
        postal: zip,
        max_price,
        min_price,
        availabilityMode: 0
      };

      let categories = [ 'apa', 'aap', 'hhh' ]; // categories in order of most to least preferable
      let listings;
      for (let i = 0; i < categories.length; i++) {
        listings = await request(`${url}${categories[i]}`, opts)
          .then((response) => JSON.parse(response)[0])
          .catch(logger.error);
        if (listings !== undefined && listings.length > 0) return listings;
      }
      return [];
    })
    .then((listings) => lodash.uniqBy(listings, (listing) => listing.PostingTitle))  // remove duplicate titles
    .then((listings) => listings.map((listing) => ({
      price: listing.Ask,
      lat: listing.Latitude,
      lng: listing.Longitude,
      url: listing.PostingURL
    })))
    .then((listings) => { console.log(JSON.stringify(listings, null, 2)); return listings })
    .catch(logger.error)
}

// async function getCraigslist(city, zip, distance) {
  // // return init;

  // let response;
  //
  // if (!city) return;
  // if ((city in CL_clients) === false) {
  //   const opts = { qs: { ...CL_hostLookup_OPTS,
  //     term: city
  //   }};
  //   response = await request(`${CL_hostLookup_BASE}`, opts)
  //     .then((dataStr) => JSON.parse(dataStr))
  //     .then((data) => data.length && data[0].url)
  //     .then((url) => url && url.substring(0, url.indexOf('.')))
  //     .catch(logger.error)
  //   if (response === undefined) return;
  //   logger.error(response);
  //   CL_clients[city] = new craigslist.Client({ city: response });
  // }
  //
  // const client = CL_clients[city];
  // if (!client) return;
  // const options = {
  //   category: 'apa',
  //   postal: zip,
  //   searchDistance: distance / 4, // assumes 4 minutes per mile
  //   bundleDuplicates: true,
  // };
  //
  // response = await client.list(options)
  // // TODO bug here
  //   .then((listings) => lodash.uniqBy(listings, (listing) => listing.title))        // remove duplicate titles
  //   .then(async (listings) => {
  //     const async_details = lodash.map(listings, (listing) => client.details(listing)); // get details
  //     const details = await Promise.all(async_details);
  //     listings.forEach((listing, index) => Object.assign(listing, details[index]));
  //     return listings;
  //   })
  //   .then((listings) => lodash.uniqBy(listings, (listing) => listing.description))  // remove duplicate descriptions
  //   .then((listings) => lodash.filter(listings, (listing) => listing.mapUrl))       // remove entries without map data
  //   .then((listings) => lodash.filter(listings, (listing) => listing.title))       // remove entries without title
  //   .then((listings) => lodash.filter(listings, (listing) => listing.price))       // remove entries without price
  //   .then((listings) => lodash.map(listings, (listing) => {
  //     var price = listing.price;
  //     var firstDollar = price.indexOf('$');
  //     var secondDollar = price.indexOf('$', firstDollar + 1);
  //     if (firstDollar === -1) {
  //       firstDollar = 0;
  //     }
  //     else {
  //       firstDollar += 1;
  //     }
  //     if (secondDollar === -1) {
  //       secondDollar = price.length;
  //     }
  //     price = price.substring(firstDollar, secondDollar)
  //     listing.price = price;
  //     return listing;
  //   }))       // remove entries without title
  //   .then((listings) => {
  //     /* Can directly load listings with complete street addresses. However,
  //      * listings with latitude/longitude coordinates must be reverse
  //      * geocoded. We compile all latitude/longitude coordinates for batch
  //      * decoding.
  //      */
  //     listings.forEach((listing, index) => {
  //       const mapUrlRaw = listing.mapUrl;
  //       /* latitude longitude listing: */
  //       if (mapUrlRaw.indexOf('https://maps.google.com/maps/preview/@') !== -1) {
  //         const coordinates = mapUrlRaw.split('@')[1].split(',');
  //         listing.lat = coordinates[0];
  //         listing.lng = coordinates[1];
  //       }
  //       /* address listing: */
  //       else {
  //         const mapUrlQueryString = listing.mapUrl.substr(listing.mapUrl.indexOf('?') + 1);
  //         const urlParams = QueryStringToJSON(mapUrlQueryString);
  //         listing.address = urlParams.q.replace(/\+/g, ' ').substr(5);
  //       }
  //     });
  //     return listings;
  //   })
  //   .then((listings) => lodash.filter(listings, (listing) => listing.lat))       // @TODO TEMP
  //   .then((listings) => lodash.uniqBy(listings, (listing) => listing.lat + " " + listing.lng ))       // @TODO TEMP
  //   .catch(logger.error)
  // if (response === undefined) return;
  // return response;
// }

export default getCraigslist;
