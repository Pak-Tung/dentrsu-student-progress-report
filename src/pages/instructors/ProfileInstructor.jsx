import React, { useState, useEffect, useCallback, useContext } from "react";
import NavbarInstructor from "../../components/NavbarInstructor";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginByEmail from "../../components/LoginByEmail";
import { getInstructorByEmail } from "../../features/apiCalls";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";
import { Alert } from "react-bootstrap";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";

function ProfileInstructor() {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const savedUser = Cookies.get("user");
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : {});
  //console.log(user);
  const userEmail = user.email;
  const userName = user.name;
  const userPicture = user.picture;

  const savedInstructor = Cookies.get("instructor");
  const [instructor, setInstructor] = useState(savedInstructor ? savedInstructor : {});

  useEffect(() => {
    if (userEmail) {
      const fetchInstructorData = async () => {
        try {
          const result = await getInstructorByEmail(userEmail);
          if (result.error) {
            setError(result.error);
          } else if (result[0]) {
            //console.log(result[0]);
            setInstructor(result[0]);
            Cookies.set("instructor", JSON.stringify(result[0]), { expires: 1 });
            Cookies.set("division", result[0].division, { expires: 1 });
          } else {
            setError("Instructor data is undefined");
          }
        } catch (err) {
          setError("Failed to fetch instructor data");
        } finally {
          setLoading(false);
        }
      };
      fetchInstructorData();
    }
  }, [userEmail]);

  const navigate = useNavigate();
  const logOut = useCallback(() => {
    Cookies.remove("user");
    Cookies.remove("role");
    Cookies.remove("instructor");
    Cookies.remove("division");
    Cookies.remove("email");
    Cookies.remove("token");
    Cookies.remove("otpVerified");
    setUser({});
    navigate("/");
    window.location.reload();
  }, [navigate]);

  if (!userEmail) {
    return <LoginByEmail />;
  }

  return (
    <>
      <NavbarInstructor />
      <div className={`container-fluid mt-5 ${theme === 'dark' ? 'bg-dark' : ''}`} style={{ minHeight: '100vh' }}>
        <div className="d-flex justify-content-center mb-4">
          <h2 className={theme === 'dark' ? 'text-white' : ''}>Instructor Profile</h2>
        </div>

        {loading ? (
          <LoadingComponent />
        ) : error ? (
          <div className="d-flex justify-content-center">
            <Alert variant="danger">{error}</Alert>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-center mb-4">
              <img
                src={userPicture || "/images/instructor.jpg"}
                alt="Profile"
                className="rounded-circle"
                width="200"
                height="200"
              />
            </div>
            <div className="d-flex justify-content-center">
              <div className="card" style={{ width: "18rem" }}>
                <div className={`card-header text-center ${theme === 'dark' ? 'bg-secondary text-white' : ''}`}>
                  <h5 className="card-title">{userName}</h5>
                  <p className="card-text">Email: {userEmail}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className={`list-group-item ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
                    Division: {instructor.division}
                  </li>
                  <li className={`list-group-item text-center list-group-item-secondary ${theme === 'dark' ? 'bg-secondary text-white' : ''}`}>
                    <b>Team Leader Role</b>
                  </li>
                  <li className={`list-group-item ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>Floor: {instructor.floor}</li>
                  <li className={`list-group-item ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>Bay: {instructor.bay}</li>
                </ul>
                <div className={`card-footer ${theme === 'dark' ? 'bg-secondary text-white' : ''}`}>
                  <div className="d-grid gap-2 col-12 mx-auto">
                    <button className={theme === 'dark' ? "btn btn-outline-light" : "btn btn-outline-danger"} onClick={logOut}>
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ProfileInstructor;
