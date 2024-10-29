import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import Navbar from "react-bootstrap/Navbar";
import "../../Navbar.css";

function NavBarPatientBank() {
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
    <Navbar.Brand href="/">DentRSU Connect</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto w-100 justify-content-between">
        <NavDropdown 
          title="บัตรผู้ป่วย" 
          id="nav-charts" 
          className="flex-fill"
        >
          <NavDropdown.Item href="/addNewPatient">
            เพิ่มผู้ป่วยใหม่
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/assignPatientToInstructor">
            แก้ไขข้อมูลผู้ป่วย
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/addMultiNewPatient">
            เพิ่มผู้ป่วยเป็นกลุ่ม
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown 
          title="ค้นหาผู้ป่วย" 
          id="nav-patients" 
          className="flex-fill"
        >
          <NavDropdown.Item href="/searchPatientByHn">
            ค้นหาโดยเลขที่บัตรผู้ป่วย
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/searchPatientByStudent">
            ค้นหาโดยรหัสนักศึกษาผู้รับเคส
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/searchPatientByInstructor">
            ค้นหาโดยอาจารย์ที่ปรึกษา
          </NavDropdown.Item>

        </NavDropdown>

        <NavDropdown title="โปรไฟล์" id="nav-profile-patient-bank" className="flex-fill">
          <NavDropdown.Item href="/">โปรไฟล์</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  )
}

export default NavBarPatientBank;