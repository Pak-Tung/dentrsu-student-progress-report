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

  const division = user.division;
  const teamleader = user.teamleader === 1 ? true : false;

  useEffect(() => {
    const savedUser = Cookies.get("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      Cookies.set("user", JSON.stringify({ email: "" }));
    }
  }, []);

  const getDivisionName = (division) => {
    switch (division) {
      case "oper":
        return "Operative";
      case "endo":
        return "Endodontic";
      case "perio":
        return "Periodontic";
      case "prosth":
        return "Prosthodontic";
      case "diag":
        return "Oral Diagnosis";
      case "radio":
        return "Oral Radiology";
      case "sur":
        return "Oral Surgery";
      case "ortho":
        return "Orthodontic";
      case "pedo":
        return "Pediatric";
      default:
        return "Unknown";
    }
  };

  return (
    <Navbar
      expand="md"
      className={`navbar navbar-expand-lg navbar-${theme} bg-${theme}`}
    >
      <div className="logo-navbar-div">
        <Navbar.Brand href="/">
          <img
            src={
              theme === "light" ? "/logo_navbar.png" : "/logo_navbar_dark.png"
            }
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
          {teamleader && (
            <>
              <NavDropdown
                title="Patients"
                id="nav-patients"
                className="flex-fill"
              >
                <NavDropdown.Item href="/allTeamleaderPatients">
                  All My Patients
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/txApproval" disabled>
                  Treatment Approval
                </NavDropdown.Item>
              </NavDropdown>
            </>
          )}
          <NavDropdown
            title="Approval"
            id="nav-approval"
            className="flex-fill"
          >
            <NavDropdown.Item href="/reqApproval">
              Requirements
            </NavDropdown.Item>
            {teamleader && (
              <>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/compApproval">
                  Completed Cases
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/requestComplete">
                  Completed Status
                </NavDropdown.Item>
              </>
            )}
          </NavDropdown>
          <NavDropdown title="Students" id="nav-member" className="flex-fill">
            {teamleader && (
              <>
                <NavDropdown.Item href="/memberInTeam">
                  My Team Members
                </NavDropdown.Item>
                <NavDropdown.Divider />
              </>
            )}
            <NavDropdown.Item href="/divisionAdvisee">
               My {getDivisionName(division)} Advisees
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Division" id="nav-division" className="flex-fill">
            <NavDropdown.Item href="/minReq">
              Minimum Requirements
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
