import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Row, Col, Container, Alert } from "react-bootstrap";
import { ThemeContext } from "../../ThemeContext";
import NavbarPatientBank from "./NavbarPatientBank";
import NavbarSupervisor from "../supervisor/NavbarSupervisor";
import LoadingComponent from "../../components/LoadingComponent";
import PatientCard from "../../components/PatientCard";
import {
  getPatientsByTeamleaderEmail,
  getInstructorsByTeamleaderRole,
} from "../../features/apiCalls";
import Cookies from "js-cookie";
import LoginByEmail from "../../components/LoginByEmail";

function SearchPatientByInstructor() {
  const { theme } = useContext(ThemeContext);
  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";
  const [error, setError] = useState(null);
  const email = Cookies.get("email");
  const [role, setRole] = useState("");
  useEffect(() => {
    const savedRole = Cookies.get("role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

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
      {email ? (
        <>
          {role === "ptBank" ? <NavbarPatientBank /> : <NavbarSupervisor />}
          <Container className={`${containerClass}`}>
            <h4>ค้นหาผู้ป่วยจากอาจารย์ที่ปรึกษา</h4>
            <Form className="mt-4">
              <Form.Group as={Row} className="mb-3">
                <Col md={8}>
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
                <Col>
                  <Button
                    variant="dark"
                    onClick={handleFetchPatientByTeamleaderEmail}
                  >
                    ค้นหาผู้ป่วย
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </Container>

          {loadingPatients ? (
            <LoadingComponent />
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
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default SearchPatientByInstructor;
