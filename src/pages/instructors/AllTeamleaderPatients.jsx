import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import NavbarInstructor from "../../components/NavbarInstructor";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import LoginByEmail from "../../components/LoginByEmail";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { getPatientsByTeamleaderEmail } from "../../features/apiCalls";
import PatientCard from "../../components/PatientCard";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function AllTeamleaderPatients() {
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
    const fetchData = async () => {
      if (userEmail) {
        try {
          const result = await getPatientsByTeamleaderEmail(userEmail);
          //console.log(result);
          setLoadingPatients(true);
          if (result.error) {
            setError(result.error);
          } else if (result) {
            setPatients(result);
          } else {
            setError("No patient data found");
          }
        } catch (error) {
          setError("Error fetching patient data:", error);
        } finally {
          setLoadingPatients(false);
        }
      }
    };

    fetchData();
  }, [userEmail]);

  const updatePatients = (updateFn) => {
    setPatients((prevPatients) => updateFn(prevPatients));
  };

  return (
    <>
      {userEmail ? (
        <>
          <NavbarInstructor />
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
              <Alert variant="danger" className={alertClass}>
                {error}
              </Alert>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <PatientCard
                patients={patients}
                updatePatients={updatePatients} // Pass the update function
              />
            </div>
          )}
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default AllTeamleaderPatients;
