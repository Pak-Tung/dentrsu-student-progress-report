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
      <Nav.Item>
        <Nav.Link href="/">Profile</Nav.Link>
      </Nav.Item>

      <Nav.Item>
        <Nav.Link href="/overview">Overview</Nav.Link>
      </Nav.Item>

      <NavDropdown title="Submit" id="nav-submit">
        <NavDropdown.Item href="/operSubmit">Operative</NavDropdown.Item>
        <NavDropdown.Item href="/periodonticsSubmit">Periodontics</NavDropdown.Item>
        <NavDropdown.Item href="/endodonticsSubmit">Endodontics</NavDropdown.Item>
        <NavDropdown.Item href="/prosthodonticsSubmit">Prosthodontics</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/diagnosisSubmit">Diagnosis</NavDropdown.Item>
        <NavDropdown.Item href="/radiologySubmit">Radiology</NavDropdown.Item>
        <NavDropdown.Item href="/surgerySubmit">Surgery</NavDropdown.Item>
        <NavDropdown.Item href="/pediatricSubmit">Pediatric</NavDropdown.Item>
        <NavDropdown.Item href="/orthodonticsSubmit">Orthodontics</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/completeCasesSubmit">Complete cases</NavDropdown.Item>
        <NavDropdown.Item href="/licenseSubmit">License</NavDropdown.Item>
      </NavDropdown>

      <NavDropdown title="Report" id="nav-report">
        <NavDropdown.Item href="/operReport">Operative</NavDropdown.Item>
        <NavDropdown.Item href="/periodonticsReport">Periodontics</NavDropdown.Item>
        <NavDropdown.Item href="/endodonticsReport">Endodontics</NavDropdown.Item>
        <NavDropdown.Item href="/prosthodonticsReport">Prosthodontics</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/diagnosisReport">Diagnosis</NavDropdown.Item>
        <NavDropdown.Item href="/radiologyReport">Radiology</NavDropdown.Item>
        <NavDropdown.Item href="/surgeryReport">Surgery</NavDropdown.Item>
        <NavDropdown.Item href="/pediatricReport">Pediatric</NavDropdown.Item>
        <NavDropdown.Item href="/orthodonticsReport">Orthodontics</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/completeCasesReport">Complete cases</NavDropdown.Item>
        <NavDropdown.Item href="/licenseReport">License</NavDropdown.Item>
      </NavDropdown>

      <Nav.Item className="ml-auto">
        <Nav.Link disabled>
          
            {user.email ? user.email : "User.email@rsu.ac.th"}
          
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Navbar;
