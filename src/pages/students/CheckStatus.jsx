import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import Cookies from "js-cookie";
import ChartReports from "../Reports/ChartReports";
import LoginByEmail from "../../components/LoginByEmail";

const CheckStatus = () => {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email;

  return (
    <>
      {userEmail ? (
        <>
          <Navbar />
          <ChartReports studentEmail={userEmail} />
        </>
      ) : (
        <div>
          <LoginByEmail />
        </div>
      )}
    </>
  );
};

export default CheckStatus;
