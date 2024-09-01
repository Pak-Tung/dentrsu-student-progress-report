import React, { useState, useEffect, useCallback, useContext } from "react";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import { getStudentByEmail } from "../../features/apiCalls";
import { getTeamLeaderByEmail } from "../../features/apiTL";
import LoginByEmail from "../../components/LoginByEmail";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Badge,
  Alert,
  Button,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
import * as successData from "../../components/success.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import { ThemeContext } from "../../ThemeContext";
import "../../DarkMode.css";
import { updateUserPictureByEmail } from "../../features/apiCalls";


const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function Profile() {
  const { theme } = useContext(ThemeContext);

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
  const [showTextbox, setShowTextbox] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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
            setUser((prevUser) => ({ ...prevUser, picture: result[0].image }));
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
      if (student.teamleaderEmail) { 
        setLoading(true);
        try {
          const res = await getTeamLeaderByEmail(student.teamleaderEmail);
          console.log(res);
          if (res.error) {
            setError(res.error);
          } else if (res.data[0]) {
            setTeamLeader(res.data[0]);
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
  }, [student.teamLeaderEmail]);

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

  const handleImageClick = () => {
    setShowTextbox(true);
    showTextbox === true?setShowTextbox(false):setShowTextbox(true);
  };

  const handleImageSubmit = async () => {
    try {
      // Assuming you have an API endpoint to update the user picture
      const response = await updateUserPictureByEmail(userEmail, {
        imgUrl: imageUrl,
      }); // Replace with your actual API call
      console.log(response);
      if (response.error) {
        setError(response.error);
      } else {
        setUser((prevUser) => ({ ...prevUser, picture: imageUrl }));
        Cookies.set("user", JSON.stringify({ ...user, picture: imageUrl }));
        setShowTextbox(false);
        alert("Profile picture updated successfully");
      }
    } catch (err) {
      setError("Failed to update profile picture");
    }
  };

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
      <div
        className={`container-fluid mt-5 ${theme === "dark" ? "bg-dark" : ""}`}
        style={{ minHeight: "100vh" }}
      >
        <div className="d-flex justify-content-center mb-4">
          <h2 className={theme === "dark" ? "text-white" : ""}>
            Student Profile
          </h2>
        </div>
        <div className="d-flex justify-content-center mb-4 position-relative">
          <img
            src={userPicture || "/images/student_jpg.jpg"}
            alt="Profile"
            className="rounded-circle"
            width="100"
            height="100"
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          />
        </div>
        {showTextbox && (
          <div className="d-flex justify-content-center">
            <div className="card" style={{ width: "18rem" }}>
              <InputGroup className="">
                <FormControl
                  placeholder="Enter profile picture URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={handleImageSubmit}>
                  Submit
                </Button>
              </InputGroup>
            </div>
          </div>
        )}

        <Row>
          <Col className="d-flex justify-content-center mb-2">
            <Badge bg={student.status === "Complete" ? "success" : "danger"}>
              {student.status === "Complete" ? "Complete" : "Incomplete"}
            </Badge>
          </Col>
        </Row>
        {error ? (
          <div className="d-flex justify-content-center">
            <Alert variant="danger">{error}</Alert>
          </div>
        ) : success ? (
          <div className="d-flex justify-content-center">
            <div className="card" style={{ width: "18rem" }}>
              <div
                className={`card-header text-center ${
                  theme === "dark" ? "bg-secondary text-white" : ""
                }`}
              >
                <h5 className="card-title">Name: {userName}</h5>
                <p className="card-text">Email: {userEmail}</p>
              </div>
              <ul className="list-group list-group-flush">
                <li
                  className={`list-group-item ${
                    theme === "dark" ? "bg-dark text-white" : ""
                  }`}
                >
                  Year: {calculateStudentYear(student.startClinicYear)}th
                </li>
                <li
                  className={`list-group-item ${
                    theme === "dark" ? "bg-dark text-white" : ""
                  }`}
                >
                  Floor: {student.floor}
                </li>
                <li
                  className={`list-group-item ${
                    theme === "dark" ? "bg-dark text-white" : ""
                  }`}
                >
                  Unit: {student.bay + student.unitNumber}
                </li>
                <li
                  className={`list-group-item ${
                    theme === "dark" ? "bg-dark text-white" : ""
                  }`}
                >
                  Status: {student.status}
                </li>
                <li
                  className={`list-group-item text-center list-group-item-secondary ${
                    theme === "dark" ? "bg-secondary text-white" : ""
                  }`}
                >
                  == Team Leader ==
                </li>
                <li
                  className={`list-group-item text-center ${
                    theme === "dark" ? "bg-dark text-white" : ""
                  }`}
                >
                  {teamLeader.title}. {teamLeader.instructorName}
                </li>
              </ul>
              <div
                className={`card-footer ${
                  theme === "dark" ? "bg-secondary text-white" : ""
                }`}
              >
                <div className="d-grid gap-2 col-12 mx-auto">
                  <button
                    className={
                      theme === "dark"
                        ? "btn btn-outline-light"
                        : "btn btn-outline-danger"
                    }
                    onClick={logOut}
                  >
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
