import { combineReducers } from 'redux';

const user = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_USER': {
      return action.payload;
    }
    case 'REMOVE_USER': {
      return {};
    }
    default:
      return state;
  }
};

const city = (state = 'Paris', action) => {
  switch (action.type) {
    case 'CHANGE_CITY': {
      return action.payload;
    }
    default:
      return state;
  }
};

const sortWindow = (state = false, action) => {
  switch (action.type) {
    case 'OPEN_SORT': {
      return !state;
    }
    default:
      return state;
  }
};

const activeOfferId = (state = null, action) => {
  switch (action.type) {
    case 'CHANGE_ACTIVE_OFFER': {
      return action.payload;
    }
    default:
      return state;
  }
};

const apartaments = (state = [], action) => {
  switch (action.type) {
    case 'ADD_APARTAMENTS': {
      return action.payload;
    }
    default:
      return state;
  }
};

export default combineReducers({
  user,
  city,
  sortWindow,
  activeOfferId,
  apartaments,
});
