import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import { getStudentByEmail } from "../../features/apiCalls";
import { getTeamLeaderById } from "../../features/apiTL";
import LoginByEmail from "../../components/LoginByEmail";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Badge } from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
import * as successData from "../../components/success.json";
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

const defaultOptions2 = {
  loop: true,
  autoplay: true,
  animationData: successData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function Profile() {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email;
  const userName = user.name;
  const userPicture = user.picture;

  const [student, setStudent] = useState({});
  const [teamLeader, setTeamLeader] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (userEmail) {
        setLoading(true);
        try {
          const result = await getStudentByEmail(userEmail);
          if (result.error) {
            setError(result.error);
          } else if (result[0]) {
            setStudent(result[0]);
            setSuccess(true);
          } else {
            setError("Student data is undefined");
          }
        } catch (err) {
          setError("Failed to fetch student data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStudentData();
  }, [userEmail]);

  useEffect(() => {
    const fetchTeamLeaderData = async () => {
      if (student.teamLeaderId) {
        setLoading(true);
        try {
          const res = await getTeamLeaderById(student.teamLeaderId);
          if (res.error) {
            setError(res.error);
          } else if (res[0]) {
            setTeamLeader(res[0]);
            setSuccess(true);
          } else {
            setError("Team Leader data is undefined");
          }
        } catch (err) {
          setError("Failed to fetch team leader data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTeamLeaderData();
  }, [student.teamLeaderId]);

  const navigate = useNavigate();
  const logOut = useCallback(() => {
    Cookies.remove("user");
    Cookies.remove("role");
    Cookies.remove("instructor");
    localStorage.clear();
    setUser({});
    navigate("/");
    window.location.reload();
  }, [navigate]);

  if (!userEmail) {
    return <LoginByEmail />;
  }

  const calculateStudentYear = (startClinicYear) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
    return currentYear - startClinicYear + (currentMonth > 4 ? 5 : 4);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="d-flex justify-content-center mb-4">
          <h2>Student Profile</h2>
        </div>
        <div className="d-flex justify-content-center mb-4">
          <img
            src={userPicture || "/images/student_jpg.jpg"}
            alt="Profile"
            className="rounded-circle"
            width="100"
            height="100"
          />
        </div>
        <Row>
          <Col className="d-flex justify-content-center mb-2">
            <Badge
              bg={student.status === "Complete" ? "success" : "danger"}
            >
              {student.status === "Complete" ? "Complete" : "Incomplete"}
            </Badge>
          </Col>
        </Row>
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : success ? (
          <div className="d-flex justify-content-center">
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-header text-center">
                <h5 className="card-title">Name: {userName}</h5>
                <p className="card-text">Email: {userEmail}</p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  Year: {calculateStudentYear(student.startClinicYear)}th
                </li>
                <li className="list-group-item">Floor: {student.floor}</li>
                <li className="list-group-item">
                  Unit: {student.bay + student.unitNumber}
                </li>
                <li className="list-group-item">Status: {student.status}</li>
                <li className="list-group-item text-center list-group-item-secondary">
                  == Team Leader ==
                </li>
                <li className="list-group-item text-center">
                  {teamLeader.title}. {teamLeader.instructorName}
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
        ) : (
          <FadeIn>
            <div>
              <Container>
                <Row className="d-flex justify-content-center">
                  <Lottie options={defaultOptions} height={140} width={140} />
                </Row>
              </Container>
            </div>
          </FadeIn>
        )}
      </div>
    </>
  );
}

export default Profile;
