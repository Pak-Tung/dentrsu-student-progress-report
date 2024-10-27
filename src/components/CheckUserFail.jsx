import React from "react";
import EmailVerificationButton from "./EmailVerificationButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoginScreen from "./LoginScreen";

function CheckUserFail({ handleLoginError }) {
  handleLoginError();

  return <LoginScreen />;
}

export default CheckUserFail;
