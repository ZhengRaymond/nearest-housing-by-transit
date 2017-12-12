import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { listings } from './listingsReducer';

export default combineReducers({
  routing: routerReducer,
  listings
})
