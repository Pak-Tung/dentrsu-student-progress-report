import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";

function NavbarRoot() {
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
          ROOT: {user.email ? user.email : "User.email@rsu.ac.th"}
        </Nav.Link>
      </Nav.Item>
      <NavDropdown title="User Management" id="nav-userManagement">
        <NavDropdown.Item href="/addUser"> User</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/editInstructors">Instructors</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/editStudents">Students</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Division Management" id="nav-divisionManagement">
      <NavDropdown.Item href="/addDivision">Division</NavDropdown.Item>
        {/* <NavDropdown.Divider />
        <NavDropdown.Item href="/updateDivision">Edit Division</NavDropdown.Item> */}
      </NavDropdown>
      <Nav.Item>
        <Nav.Link href="/">Profile</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default NavbarRoot;
