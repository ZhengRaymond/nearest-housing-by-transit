import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { listingsData } from './listingsDataReducer';
import { listingDetails } from './listingDetailsReducer';

export default combineReducers({
  routing: routerReducer,
  listingsData,
  listingDetails
})
