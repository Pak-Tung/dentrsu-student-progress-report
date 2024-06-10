// Navbar.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";

function Navbar() {
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
    <Nav fill variant="tabs" className="navbar navbar-expand-lg navbar-light bg-light">
      <Nav.Item className="ml-auto">
        <Nav.Link disabled>
        Student: {user.email ? user.email : "User.email@rsu.ac.th"}
        </Nav.Link>
      </Nav.Item>     
      <NavDropdown title="Submission" id="nav-submit">
        <NavDropdown.Item href="/reqSubmit">Requirement</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/compSubmit">Complete cases</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Approval Status" id="nav-status">
        <NavDropdown.Item href="/reqStatus">Req Status</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/compReport">Complete cases</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Overview" id="nav-overview">
        <NavDropdown.Item href="/overview">Requirement Overview</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/compOverview">Complete cases</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/checkStatus">Student Status</NavDropdown.Item>
      </NavDropdown>
      <Nav.Item>
        <Nav.Link href="/">Profile</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Navbar;


