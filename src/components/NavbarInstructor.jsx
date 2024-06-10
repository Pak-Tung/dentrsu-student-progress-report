import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";

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
    <Nav fill variant="tabs" className="navbar navbar-expand-lg navbar-light bg-light">
      <Nav.Item className="ml-auto">
        <Nav.Link disabled>
        Instructor: {user.email ? user.email : "User.email@rsu.ac.th"}
        </Nav.Link>
      </Nav.Item>     
      <NavDropdown title="Approval" id="nav-approval">
        <NavDropdown.Item href="/reqApproval">Requirement</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/compApproval">Complete cases</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/requestComplete">Requesting Complete Status</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Member" id="nav-member">
        <NavDropdown.Item href="/memberInTeam">Member in Team</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/divisionAdvisee">Division Advisee</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Division" id="nav-division">
        <NavDropdown.Item href="/minReq">Minimum Requirement</NavDropdown.Item>
      </NavDropdown>
      <Nav.Item>
        <Nav.Link href="/">Profile</Nav.Link>
      </Nav.Item>
    </Nav>
  )
}

export default NavbarInstructor;