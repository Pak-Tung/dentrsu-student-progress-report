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
import {
  getDivReqByStudentEmail,
  getCompcaseReqByStudentEmail,
} from "../features/apiCalls";

function NavbarStudent() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [reqs, setReqs] = useState([]);
  const [cases, setCases] = useState([]);

  const divisions = [
    "oper",
    "perio",
    "endo",
    "prosth",
    "diag",
    "radio",
    "sur",
    "ortho",
    "pedo",
  ];

  useEffect(() => {
    const savedUser = Cookies.get("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      Cookies.set("user", JSON.stringify({ email: "" }));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let reqsData = [];
        // Loop over each division and fetch data individually
        for (const division of divisions) {
          const data = await getDivReqByStudentEmail(user.email, division);
          reqsData = reqsData.concat(data);
        }

        const casesData = await getCompcaseReqByStudentEmail(user.email);
        //console.log(reqsData);
        //console.log(casesData);
        setReqs(reqsData);
        setCases(casesData);
      } catch (error) {
        alert(error.message);
      }
    };
    if (user.email) {
      fetchData();
    }
  }, [user.email]);

  // Separate checks for rejected requirements and cases
  const hasRejectedReqs = reqs.some((req) => req.isApproved === -1);
  const hasRejectedCases = cases.some((caseItem) => caseItem.isApproved === -1);

  // Combined check for the "Approval Status" dropdown
  const hasRejected = hasRejectedReqs || hasRejectedCases;

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
          <NavDropdown title="Patients" id="nav-patients" className="flex-fill">
            <NavDropdown.Item href="/allPatients">
              All My Patients
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Submission" id="nav-submit" className="flex-fill">
            <NavDropdown.Item href="/reqSubmit">Requirements</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compSubmit">
              Completed Cases
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="Approval Status"
            id="nav-status"
            className={`flex-fill ${hasRejected ? "border border-danger" : ""}`}
          >
            <NavDropdown.Item
              href="/reqStatus"
              className={hasRejectedReqs ? "border border-danger" : ""}
            >
              Requirements
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              href="/compReport"
              className={hasRejectedCases ? "border border-danger" : ""}
            >
              Completed Cases
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Overview" id="nav-overview" className="flex-fill">
            <NavDropdown.Item href="/overview">Requirements</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compOverview">
              Completed Cases
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/checkStatus">Radar Chart</NavDropdown.Item>
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

export default NavbarStudent;
