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
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{
        __html: content
      }}/>
          <script dangerouslySetInnerHTML={{
        __html: `window.__APOLLO_STATE__=${JSON.stringify(state)};`
      }} charSet="UTF-8"/>
          <script src="/vendor_bundle.js" charSet="utf-8" ></script>
          <script src="/client_bundle.js" charSet="utf-8" ></script>
        </body>
      </html>
      );
  }
}

export default Html;