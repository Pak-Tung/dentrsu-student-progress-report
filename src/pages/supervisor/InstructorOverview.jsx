import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Row, Col, Container, Alert } from "react-bootstrap";
import { ThemeContext } from "../../ThemeContext";
import NavbarSupervisor from "./NavbarSupervisor";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import { getPatientsByTeamleaderEmail } from "../../features/apiCalls";
import { getInstructorsByTeamleaderRole } from "../../features/apiCalls";
import MemberInTeam from "../instructors/MemberInTeam";
import Cookies from "js-cookie";
import LoginByEmail from "../../components/LoginByEmail";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function InstructorOverview() {
  const { theme } = useContext(ThemeContext);
  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";
  const [error, setError] = useState(null);

  const [role, setRole] = useState("");
  const email = Cookies.get("email");
  useEffect(() => {
    const savedRole = Cookies.get("role");
    if (savedRole) {
      try {
        setRole(savedRole);
      } catch (e) {
        console.error("Error parsing role from Cookies:", e);
      }
    }
  }, []);

  const [instructors, setInstructors] = useState([]);
  const [selectedTeamleader, setSelectedTeamleader] = useState("");

  const handleTeamleaderChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedTeamleader(selectedValue);
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const result = await getInstructorsByTeamleaderRole(1);
        if (result.error) {
          console.error("Error fetching instructors:", result.error);
          setError(result.error);
        } else {
          setInstructors(result);
        }
      } catch (error) {
        setError("Error fetching instructors: " + error.message);
      }
    };
    fetchInstructors();
  }, []);

  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const handleFetchPatientByTeamleaderEmail = async () => {
    if (!selectedTeamleader) {
      setError("Please select a team leader.");
      return;
    }

    setLoadingPatients(true);
    setError(null);

    try {
      const result = await getPatientsByTeamleaderEmail(selectedTeamleader);
      if (result && !result.error) {
        setPatients(result);
      } else {
        setError(result.error || "Unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error fetching patients data:", error);
      setError("Error fetching patients data.");
    } finally {
      setLoadingPatients(false);
    }
  };

  return (
    <>
      {email ? (
        <>
          <NavbarSupervisor />
          <Container>
            <h4>Search by Team Leader</h4>
            <Form className={`mt-4 ${containerClass}`}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column md={2}>
                  Team Leader:
                </Form.Label>
                <Col md={6}>
                  <Form.Control
                    as="select"
                    name="teamleaderEmail"
                    value={selectedTeamleader}
                    onChange={handleTeamleaderChange}
                  >
                    <option value="" disabled>
                      Select Team Leader
                    </option>
                    {Array.isArray(instructors) &&
                      instructors.map((instructor) => (
                        <option
                          key={instructor.id}
                          value={instructor.instructorEmail}
                        >
                          {instructor.instructorName}
                        </option>
                      ))}
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <Button
                    variant="dark"
                    onClick={handleFetchPatientByTeamleaderEmail}
                  >
                    Search
                  </Button>
                </Col>
              </Form.Group>
            </Form>
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
          ) : selectedTeamleader ? (
            <>
              <div className="d-flex justify-content-center">
                <MemberInTeam instructorEmail={selectedTeamleader} />
              </div>
              {/* <div className="d-flex justify-content-center">
            <PatientCard patients={patients} />
          </div> */}
            </>
          ) : null}
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default InstructorOverview;
