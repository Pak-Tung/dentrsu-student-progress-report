import React, { useState, useContext } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { Container, Row, Col, Form, Alert, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "../App.css";
import { ThemeContext } from "../ThemeContext";
import { sendOTP } from "../features/apiEmailOTP";
import Cookies from "js-cookie";

const InputGroupField = ({
  id,
  label,
  placeholder,
  name,
  value,
  onChange,
  disabled,
  required,
  className,
  type = "text",
}) => (
  <InputGroup className="mb-3">
    <InputGroup.Text id={id} className={className}>
      {label}:
    </InputGroup.Text>
    <Form.Control
      type={type}
      placeholder={placeholder}
      aria-label={label.toLowerCase()}
      aria-describedby={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={className}
    />
  </InputGroup>
);

function EmailOTP({ handleLoginSuccess, setOtpVerified }) {
  const { theme } = useContext(ThemeContext);
  const themeClass = theme === "dark" ? "form-control-dark" : "";

  const [userEmail, setUserEmail] = useState("");
  const [userOTP, setUserOTP] = useState("");
  const [error, setError] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    // Validate email to ensure it is a proper @rsu.ac.th email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@rsu\.ac\.th$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");

    // Validate email before proceeding
    if (!userExists && !validateEmail(userEmail)) {
      setError("Please enter a valid @rsu.ac.th email address.");
      return;
    }

    setLoading(true);

    const checkMaintenanceTime = () => {
      const now = new Date();
      const bangkokTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
      );
      const hours = bangkokTime.getHours();

      if (hours >= 0 && hours < 8) {
        return "Server maintenance between 0 A.M. to 8 A.M.";
      } else {
        return "An error occurred while communicating with the server. Please try again later.";
      }
    };

    try {
      const response = await sendOTP(userEmail, userOTP);
      //console.log(response);
      if (response && response === "OTP via email") {
        setUserExists(true);
        setMessage(
          "OTP has been sent to your email. Please check your inbox and enter the OTP."
        );
      } else if (response && response.status === 200 && userOTP !== "") {
        //console.log(response);
        const token = response.token;
        const email = response.userEmail;
        Cookies.set("token", token, { expires: 1 });
        Cookies.set("email", email, { expires: 1 });
        Cookies.set("otpVerified", true, { expires: 1 });
        setMessage("OTP verified successfully. Logging you in...");
        setOtpVerified(true); // Notify parent component that OTP was verified
        handleLoginSuccess();
      } else if (
        response &&
        response.message === "OTP verification failed. Incorrect OTP."
      ) {
        setError(
          "OTP verification failed. Please check your OTP and try again."
        );
      } else {
        setError(
          error.response.data.message || "An error occurred. Please try again."
        );
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        console.error("An error occurred:", error);
        setError(
          // `${userEmail} not found in the database. Please register first.`
          // "An error occurred while communicating with the server. Please try again later."
          checkMaintenanceTime
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit} className={theme}>
      <Container fluid>
        <Row className="justify-content-center">
          <Col>
            <InputGroupField
              id="userEmail"
              label="Email"
              placeholder="Enter @rsu.ac.th email"
              name="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value.toLowerCase())} // Convert to lowercase
              disabled={userExists || loading}
              required
              className={themeClass}
            />
          </Col>
        </Row>
        {userExists && (
          <Row className="justify-content-center">
            <Col>
              <InputGroupField
                id="userOTP"
                label="OTP"
                placeholder="Enter OTP"
                name="userOTP"
                value={userOTP}
                onChange={(e) => setUserOTP(e.target.value)}
                required
                className={themeClass}
                disabled={loading}
                type="password"
              />
            </Col>
          </Row>
        )}
        {message && (
          <Row className="justify-content-center">
            <Col>
              <Alert variant="info">{message}</Alert>
            </Col>
          </Row>
        )}
        {error && (
          <Row className="justify-content-center">
            <Col>
              <Alert variant="danger">{error}</Alert>
            </Col>
          </Row>
        )}
        {loading && (
          <Row className="justify-content-center">
            <Col className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Please wait while we verify the email...</p>
            </Col>
          </Row>
        )}
        <Row>
          <div className="d-grid gap-2">
            <Button
              variant={
                userExists
                  ? theme === "dark"
                    ? "outline-light"
                    : "success"
                  : theme === "dark"
                  ? "secondary"
                  : "dark"
              }
              size="lg"
              type="submit"
              disabled={loading || (!userExists && !userEmail)}
            >
              {userExists ? "Login" : "Request OTP Verification"}
            </Button>
          </div>
        </Row>
      </Container>
    </Form>
  );
}

export default EmailOTP;
