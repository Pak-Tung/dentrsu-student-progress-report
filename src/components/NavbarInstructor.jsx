import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import Navbar from "react-bootstrap/Navbar";
import "../Navbar.css";
import "../DarkMode.css";
import { ThemeContext } from "../ThemeContext";

function NavbarInstructor() {
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
            <NavDropdown.Item href="/allTeamleaderPatients">
              All patients
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/txApproval">
              Treatment Approval
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Requirements" id="nav-approval" className="flex-fill">
            <NavDropdown.Item href="/reqApproval">Requirement Approval</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compApproval">
              Complete cases Approval
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/requestComplete">
              Student Complete Status Approval
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Member" id="nav-member" className="flex-fill" >
            <NavDropdown.Item href="/memberInTeam">
              Member in Team
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/divisionAdvisee">
              Division Advisee
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Division" id="nav-division" className="flex-fill">
            <NavDropdown.Item href="/minReq">
              Minimum Requirement
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Profile" id="nav-profile" className="flex-fill">
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

export default NavbarInstructor;
