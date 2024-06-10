import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";

function NavbarAdmin() {
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
    <Nav
      fill
      variant="tabs"
      className="navbar navbar-expand-lg navbar-light bg-light"
    >
      <Nav.Item className="ml-auto">
        <Nav.Link disabled>
          Admin: {user.email ? user.email : "User.email@rsu.ac.th"}
        </Nav.Link>
      </Nav.Item>
      <NavDropdown title="Approval" id="nav-approval">
        <NavDropdown.Item href="/reqApprovedEdit">Manage Approved Requirement</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Student" id="nav-student">
        <NavDropdown.Item href="/reqDivOfAllStudent">
          Student Requirement
        </NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Setting" id="nav-setting">
        <NavDropdown.Item href="/editReqOfDivision">
          Requirement
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/assignAdvisor">Advisor</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/assignAdvisee">Advisee</NavDropdown.Item>
      </NavDropdown>
      <Nav.Item>
        <Nav.Link href="/">Profile</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default NavbarAdmin;
