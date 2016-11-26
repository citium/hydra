import React from "react"
import { Navbar, Nav, MenuItem, NavItem, NavDropdown, Panel } from "react-bootstrap"
import go from "share/go"

class AdminLayout extends React.Component {
  static propTypes = {
    children: React.PropTypes.element
  }
  render() {
    let {children} = this.props;
    return <div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Admins</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={2.1} onClick={go("/admin/author")}>Author</NavItem>
          <NavItem eventKey={2.2} onClick={go("/admin/book")}>Book</NavItem>
          <NavItem eventKey={2.3} onClick={go("/admin/volume")}>Volume</NavItem>
          <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
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

export default AdminLayout
