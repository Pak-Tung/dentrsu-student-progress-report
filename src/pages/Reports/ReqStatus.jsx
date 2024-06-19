import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getStudentByEmail, getAllDivisions } from "../../features/apiCalls";
import Cookies from "js-cookie";
import Navbar from "../../components/Navbar";
import StatusByDiv from "../../components/StatusByDiv";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";
import LoginByEmail from "../../components/LoginByEmail";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function ReqStatus() {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => {
    const cookieUser = Cookies.get("user");
    return cookieUser ? JSON.parse(cookieUser) : {};
  });

  const userEmail = user.email;
  const [student, setStudent] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(() => {
    return localStorage.getItem("selectedDivision") || "oper";
  });
  const [requirementLabel, setRequirementLabel] = useState(
    "Operative Requirement"
  );
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingDivisions, setLoadingDivisions] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (userEmail) {
        try {
          const result = await getStudentByEmail(userEmail);
          setLoadingStudent(true);
          if (result.error) {
            setError(result.error);
          } else if (result[0]) {
            setStudent(result[0]);
          } else {
            setError("No student data found");
          }
        } catch (error) {
          setError("Error fetching student data:", error);
        } finally {
          setLoadingStudent(false);
        }
      }
    };

    fetchStudentData();
  }, [userEmail]);

  useEffect(() => {
    const fetchDivisions = async () => {
      setLoadingDivisions(true);
      try {
        const result = await getAllDivisions();
        if (result.error) {
          setError(result.error);
        } else {
          setDivisions(result);
        }
      } catch (error) {
        setError("Error fetching divisions:", error);
      } finally {
        setLoadingDivisions(false);
      }
    };

    fetchDivisions();
  }, []);

  const handleDivisionChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedDivision(selectedValue);
    localStorage.setItem("selectedDivision", selectedValue);
    const selectedDivisionObj = divisions.find(
      (division) => division.shortName === selectedValue
    );
    setRequirementLabel(
      selectedDivisionObj
        ? selectedDivisionObj.fullName + " Requirement"
        : "Requirement"
    );
  };

  const containerClass = theme === "dark" ? "container-dark" : "";
  const formControlClass = theme === "dark" ? "form-control-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  return (
    <>
      {userEmail ? (
        <>
          <Navbar />
          <Container className={containerClass}>
            <Row className="justify-content-center">
              <Col md={6} className="text-center">
                <h2>{requirementLabel} Status</h2>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={6} className={`text-center`}>
                <Form.Group controlId="divisionSelect">
                  <Form.Label className={`w-100`}>
                    <b>Select Division</b>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedDivision}
                    onChange={handleDivisionChange}
                    className={`custom-width ${formControlClass}`}
                  >
                    {divisions.map((division) => (
                      <option key={division.id} value={division.shortName}>
                        {division.fullName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Container>
          {loadingStudent ? (
            <FadeIn>
              <div>
                <Container>
                  <Row className="d-flex justify-content-center">
                    <Lottie options={defaultOptions} height={140} width={140} />
                  </Row>
                </Container>
              </div>
            </FadeIn>
          ) : error ? (
            <div className="d-flex justify-content-center">
              <Alert variant="danger" className={alertClass}>{error}</Alert>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <StatusByDiv division={selectedDivision} key={selectedDivision} />
            </div>
          )}
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default ReqStatus;
