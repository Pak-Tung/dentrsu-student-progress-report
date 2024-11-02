import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ProfileInstructor from "../instructors/ProfileInstructor";
import ProfileAdmin from "./ProfileAdmin";
import Cookies from "js-cookie";
import LoginByEmail from "../../components/LoginByEmail";

function SelectRoleAdmin() {
  const [user, setUser] = useState({});
  const [role, setRole] = useState("");

  const email = Cookies.get("email");

  useEffect(() => {
    const savedUser = Cookies.get("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data from Cookies:", error);
      }
    }

    const savedRole = Cookies.get("role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleSelectRole = (selectedRole) => {
    Cookies.set("role", selectedRole);
    setRole(selectedRole);
    //console.log("Selected Role:", selectedRole);
  };

  const { name: userName } = user;

  if (role === "instructor") {
    return <ProfileInstructor />;
  } else if (role === "admin") {
    return <ProfileAdmin />;
  }

  return (
    <>
      {email ? (
        <>
          <Container fluid>
            <Row className="justify-content-center">
              <Col md={4}></Col>
              <Col md={4} className="text-center">
                <h2>Welcome Back!</h2>
              </Col>
              <Col md={4}></Col>
            </Row>
            <Row>
              <Col md={4}></Col>
              <Col md={4} className="text-center">
                <img
                  src={"/images/admin.jpg"}
                  alt={`Profile`}
                  className="rounded-circle mb-4"
                  width="100"
                  height="100"
                />
                <h3>{userName}</h3>
              </Col>
              <Col md={4}></Col>
            </Row>
            <br />
            <Row>
              <Col className="text-center">
                <h5>Please Select Role to Login</h5>
              </Col>
            </Row>
            <br />
            <Row className="justify-content-center">
              <Col md={4}></Col>
              <Col className="text-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => handleSelectRole("admin")}
                >
                  ADMIN
                </Button>
              </Col>
              <Col md={4}></Col>
            </Row>
            <br />
            <Row className="justify-content-center">
              <Col md={4}></Col>
              <Col className="text-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => handleSelectRole("instructor")}
                >
                  INSTRUCTOR
                </Button>
              </Col>
              <Col md={4}></Col>
            </Row>
          </Container>
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default SelectRoleAdmin;
