import React from "react"
import { Navbar, Nav, MenuItem, NavDropdown } from "react-bootstrap"
import go from "share/go"

import { BASE as teaTalkAdminBase } from "../teatalkAdmin/config"

class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.element
  }
  render() {
    let {children} = this.props;
    return <div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">The Almight Counter</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavDropdown eventKey={3} title="Admin" id="basic-nav-dropdown">
            <MenuItem onClick={go("/admin")} eventKey={3.0}>Admin</MenuItem>
            <MenuItem onClick={go(teaTalkAdminBase)} eventKey={3.0}>TeaTalk Admin</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={go("/admin/author")} eventKey={3.1}>Author</MenuItem>
            <MenuItem onClick={go("/admin/book")} eventKey={3.2}>Book</MenuItem>
            <MenuItem onClick={go("/admin/volume")} eventKey={3.3}>Volume</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={go("/counter")} eventKey={3.4}>Counter</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar>
      <div className="container">
          {children}
      </div>
    </div>
  }
}

export default App
