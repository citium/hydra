import React from 'react'
import { render } from 'react-dom'

var App = require('./app').default

const root = document.getElementById('root')

render((<App/>), root);

//#region error logging
// TODO LOG ERRROR
// window.onerror = function(err) {
// };
//#endregion

//#region Hot Module Replace
if (module.hot) {
  module.hot.accept();
  module.hot.accept('./app', () => {
    try {
      App = require('./app').default;
      render((<App/>), root);
    } catch (err) {
      console.log(err.stack);
    }
  });
}
//#endregion
