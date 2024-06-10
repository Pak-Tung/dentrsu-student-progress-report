import React, { useState, useEffect, useCallback } from "react";
import NavbarAdmin from './NavbarAdmin';
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import GoogleLogin from "../../components/GoogleLogin";
import { googleLogout } from '@react-oauth/google';
import { getInstructorByEmail } from "../../features/apiCalls";


function ProfileAdmin() {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email;
  const userName = user.name;
  const userPicture = user.picture;

  const [instructor, setInstructor] = useState({});

  useEffect(() => {
    if (userEmail) {
      const fetchInstructorData = async () => {
        try {
          const result = await getInstructorByEmail(userEmail);
          if (result.error) {
            console.log(result.error);
          } else if (result[0]) {
            setInstructor(result[0]);
            Cookies.set('instructor', result[0], { expires: 7 });
            localStorage.setItem('division', JSON.stringify(result[0].division));
          } else {
            console.log("Instructor data is undefined");
          }
        } catch (err) {
          console.log("Failed to fetch instructor data");
        }
      };
      fetchInstructorData();
    }
  }, [userEmail]);
  


  const logOut = useCallback(() => {
    googleLogout();
    setUser({});
    Cookies.remove('user');
  }, []);

  if (!userEmail) {
    return <GoogleLogin />;
  }
  return (
    <>
      <NavbarAdmin />
      <div className="container mt-5">
        <div className="d-flex justify-content-center mb-4">
          <h2>Admin Profile</h2>
        </div>
        <div className="d-flex justify-content-center mb-4">
          <img
            src={userPicture}
            alt={`${userName}'s profile`}
            className="rounded-circle"
            width="100"
            height="100"
          />
        </div>
        <div className="d-flex justify-content-center">
        <div className="card" style={{ width: "18rem" }}>
              <div className="card-header text-center">
                <h5 className="card-title">{userName}</h5>
                <p className="card-text">Email: {userEmail}</p>
              </div>
              <ul className="list-group list-group-flush">
              <li className="list-group-item">Division: {instructor.division}</li>
              </ul>
              <div className="card-footer">
                <div className="d-grid gap-2 col-12 mx-auto">
                  <button className="btn btn-outline-danger" onClick={logOut}>
                    Log out
                  </button>
                </div>
              </div>
            </div>

        </div>
      </div>
    </>
  )
}

export default ProfileAdmin