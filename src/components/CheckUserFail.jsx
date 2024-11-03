import React from "react";
import LoginScreen from "./LoginScreen";

function CheckUserFail({ handleLoginError }) {
  handleLoginError();
  return <LoginScreen />;
}

export default CheckUserFail;
