import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import Navbar from "react-bootstrap/Navbar";
import "../Navbar.css";

function NavbarInstructor() {
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
        INSTRUCTOR: {user.email ? user.email : "User.email@rsu.ac.th"}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto w-100 justify-content-between">
          <NavDropdown title="Approval" id="nav-approval" className="flex-fill">
            <NavDropdown.Item href="/reqApproval">Requirement</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compApproval">Complete cases</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/requestComplete">Requesting Complete Status</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Member" id="nav-member" className="flex-fill">
            <NavDropdown.Item href="/memberInTeam">Member in Team</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/divisionAdvisee">Division Advisee</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Division" id="nav-division" className="flex-fill">
            <NavDropdown.Item href="/minReq">Minimum Requirement</NavDropdown.Item>
          </NavDropdown>
          <Nav.Item className="flex-fill">
            <Nav.Link href="/">Profile</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavbarInstructor;