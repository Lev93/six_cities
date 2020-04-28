export const addUser = (user) => ({
  type: 'ADD_USER',
  payload: user,
});

export const removeUser = () => ({
  type: 'REMOVE_USER',
});

export const changeCity = (city) => ({
  type: 'CHANGE_CITY',
  payload: city,
});

export const openSort = () => ({
  type: 'OPEN_SORT',
});

export const activeOffer = (id) => ({
  type: 'CHANGE_ACTIVE_OFFER',
  payload: id,
});

export const addAparataments = (array) => ({
  type: 'ADD_APARTAMENTS',
  payload: array,
});
