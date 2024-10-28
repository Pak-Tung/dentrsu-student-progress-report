import React, { useState, useEffect, useCallback } from "react";
import NavbarSupervisor from "./NavbarSupervisor";
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

function ProfileSupervisor() {
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
            Cookies.set("division", result[0].division, { expires: 7 });
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
    Cookies.remove("division");
    Cookies.remove("email");
    Cookies.remove("token");
    Cookies.remove("otpVerified");
    setUser({});
    navigate("/");
    window.location.reload();
  }, [navigate]);

  const fullNameDivision = useCallback((division) => {
    const divisionMap = {
      supervisor: "Supervisor",
      ptBank: "Patient Bank",
      oper: "Operative",
      endo: "Endodontic",
      perio: "Periodontic",
      prosth: "Prosthodontic",
      diag: "Diagnostic",
      radio: "Radiology",
      sur: "Oral Surgery",
      pedo: "Pediatric Dentistry",
      ortho: "Orthodontic",
    };
    return divisionMap[division] || "";
  }, []);

  if (!userEmail) {
    return <LoginByEmail />;
  }

  return (
    <>
      <NavbarSupervisor />
      <div className="container mt-5">
        <div className="d-flex justify-content-center mb-4">
          <h2>BOARD</h2>
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
            <div className="d-flex justify-content-center">
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-header text-center">
                  <h5 className="card-title">{userName}</h5>
                  <p className="card-text">Email: {userEmail}</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    {fullNameDivision(instructor.division)}
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

export default ProfileSupervisor;
