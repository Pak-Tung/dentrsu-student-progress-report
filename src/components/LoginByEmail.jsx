import React, { useState, useEffect } from "react";
import EmailVerificationButton from "./EmailVerificationButton";
import "../Navbar.css";
import {
  getAllUsers,
  getStudentByEmail,
  getInstructorByEmail,
} from "../features/apiCalls";
import Profile from "../pages/students/Profile";
import ProfileInstructor from "../pages/instructors/ProfileInstructor";
import ProfileRoot from "../pages/root/ProfileRoot";
import SelectRoleAdmin from "../pages/admins/SelectRoleAdmin";
import Cookies from "js-cookie";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoginScreen from "./LoginScreen";

// Custom hook for managing local storage state
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? item : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

function LoginByEmail() {
  const [token, setToken] = useLocalStorage("token", null);
  const [email, setEmail] = useLocalStorage("email", null);
  const [role, setRole] = useLocalStorage("role", "");
  const [user, setUser] = useLocalStorage("user", {});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setToken(localStorage.getItem("token"));
    setEmail(localStorage.getItem("email"));
    setIsLoggedIn(true);
    //console.log("user", user);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (email && token) {
        //console.log("Fetching user profile with token:", token, email);
        try {
          const users = await getAllUsers();
          const userRecord = users.data.find((u) => u.email === email);
          userRecord.name = "";
          //console.log("User record:", users);

          if (users.data.role === "student") {
            try {
              const student = await getStudentByEmail(email);

              if (student) {
                if (userRecord.role === "root" || userRecord.role === "admin") {
                } else {
                  userRecord.role = "student";
                }
                userRecord.name = student[0].studentName;
                //console.log("Setting user profile student:", student[0]);
              }
            } catch (error) {
              console.error("Error fetching student profile:", error);
              alert("Student profile not found. Please contact administrator.");
            }
          } else if (users.data.role === "instructor" || users.data.role === "admin" || users.data.role === "root"){
            try {
              const instructor = await getInstructorByEmail(email);
              if (instructor) {
                if (userRecord.role === "root" || userRecord.role === "admin") {
                } else {
                  userRecord.role = "instructor";
                }
                userRecord.name = instructor[0].instructorName;
                userRecord.division = instructor[0].division;
                //console.log("Setting user profile instructor:", instructor);
              }
            } catch (error) {
              console.error("Error fetching instructor profile:", error);
              alert(
                "Instructor profile not found. Please contact administrator."
              );
            }
          }

          if (userRecord) {
            Cookies.set("role", userRecord.role, { expires: 7 });
            Cookies.set("user", JSON.stringify(userRecord), { expires: 7 });

            localStorage.setItem("role", userRecord.role);
            localStorage.setItem("user", JSON.stringify(userRecord));

            userRecord.role === "admin"
              ? localStorage.setItem("role", "pre-admin")
              : localStorage.setItem("role", userRecord.role);

            userRecord.role === "admin"
              ? Cookies.set("role", "pre-admin")
              : Cookies.set("role", userRecord.role);

            //console.log("final user", userRecord);
            setUser(userRecord);
            setRole(userRecord.role);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          alert("User profile not found. Please contact administrator.");
        }
      }
    };

    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn, email, token]);

  const renderProfile = () => {
    if (user === null || role === null || user === undefined || role === undefined) {
      return (
        <LoginScreen
          handleLoginSuccess={handleLoginSuccess}
        />
      );
    } else if (role === "root") {
      return <ProfileRoot />;
    } else if (role === "admin") {
      return <SelectRoleAdmin />;
    } else if (role === "instructor") {
      return <ProfileInstructor />;
    } else if (role === "student") {
      return <Profile />;
    } else {
      return (
        <LoginScreen
          handleLoginSuccess={handleLoginSuccess}
        />
      );
    }
  };

  useEffect(() => {
    if (user && role) {
      renderProfile();
    }
  }, [user, role]);

  return (
    <>
      {user && token && role ? (
        renderProfile()
      ) : (
        <LoginScreen handleLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default LoginByEmail;
