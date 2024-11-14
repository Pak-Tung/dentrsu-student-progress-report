import React from "react";
import EmailOTP from "./EmailOTP";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "../App.css";

function LoginScreen({ handleLoginSuccess, setOtpVerified }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="mt-5">
      <Container fluid>
        <Row className="d-flex justify-content-center">
          <Col className="text-center">
            <h4>Comprehensive Dental Care Clinic</h4>
            <br />
            <h2>DentRSU Connect</h2>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col className="text-center">
            <img src={theme === "light"?"/logo_png.png":"/logo_png_dark.png"} alt="Logo" width="250" />
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
          <Col
            xs={12}
            sm={10}
            md={8}
            lg={6}
            className="d-flex justify-content-center"
          >
            <div className="d-grid gap-2">
              <EmailOTP
                handleLoginSuccess={handleLoginSuccess}
                setOtpVerified={setOtpVerified}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginScreen;
