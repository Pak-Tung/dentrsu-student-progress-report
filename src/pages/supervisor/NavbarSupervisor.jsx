import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import Navbar from "react-bootstrap/Navbar";
import "../../Navbar.css";

function NavbarSupervisor() {
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
          User: {user.email ? user.email : "User.email@rsu.ac.th"}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto w-100 justify-content-between">
            <NavDropdown 
              title="Patients" 
              id="nav-patients" 
              className="flex-fill"
            >
              <NavDropdown.Item href="/searchPatientByHn">
                Search by HN
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/searchPatientByStudent">
                Search by Student ID
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/searchPatientByInstructor">
                Search by Instructor
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Students"
              id="nav-students"
              className="flex-fill"
            >
              <NavDropdown.Item href="/studentAllReq">
                Search by Student ID
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/instructorOverview">
                Search by Instructor
              </NavDropdown.Item>
            </NavDropdown>
    
            <NavDropdown title="profile" id="nav-profile-patient-bank" className="flex-fill">
              <NavDropdown.Item href="/">Profile</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      )
}

export default NavbarSupervisor;