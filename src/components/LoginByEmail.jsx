import React, { useState, useEffect } from "react";
import "../Navbar.css";
import {
  getAllUsers,
  getStudentByEmail,
  getInstructorByEmail,
} from "../features/apiCalls";
import Profile from "../pages/students/Profile";
import ProfileInstructor from "../pages/instructors/ProfileInstructor";
import ProfileRoot from "../pages/root/ProfileRoot";
import ProfilePatientBank from "../pages/patientBank/ProfilePatientBank";
import SelectRoleAdmin from "../pages/admins/SelectRoleAdmin";
import ProfileSupervisor from "../pages/supervisor/ProfileSupervisor";
import Cookies from "js-cookie";
import LoginScreen from "./LoginScreen";

function LoginByEmail() {
  const [email, setEmail] = useState(Cookies.get("email") || "");
  const [token, setToken] = useState(Cookies.get("token") || "");
  const [role, setRole] = useState(Cookies.get("role") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpVerified, setOtpVerified] = useState(Cookies.get('otpVerified') || false); // New state for OTP verification

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (otpVerified) {
      const savedEmail = Cookies.get("email");
      const savedToken = Cookies.get("token");
      setEmail(savedEmail);
      setToken(savedToken);
    }
  }, [otpVerified]);

  //console.log("otpVerified", otpVerified); // Log the value of otpVerified
  //console.log("user", user); // Log the value of user

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (email && token && otpVerified) {
        try {
          const users = await getAllUsers();
          const userRecord = users.data.find(
            (u) => u.email === email.toLowerCase()
          );

          if (!userRecord) {
            throw new Error("User not found");
          }

          if (userRecord.role === "student") {
            try {
              const student = await getStudentByEmail(email.toLowerCase());
              if (student) {
                userRecord.role = "student";
                userRecord.name = student[0].studentName;
              }
            } catch (error) {
              console.error("Error fetching student profile:", error);
              alert(
                `Expired cookies. Try logging in again.`
              );
              return;
            }
          } else if (
            ["instructor", "admin", "ptBank", "supervisor", "root"].includes(
              userRecord.role
            )
          ) {
            try {
              const instructor = await getInstructorByEmail(
                email.toLowerCase()
              );
              if (instructor) {
                userRecord.name = instructor[0].instructorName;
                userRecord.division = instructor[0].division;
              }
            } catch (error) {
              console.error("Error fetching instructor profile:", error);
              alert(
                `Expired cookies. Try logging in again. If the problem persists, contact system administrator (Browser Login with ${email}).`
              );
              return;
            }
          }

          if (userRecord) {
            setCookies(userRecord);
            setRole(userRecord.role);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          alert(
            `Cookies expired. Try logging in again. (Login with ${email}).`
          );
          Cookies.remove("token");
          Cookies.remove("email");
          Cookies.remove("role");
          Cookies.remove("user");
          window.location.reload();
        }
      } else {
      }
    };

    if (isLoggedIn || (email && token && otpVerified)) {
      fetchUserProfile();
    } else {
      setEmail("");
      setToken("");
      setRole("");
    }
  }, [isLoggedIn, email, token, otpVerified]); // Added otpVerified as a dependency

  const setCookies = (userRecord) => {
    const lowercaseEmail = userRecord.email.toLowerCase();

    Cookies.set("role", userRecord.role, { expires: 1 });
    Cookies.set(
      "user",
      JSON.stringify({ ...userRecord, email: lowercaseEmail }),
      { expires: 1 }
    );
  };

  const renderProfile = () => {
    switch (role) {
      case "root":
        return <ProfileRoot />;
      case "admin":
        return <SelectRoleAdmin />;
      case "instructor":
        return <ProfileInstructor />;
      case "student":
        return <Profile />;
      case "ptBank":
        return <ProfilePatientBank />;
      case "supervisor":
        return <ProfileSupervisor />;
      default:
        return (
          <LoginScreen
            handleLoginSuccess={handleLoginSuccess}
            setOtpVerified={setOtpVerified}
          />
        );
    }
  };

  return (
    <>
      {email && role ? (
        renderProfile()
      ) : (
        <LoginScreen
          handleLoginSuccess={handleLoginSuccess}
          setOtpVerified={setOtpVerified}
        />
      )}
    </>
  );
}

export default LoginByEmail;
