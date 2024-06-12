import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import { getStudentByEmail } from "../../features/apiCalls";
import { getTeamLeaderById } from "../../features/apiTL";
import LoginByEmail from "../../components/LoginByEmail";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Badge,
} from "react-bootstrap";


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
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingTeamLeader, setLoadingTeamLeader] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userEmail) {
      const fetchStudentData = async () => {
        setLoadingStudent(true);
        try {
          const result = await getStudentByEmail(userEmail);
          if (result.error) {
            setError(result.error);
          } else if (result[0]) {
            setStudent(result[0]);
          } else {
            setError("Student data is undefined");
          }
        } catch (err) {
          setError("Failed to fetch student data");
        } finally {
          setLoadingStudent(false);
        }
      };
      fetchStudentData();
    }
  }, [userEmail]);

  useEffect(() => {
    if (student.teamLeaderId) {
      const fetchTeamLeaderData = async () => {
        setLoadingTeamLeader(true);
        try {
          const res = await getTeamLeaderById(student.teamLeaderId);
          if (res.error) {
            setError(res.error);
          } else if (res[0]) {
            setTeamLeader(res[0]);
          } else {
            setError("Team Leader data is undefined");
          }
        } catch (err) {
          setError("Failed to fetch team leader data");
        } finally {
          setLoadingTeamLeader(false);
        }
      };
      fetchTeamLeaderData();
    }
  }, [student.teamLeaderId]);

  const navigate = useNavigate();
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
    navigate('/');
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
            // src={userPicture}
            src={'/images/student.png'}
            alt={'Profile'}
            className="rounded-circle"
            width="100"
            height="100"
          />
        </div>
        <Row>
          <Col className="d-flex justify-content-center mb-2">
            <Badge
              bg={student.status === "Complete" ? "success" : "danger"}
              // pill
            >
              {student.status === "Complete" ? "Complete" : "Incomplete"}
            </Badge>
          </Col>
        </Row>
        {loadingStudent || loadingTeamLeader ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}

export default Profile;
