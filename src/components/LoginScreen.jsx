import React from "react";
import EmailVerificationButton from "./EmailVerificationButton";
import EmailOTP from "./EmailOTP";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function LoginScreen({ handleLoginSuccess }) {
  return (
    <Container>
      <Row className="d-flex justify-content-center">
        <Col className="text-center">
          <h4>Comprehensive Dental Care Clinic</h4>
          <br />
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
          <p>
            Only <b>"@rsu.ac.th"</b> Account
          </p>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        <Col></Col>
        <Col
          xs={12}
          sm={10}
          md={8}
          lg={6}
          className="d-flex justify-content-center"
        >
          <div className="d-grid gap-2">
            {/* <EmailVerificationButton handleLoginSuccess={handleLoginSuccess} /> */}
            <EmailOTP handleLoginSuccess={handleLoginSuccess} />
          </div>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default LoginScreen;
