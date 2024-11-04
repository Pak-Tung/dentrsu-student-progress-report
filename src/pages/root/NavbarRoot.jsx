import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import Navbar from "react-bootstrap/Navbar";
import "../../Navbar.css";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";

function NavbarRoot() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  useEffect(() => {
    const savedUser = Cookies.get("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      Cookies.set("user", JSON.stringify({ email: "" }));
    }
  }, []);

  return (
    <Navbar
      expand="md"
      className={`navbar navbar-expand-lg navbar-${theme} bg-${theme}`}
    >
      <div className="logo-navbar-div">
        <Navbar.Brand href="/">
          <img
            src="/logo_navbar.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="DentRSU Connect"
          />
          {user.email ? " " + user.email : "User.email@rsu.ac.th"}
        </Navbar.Brand>
      </div>{" "}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto w-100 justify-content-between">
          <NavDropdown
            title="User Management"
            id="nav-userManagement"
            className="flex-fill"
          >
            <NavDropdown.Item href="/addUser">User</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/editInstructors">
              Instructors
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/editStudents">Students</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/uploadPatients">
              Patients
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="Division Management"
            id="nav-divisionManagement"
            className="flex-fill"
          >
            <NavDropdown.Item href="/addDivision">Division</NavDropdown.Item>
          </NavDropdown>
          <Nav.Item className="flex-fill">
            <Nav.Link href="/">Profile</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarRoot;
