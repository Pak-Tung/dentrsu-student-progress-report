import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import Navbar from "react-bootstrap/Navbar";
import "../../Navbar.css";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";

function NavbarAdmin() {
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

  const handleSelectRole = (selectedRole) => {
    Cookies.set("role", selectedRole);
  };

  return (
    <Navbar
      expand="md"
      className={`navbar navbar-expand-lg navbar-${theme} bg-${theme}`}
    >
      <div className="logo-navbar-div">
        <Navbar.Brand href="/">
          <img
            src={theme === "light"?"/logo_navbar.png":"/logo_navbar_dark.png"}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="DentRSU Connect"
          />
        </Navbar.Brand>
      </div>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto w-100 justify-content-between">
          <NavDropdown title="Approval" id="nav-approval" className="flex-fill">
            <NavDropdown.Item href="/reqApprovedEdit">
              Manage Approved Requirement
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Student" id="nav-student" className="flex-fill">
            <NavDropdown.Item href="/reqDivOfAllStudent">
              Student Requirement
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="Division Setting"
            id="nav-setting"
            className="flex-fill"
          >
            <NavDropdown.Item href="/editReqOfDivision">
              Requirement
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/assignAdvisor">Advisor</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/assignAdvisee">Advisee</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Profile" id="nav-profile" className="flex-fill">
            <NavDropdown.Item href="/profileInstructor" onClick={() => handleSelectRole("instructor")}>Instructor Role</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/">Profile</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarAdmin;
