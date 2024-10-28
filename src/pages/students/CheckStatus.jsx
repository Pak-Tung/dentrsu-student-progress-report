import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Cookies from "js-cookie";
import ChartReports from "../Reports/ChartReports";

const CheckStatus = () => {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email;

  return (
    <>
      <Navbar />
      <ChartReports studentEmail={userEmail} />
    </>
  );
};

export default CheckStatus;
