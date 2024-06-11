// NavbarStudent.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import Navbar from "react-bootstrap/Navbar";
import "../Navbar.css";

function NavbarStudent() {
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
      className="navbar navbar-expand-lg navbar-light bg-light"
    >
      <Navbar.Brand href="/">
        STUDENT: {user.email ? user.email : "User.email@rsu.ac.th"}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto w-100 justify-content-between">
          <NavDropdown title="Submission" id="nav-submit" className="flex-fill">
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
          >
            <NavDropdown.Item href="/reqStatus">Req Status</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compReport">
              Complete cases
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Overview" id="nav-overview" className="flex-fill">
            <NavDropdown.Item href="/overview">
              Requirement Overview
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compOverview">
              Complete cases
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/checkStatus">
              Student Status
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Item className="flex-fill">
            <Nav.Link href="/">Profile</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarStudent;
