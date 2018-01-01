import _ from 'lodash';
import Promise from 'promise';
import request from 'request-promise';
import cheerio from 'cheerio';

import { logger } from '../util';
// const geocoder = NodeGeocoder({
//   provider: 'google',
//   apiKey: process.env.GOOGLE_MAPS_API_KEY,
// });
/* Google Maps API client */
import google_maps from '@google/maps';
const googleMapsClient = google_maps.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY
});

async function propertyDetails(req, res) {
  const { url } = req.query;
  const html = await request.get(url);
  if (html === undefined) return;
  const $ = cheerio.load(html);
  let images = [];
  $('#thumbs a').each((index, html) => images.push(html.attribs.href));
  let attributes = [];
  $('.attrgroup span').each((index, html) => attributes.push($(html).text()));
  let addrLabel, addrUrl;
  try {
    addrLabel = $('.mapaddress:not(:has(*))').text();
    addrUrl = ($('.mapaddress a')[0]).attribs.href;
  }
  catch (err) {
    logger.error(err);
  }
  const address = {
    label: addrLabel + ' (To google maps)',
    url: addrUrl || null
  }
  console.log('address', address)

  const description = $('#postingbody').text();
  const date = $('#display-date time').prop('datetime')

  const output = {
    images,
    attributes,
    description,
    date,
    address
  }
  res.send(output).status(200);
};

export default propertyDetails;
