/* eslint-disable no-underscore-dangle */
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app/app.jsx';
import reducers from './reducers';
import './i18n';

const init = () => {
  const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  );
  ReactDOM.render(<Provider store={store}>
    <BrowserRouter>
    <App/>
    </BrowserRouter>
    </Provider>,
  document.querySelector('#root'));
};

init();
