import React, { PropTypes } from 'react'

class Html extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
  };
  render() {
    let {content, state} = this.props
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>OMG</title>
          <link rel="shortcut icon" href="/favicon.ico"/>
          <script src="/js/react.js" charSet="utf-8"></script>
          <script src="/js/react-dom.js" charSet="utf-8"></script>
          <script src="/js/react-bootstrap.js" charSet="utf-8"></script>
          <link rel="stylesheet" href="/css/bootstrap.min.css"></link>
          <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
      </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{
        __html: content
      }}/>
          <script dangerouslySetInnerHTML={{
        __html: `window.__APOLLO_STATE__=${JSON.stringify(state)};`
      }} charSet="UTF-8"/>
          <script src="/js/vendor-bundle.js" charSet="utf-8" ></script>
          <script src="/js/client-bundle.js" charSet="utf-8" ></script>
        </body>
      </html>
      );
  }
}

export default Html;
