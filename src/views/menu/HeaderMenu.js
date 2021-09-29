import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, Link } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown, Dropdown } from "react-bootstrap";
import { signOut } from "../../models/firebase";
import styles from "./dashboard.css";

export default function HeaderMenu() {
  return (

    <Navbar fixed="top" bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Link to="/" className="navbar-brand">
        AOA-78 Dashboard
        </Link>

        <Navbar.Toggle aria-controls="navbarNavDropdown" />

        <Navbar.Collapse id="navbarNavDropdown">
          <Nav className="ml-auto">
            <Nav.Item>
              <NavLink to="/" exact={true} className="nav-link">
                Home
              </NavLink>
            </Nav.Item>
            <NavDropdown title="Request Filters" id="nav-dropdown" menuVariant="dark">
              <Dropdown.Item>
                <NavLink to="/pending-approval" >
                  Pending Approval
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Item>
                <NavLink to="/in-progress">
                  In Progress
                </NavLink>
                </Dropdown.Item>
              <Dropdown.Item>
                <NavLink to="/completed">
                  Completed
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Item>
                <NavLink to="/rejected">
                  Rejected
                </NavLink>
              </Dropdown.Item>
              <NavDropdown.Divider />
              <Dropdown.Item>
                <NavLink to="/requests-search">
                Search Requests
                </NavLink>
              </Dropdown.Item>
            </NavDropdown>
            <li className="nav-item text-nowrap">
              <a
                className="nav-link"
                href="#"
                id="logout"
                onClick={() => signOut()}
              >
                Sign out
              </a>
          </li>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
