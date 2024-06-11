import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ProfileInstructor from "../instructors/ProfileInstructor";
import ProfileAdmin from "./ProfileAdmin";

function SelectRoleAdmin() {
  const [user, setUser] = useState({});
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }

    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleSelectRole = (selectedRole) => {
    localStorage.setItem("role", selectedRole);
    setRole(selectedRole);
    console.log("Selected Role:", selectedRole);
  };

  const { name: userName, picture: userPicture } = user;

  if (role === "instructor") {
    return <ProfileInstructor />;
  } else if (role === "admin") {
    return <ProfileAdmin />;
  }

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col className="text-center">
          <h2>Welcome Back!</h2>
          <img
            src={userPicture}
            alt={`${userName}'s profile`}
            className="rounded-circle mb-4"
            width="100"
            height="100"
          />
          <h3>{userName}</h3>
          <h5>Please Select Role to Login</h5>
          <div className="d-grid gap-2">
            <Button variant="secondary" size="lg" onClick={() => handleSelectRole("admin")}>
              ADMIN
            </Button>
            <Button variant="secondary" size="lg" onClick={() => handleSelectRole("instructor")}>
              INSTRUCTOR
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SelectRoleAdmin;
