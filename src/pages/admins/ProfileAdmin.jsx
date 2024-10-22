import React, { useState, useEffect, useCallback } from "react";
import NavbarAdmin from "./NavbarAdmin";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginByEmail from "../../components/LoginByEmail";
import { getInstructorByEmail } from "../../features/apiCalls";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function ProfileAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email;
  const userName = user.name;
  const userPicture = user.picture;

  const [instructor, setInstructor] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (userEmail) {
      const fetchInstructorData = async () => {
        try {
          const result = await getInstructorByEmail(userEmail);
          if (result.error) {
            setError(result.error);
          } else if (result[0]) {
            setInstructor(result[0]);
            Cookies.set("instructor", result[0], { expires: 7 });
            localStorage.setItem(
              "division",
              JSON.stringify(result[0].division)
            );
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

  const logOut = useCallback(() => {
    Cookies.remove("user");
    Cookies.remove("role");
    Cookies.remove("instructor");
    localStorage.removeItem("user");
    localStorage.removeItem("instructor");
    localStorage.removeItem("role");
    localStorage.removeItem("division");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    setUser({});
    navigate("/");
    window.location.reload();
  }, [navigate]);

  if (!userEmail) {
    return <LoginByEmail />;
  }

  return (
    <>
      <NavbarAdmin />
      <div className="container mt-5">
        <div className="d-flex justify-content-center mb-4">
          <h2>Admin Profile</h2>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Lottie options={defaultOptions} height={120} width={120} />
          </div>

        ) : error ? (
          <div className="d-flex justify-content-center">
            <Alert variant="danger">{error}</Alert>
          </div>
        ) : (
          <>
            <div className="d-flex justify-content-center mb-4">
              <img
                // src={userPicture}
                //{"/images/admin.jpg"}
                src='https://img2.pic.in.th/pic/cat-cute.jpg'
                alt={`Profile`}
                className="rounded-circle"
                width="180"
                height="180"
              />
            </div>
            <div className="d-flex justify-content-center">
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-header text-center">
                  <h5 className="card-title">{userName}</h5>
                  <p className="card-text">Email: {userEmail}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    Division: {instructor.division}
                  </li>
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
          </>
        )}
      </div>
    </>
  );
}

export default ProfileAdmin;
