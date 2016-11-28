import React from "react"
import { Navbar, Nav, MenuItem, NavItem, NavDropdown, Panel } from "react-bootstrap"
import go from "share/go"

import { BASE } from "./config"

class TeaTalkAdminLayout extends React.Component {
  static propTypes = {
    children: React.PropTypes.element
  }
  render() {
    let {children} = this.props;
    return <div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Tea Talk Admins</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={2.0} onClick={go(`${BASE}/student`)}>Student</NavItem>
          <NavItem eventKey={2.1} onClick={go(`${BASE}/teacher`)}>Teacher</NavItem>
          <NavItem eventKey={2.2} onClick={go(`${BASE}/location`)}>Location</NavItem>
          <NavDropdown eventKey={3} title="Other" id="basic-nav-dropdown">
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

export default TeaTalkAdminLayout
