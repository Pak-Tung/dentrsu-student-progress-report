import React from "react";
import EmailVerificationButton from "./EmailVerificationButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function LoginScreen({ handleLoginSuccess }) {
  return (
    <Container>
      <Row className="d-flex justify-content-center">
        <Col className="text-center">
        <h3>Comprehensive Dental Care Clinic</h3>
          <h2>DentRSU Connect</h2>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        <Col className="text-center">
          <img src="/logo_png.png" alt="Logo" width="250" />
        </Col>
      </Row>
      <br />
      <Row className="d-flex justify-content-center">
        <Col className="text-center">
          <p>Only <b>"@rsu.ac.th"</b>  Account</p>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        <Col md={4}></Col>
        <Col md={4} className="d-flex justify-content-center">
          <div className="d-grid gap-2">
            <EmailVerificationButton handleLoginSuccess={handleLoginSuccess} />
          </div>
        </Col>
        <Col md={4}></Col>
      </Row>
    </Container>
  );
}

export default LoginScreen;
