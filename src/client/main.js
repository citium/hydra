import React from 'react'
import { render } from 'react-dom'

var App = require('./app').default

var reloadCount = 0;
const root = document.getElementById('root')


render((<App key={reloadCount++}/>), root);

if (module.hot) {
  module.hot.accept();

  module.hot.status(event => {
    // if (event === 'abort' || event === 'fail') {
    // }
    console.log(event);
  });

  module.hot.accept('./main', () => {
    try {
      App = require('./app').default;
      render((<App key={reloadCount++}/>), root);
    } catch (err) {
      console.log(err.stack);
    }
  });
}
