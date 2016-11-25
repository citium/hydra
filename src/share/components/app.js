import React from "react"

class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element
  }
  render() {
    let {children} = this.props;
    return <div>{children}</div>
  }
}

export default App
