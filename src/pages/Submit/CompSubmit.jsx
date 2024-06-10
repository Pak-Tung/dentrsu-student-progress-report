import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import GoogleLogin from "../../components/GoogleLogin";
import Navbar from "../../components/Navbar";
import "../../pages/CustomStyles.css";
import CompForm from "./CompForm";
import { Container, Row, Col } from "react-bootstrap";

function CompSubmit() {
  if (Cookies.get("user") === undefined) {
    Cookies.set("user", JSON.stringify({}));
  } else {
    console.log("User email", Cookies.get("user"));
  }
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  return (
    <>
      {userEmail !== undefined ? (
        <>
          <Navbar />
          <Container>
            <Row className="justify-content-center">
              <Col md={6} className="text-center">
                <h4>Complete Case Submission</h4>
              </Col>
            </Row>
            <Row>
              <Col></Col>
              <Col md={6} className="text-center">
                <CompForm />
              </Col>
              <Col></Col>
            </Row>
          </Container>
        </>
      ) : (
        <div>
          <GoogleLogin />
        </div>
      )}
    </>
  );
}

export default CompSubmit;
