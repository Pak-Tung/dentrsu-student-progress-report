import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ProfileInstructor from "../instructors/ProfileInstructor";
import ProfileAdmin from "../admins/ProfileAdmin";
import Profile from "../students/Profile";
import NavbarRoot from "./NavbarRoot";
import ModalSetAdminDiv from "./ModalSetAdminDiv";

function ProfileRoot() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem("role");
    return savedRole ? savedRole : "";
  });

  const userName = user.name;
  const userPicture = user.picture;
  const userEmail = user.email;

  const handleSelectRole = (selectedRole) => {
    localStorage.setItem('role', selectedRole);
    setRole(selectedRole);
    if (selectedRole === "admin") {
      handleShow();
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (role === "instructor") {
    return <ProfileInstructor />; // Render ProfileInstructor component if role is 'instructor'
  } else if (role === "admin" && !show) {
    //console.log("Role is admin and show is false");
    return <ProfileAdmin />; // Render ProfileAdmin component if role is 'admin' and modal is not shown
  } else if (role === "student") {
    return <Profile />; // Render Profile component if role is 'student'
  }

  return (
    <>
      <NavbarRoot />
      <Container fluid>
        <Row className="justify-content-center">
          <Col>
            <div className="d-flex justify-content-center mb-4">
              <h2>Welcome Back!</h2>
            </div>
            <div className="d-flex justify-content-center mb-4">
              <img
                src={userPicture}
                alt={`${userName}'s profile`}
                className="rounded-circle"
                width="100"
                height="100"
              />
            </div>
            <div className="d-flex justify-content-center mb-4">
              <h3>{userName}</h3>
            </div>
            <div className="d-flex justify-content-center mb-4">
              <h5>Please Select Role to Login</h5>
            </div>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col className="d-flex justify-content-center">
            <div className="d-grid gap-2">
              <Button variant="secondary" size="lg" onClick={() => handleSelectRole("root")}>
                ROOT
              </Button>
              <Button variant="secondary" size="lg" onClick={() => handleSelectRole("admin")}>
                ADMIN
              </Button>
              <Button variant="secondary" size="lg" onClick={() => handleSelectRole("instructor")}>
                INSTRUCTOR
              </Button>
              <Button variant="secondary" size="lg" onClick={() => handleSelectRole("student")}>
                STUDENT
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <ModalSetAdminDiv
        show={show}
        handleClose={handleClose}
        userEmail={userEmail}
      />
    </>
  );
}

export default ProfileRoot;
