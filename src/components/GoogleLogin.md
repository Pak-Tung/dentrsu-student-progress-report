import React, { useState, useEffect, useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "../pages/students/Profile";
import { getAllUsers } from "../features/apiCalls";
import ProfileInstructor from "../pages/instructors/ProfileInstructor";
import ProfileRoot from "../pages/root/ProfileRoot";
import SelectRoleAdmin from "../pages/admins/SelectRoleAdmin";


function GoogleLogin() {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [userRole, setUserRole] = useState(() => Cookies.get("role") || "");
  const [profile, setProfile] = useState(() => {
    const savedProfile = Cookies.get("user");
    return savedProfile ? JSON.parse(savedProfile) : {};
  });

  const [role, setRole] = useState(userRole);
  const [loading, setLoading] = useState(false);  // Add a loading state

  const handleSuccess = useCallback((codeResponse) => {
    setUser(codeResponse);
    console.log("Login success, codeResponse:", codeResponse);
  }, []);

  const handleError = useCallback((error) => {
    console.error("Login Failed:", error);
  }, []);

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.access_token) {
        console.log("Fetching user profile with token:", user.access_token);
        setLoading(true);  // Set loading state to true while fetching
        try {
          const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: "application/json",
              },
            }
          );

          const users = await getAllUsers();
          const userRecord = users.data.find((u) => u.email === res.data.email);

          if (userRecord) {


            Cookies.set("user", JSON.stringify(res.data), { expires: 7 });
            Cookies.set("role", userRecord.role, { expires: 7 });
            localStorage.setItem("user", JSON.stringify(res.data));
            localStorage.setItem("role", userRecord.role);

            userRecord.role === 'admin'?localStorage.setItem("role", "pre-admin"):localStorage.setItem("role", userRecord.role);
            userRecord.role === 'admin'?Cookies.set("role", "pre-admin"):Cookies.set("role", userRecord.role);

            setRole(userRecord.role);
            setProfile(res.data);
            setUserRole(userRecord.role);
            window.location.reload();
            
          } else {
            alert("User role not found!!");
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          if (err.response && err.response.status === 401) {
            alert("Authentication error. Please log in again.");
            Cookies.remove("user");
            Cookies.remove("role");
            window.location.reload();
          }
        } finally {
          setLoading(false);  // Set loading state to false after fetching
        }
      } else {
        console.log("User is not logged in or access token is missing.");
      }
    };

    fetchUserProfile();
  }, [user]);

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  };

  return (
    <>
      {loading ? (
        <div style={containerStyle}>
          <p>Loading...</p>
        </div>
      ) : (
        profile.email && userRole ? (
          <>
            {console.log("user:", user)}
            {role === "student" && <Profile key={profile.email} user={profile} />}
            {role === "instructor" && <ProfileInstructor key={profile.email} user={profile} />}
            {role === "pre-admin" && <SelectRoleAdmin />}
            {role === "root" && <ProfileRoot key={profile.email} user={profile} />}
          </>
        ) : (
          <>
            <div className="d-flex justify-content-center">
              <h2>Online Requirements</h2>
            </div>
            <br />
            <div style={{ ...containerStyle, height: "10vh" }}>
              <p>Please Sign in with "@rsu.ac.th" Account</p>
            </div>
            <div style={{ ...containerStyle, height: "0vh" }}>
              <button className="btn btn-primary" onClick={login}>
                Sign in
              </button>
              <br />

            </div>
          </>
        )
      )}
    </>
  );
}

export default GoogleLogin;
