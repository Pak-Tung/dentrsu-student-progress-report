import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ProfileInstructor from "../instructors/ProfileInstructor";
import ProfileAdmin from "../admins/ProfileAdmin";
import ProfilePatientBank from "../patientBank/ProfilePatientBank";
import ProfileSupervisor from "../supervisor/ProfileSupervisor";
import Profile from "../students/Profile";
import NavbarRoot from "./NavbarRoot";
import ModalSetAdminDiv from "./ModalSetAdminDiv";
import LoginByEmail from "../../components/LoginByEmail";
import Cookies from "js-cookie";

function ProfileRoot() {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = Cookies.get("role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);


  const userName = user.name;
  const userEmail = user.email;

  const handleSelectRole = (selectedRole) => {
    Cookies.set("role", selectedRole);
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
  } else if (role === "ptBank") {
    return <ProfilePatientBank />; // Render Profile component if role is 'ptBank'
  } else if (role === "supervisor") {
    return <ProfileSupervisor />; // Render Profile component if role is 'supervisor'
  }

  if (!userEmail) {
    return <LoginByEmail />;
  }

  return (
    <>
      <NavbarRoot />
      <Container fluid>
        <Row className="justify-content-center">
          <Col>
            <div className="d-flex justify-content-center mb-4">
              <h2>Welcome Back Root!</h2>
            </div>
            <div className="d-flex justify-content-center mb-4">
              <img
                // src={userPicture}
                src={'/images/root.png'}
                alt={`Profile`}
                className="rounded-circle"
                width="180"
                height="180"
              />
            </div>
            <div className="d-flex justify-content-center mb-4">
              <h3>{userName}</h3>
            </div>
            <div className="d-flex justify-content-center mb-4">
              <h5>If you don't want to be 'Root';</h5>
            </div>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col className="d-flex justify-content-center">
            <div className="d-grid gap-2">
              <Button variant="secondary" size="lg" onClick={() => handleSelectRole("supervisor")}>
                SUPERVISOR
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
              <Button variant="secondary" size="lg" onClick={() => handleSelectRole("ptBank")}>
                PATIENT BANK
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
