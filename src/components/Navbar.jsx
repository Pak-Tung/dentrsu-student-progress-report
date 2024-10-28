// NavbarStudent.js
import React, { useContext, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import Navbar from "react-bootstrap/Navbar";
import "../Navbar.css";
import "../DarkMode.css";
import { ThemeContext } from "../ThemeContext";

function NavbarStudent() {
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
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto w-100 justify-content-between">
          <NavDropdown title="Patients" id="nav-patients" className="flex-fill">
            <NavDropdown.Item href="/allPatients">All patients</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown 
            title="Submission" 
            id="nav-submit" 
            className="flex-fill" 
            //disabled
          >
            <NavDropdown.Item href="/reqSubmit">Requirement</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compSubmit">
              Complete cases
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="Approval Status"
            id="nav-status"
            className="flex-fill"
            //disabled
          >
            <NavDropdown.Item href="/reqStatus">Req Status</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compReport">
              Complete cases
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown 
            title="Overview" 
            id="nav-overview" 
            className="flex-fill" 
          >
            <NavDropdown.Item href="/overview">
              Requirement Overview
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compOverview">
              Complete cases
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/checkStatus">
              Overall Requirement Chart
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown 
            title="Profile" 
            id="nav-profile" 
            className="flex-fill"
          >
            <NavDropdown.Item href="/">Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={toggleTheme}>
              Switch light/dark theme
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarStudent;
