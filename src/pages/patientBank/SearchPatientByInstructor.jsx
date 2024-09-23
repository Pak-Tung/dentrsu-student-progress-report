import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Row, Col, Container, Alert } from "react-bootstrap";
import { ThemeContext } from "../../ThemeContext";
import NavBarPatientBank from "./NavbarPatientBank";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import PatientCard from "../../components/PatientCard";
import {
  getAllInstructors,
  getPatientsByTeamleaderEmail,
  getInstructorsByTeamleaderRole,
} from "../../features/apiCalls";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function SearchPatientByInstructor() {
  const { theme } = useContext(ThemeContext);
  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";
  const [error, setError] = useState(null);

  const [instructors, setInstructors] = useState([]);
  const [selectedTeamleader, setSelectedTeamleader] = useState("");

  const handleTeamleaderChange = (e) => {
    const selectedValue = e.target.value;
    //console.log(selectedValue);
    setSelectedTeamleader(selectedValue);
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const result = await getInstructorsByTeamleaderRole(1);
        if (result.error) {
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
        setLoadingPatients(true);
        try {
            const result = await getPatientsByTeamleaderEmail(selectedTeamleader);
            if (result) {
                setLoadingPatients(false);
                setPatients(result);
            } else {        
            setError(result.error);
            setLoadingPatients(false);
            }
        } catch (error) {
            console.error("Error fetching patients data:", error);
            setError("Error fetching patients data.");
            setLoadingPatients(false);
        }
        };

  return (
    <>
      <NavBarPatientBank />
      <Container>
        <h4>ค้นหาผู้ป่วยจากอาจารย์ที่ปรึกษา</h4>
        <Form className={`mt-4 ${containerClass}`}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={2}>
              อาจารย์ผู้รับมอบหมาย:
            </Form.Label>
            <Col md={6}>
              <Form.Control
                as="select"
                name="teamleaderEmail"
                value={selectedTeamleader}
                onChange={handleTeamleaderChange}
              >
                <option value="" disabled>
                  เลือกอาจารย์ทีมลีดเดอร์
                </option>
                {instructors.map((instructor) => (
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
              <Button variant="dark" onClick={handleFetchPatientByTeamleaderEmail}>
                ค้นหาผู้ป่วย
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
      ) : (
        <div className="d-flex justify-content-center">

          <PatientCard patients={patients} />
        </div>
      )}
    </>
  );
}

export default SearchPatientByInstructor;
