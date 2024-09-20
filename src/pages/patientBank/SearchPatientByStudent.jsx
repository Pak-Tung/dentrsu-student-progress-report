import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Row, Col, Container, Alert } from "react-bootstrap";
import { ThemeContext } from "../../ThemeContext";
import NavBarPatientBank from "./NavbarPatientBank";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import PatientCard from "../../components/PatientCard";
import { getStudentById, getPatientsByStudentEmail } from "../../features/apiCalls";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function SearchPatientByStudent() {
  const { theme } = useContext(ThemeContext);
  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [student, setStudent] = useState({});
  const [studentId, setStudentId] = useState("");

  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false); // Start as false
  const [error, setError] = useState(null);

  // Handler for fetching student by studentId and patients by studentEmail
  const handleFetchPatientByStudentId = async () => {
    setLoadingPatients(true); // Show loading animation when the button is clicked
    try {
      const result = await getStudentById(studentId);
      if (result.error) {
        setStudent({});
        setError(result.error);
        setLoadingPatients(false); // Stop loading if there's an error
      } else {
        setStudent(result.data[0]);
        fetchPatients(result.data[0].studentEmail); // Fetch patients using the studentEmail
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Error fetching student data.");
      setLoadingPatients(false);
    }
  };

  // Function to fetch patients by studentEmail
  const fetchPatients = async (studentEmail) => {
    try {
      const result = await getPatientsByStudentEmail(studentEmail);
      if (result.error) {
        setError(result.error);
      } else if (result) {
        setPatients(result);
      } else {
        setError("ไม่มีข้อมูลผู้ป่วย");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย:", error);
    } finally {
      setLoadingPatients(false); // Stop loading after the patient data is fetched
    }
  };

  return (
    <>
      <NavBarPatientBank />
      <Container>
        <h4>ค้นหาผู้ป่วยของนักศึกษา</h4>
        <Form className={`mt-4 ${containerClass}`}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={2}>
              รหัสนักศึกษา
            </Form.Label>
            <Col md={8}>
              <Form.Control
                type="text"
                name="hn"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                placeholder="กรอก รหัสนักศึกษา เพื่อค้นหาผู้ป่วย"
              />
            </Col>
            <Col md={2}>
              <Button variant="dark" onClick={handleFetchPatientByStudentId}>
                ค้นหาผู้ป่วย
              </Button>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={2}>
              ชื่อ-สกุล นักศึกษา:
            </Form.Label>
            <Col md={9}>
              <Form.Control
                type="text"
                name="studentEmail"
                value={student.studentName || ""} // Fallback to empty string if undefined
                placeholder="นักศึกษาผู้รับเคส"
                readOnly
              />
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

export default SearchPatientByStudent;
