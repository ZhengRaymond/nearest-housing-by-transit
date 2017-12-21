import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { properties } from './propertiesReducer';

export default combineReducers({
  routing: routerReducer,
  properties
})
