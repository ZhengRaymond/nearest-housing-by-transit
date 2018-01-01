import { REQUEST_LISTING_DETAILS, RECEIVE_LISTING_DETAILS } from '../actions';

export function listingDetails(state = {}, { type, listingDetails }) {
  switch (type) {
    case REQUEST_LISTING_DETAILS:
      return {
        ...state,
        loading: true,
      };

    case RECEIVE_LISTING_DETAILS:
      return {
        ...state,
        loading: false,
        ...listingDetails
      };

    default:
      return state
  }
}
