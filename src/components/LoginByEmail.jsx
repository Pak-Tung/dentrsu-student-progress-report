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
import SelectRoleAdmin from "../pages/admins/SelectRoleAdmin";
import Cookies from "js-cookie";
import LoginScreen from "./LoginScreen";
import * as loadingData from "./loading.json";
import * as successData from "./success.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import { Container, Row } from "react-bootstrap";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const defaultOptions2 = {
  loop: true,
  autoplay: true,
  animationData: successData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

// Custom hook for managing local storage state
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
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
  const [loading, setLoading] = useState(true); // Initially true to show the loading animation
  const [success, setSuccess] = useState(false);

  const handleLoginSuccess = () => {
    setToken(localStorage.getItem("token"));
    setEmail(localStorage.getItem("email"));
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (email && token) {
        try {
          const users = await getAllUsers();
          const userRecord = users.data.find((u) => u.email === email);

          if (!userRecord) {
            throw new Error("User not found");
          }

          if (userRecord.role === "student") {
            try {
              const student = await getStudentByEmail(email);
              if (student) {
                userRecord.role = "student";
                userRecord.name = student[0].studentName;
              }
            } catch (error) {
              console.error("Error fetching student profile:", error);
              alert("Student profile not found. Please contact administrator.");
              setLoading(false);
              return;
            }
          } else if (
            userRecord.role === "instructor" ||
            userRecord.role === "admin" ||
            userRecord.role === "root"
          ) {
            try {
              const instructor = await getInstructorByEmail(email);
              if (instructor) {
                userRecord.name = instructor[0].instructorName;
                userRecord.division = instructor[0].division;
              }
            } catch (error) {
              console.error("Error fetching instructor profile:", error);
              alert("Instructor profile not found. Please contact administrator.");
              setLoading(false);
              return;
            }
          }

          if (userRecord) {
            setCookiesAndLocalStorage(userRecord);
            setUser(userRecord);
            setRole(userRecord.role);
            setSuccess(true);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          alert("User profile not found. Please contact administrator.");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (isLoggedIn || (email && token)) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, email, token]);

  const setCookiesAndLocalStorage = (userRecord) => {
    Cookies.set("role", JSON.stringify(userRecord.role), { expires: 7 });
    Cookies.set("user", JSON.stringify(userRecord), { expires: 7 });

    localStorage.setItem("role", JSON.stringify(userRecord.role));
    localStorage.setItem("user", JSON.stringify(userRecord));
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
      default:
        return <LoginScreen handleLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <>
      {user && role ? (
        <>
          {success ? (
            renderProfile()
          ) : (
            <FadeIn>
              <div>
                {loading ? (
                  <Container>
                    <Row className="d-flex justify-content-center">
                      <Lottie
                        options={defaultOptions}
                        height={140}
                        width={140}
                      />
                    </Row>
                  </Container>
                ) : (
                  <Container>
                    <Row className="d-flex justify-content-center">
                      <Lottie
                        options={defaultOptions2}
                        height={140}
                        width={140}
                      />
                    </Row>
                  </Container>
                )}
              </div>
            </FadeIn>
          )}
        </>
      ) : (
        <LoginScreen handleLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default LoginByEmail;
