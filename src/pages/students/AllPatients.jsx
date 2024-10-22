import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import Navbar from "../../components/Navbar";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import LoginByEmail from "../../components/LoginByEmail";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { getPatientsByStudentEmail } from "../../features/apiCalls";
import PatientCard from "../../components/PatientCard";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function AllPatients() {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => {
    const cookieUser = Cookies.get("user");
    return cookieUser ? JSON.parse(cookieUser) : {};
  });

  const userEmail = user.email;
  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (userEmail) {
        try {
          setLoadingPatients(true);
          const result = await getPatientsByStudentEmail(userEmail);

          if (result.error) {
            setError(result.error);
          } else if (result.length > 0) {
            setPatients(result);
          } else {
            setError("No patient data found");
          }
        } catch (error) {
          setError("Error fetching patient data: " + error.message);
        } finally {
          setLoadingPatients(false);
        }
      }
    };

    fetchStudentData();
  }, [userEmail]);

  const updatePatients = (updateFn) => {
    // Update the patients state
    setPatients(updateFn);
  };

  return (
    <>
      {userEmail ? (
        <>
          <Navbar />
          <Container className={containerClass}>
            <Row className="justify-content-center">
              <Col md={6} className="text-center">
                <h2>All Patients</h2>
              </Col>
            </Row>
          </Container>
          {loadingPatients ? (
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
          ) : patients && patients.length > 0 ? (
            <div className="d-flex justify-content-center">
              <PatientCard
                patients={patients}
                updatePatients={updatePatients}
              />
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <Alert variant="info" className={alertClass}>No patients found.</Alert>
            </div>
          )}
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default AllPatients;
