import React, { useState, useCallback } from "react";
import NavbarAdmin from "./NavbarAdmin";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import Cookies from "js-cookie";
import { getStudentById } from "../../features/apiCalls";
import SumByDivAndStudentEmail from "../Reports/SumByDivAndStudentEmail";
import LoadingComponent from "../../components/LoadingComponent";
import LoginByEmail from "../../components/LoginByEmail";


function DivisionReqOfStudent() {
  const [division, setDivision] = useState(() => {
    const savedDivision = Cookies.get("division");
    return savedDivision ? savedDivision : "";
  });
  const email = Cookies.get("email");
  const [studentData, setStudentData] = useState(null);
  const [idInput, setIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInput = (event) => {
    setIdInput(event.target.value);
  };

  const retrieveStudentById = (event) => {
    event.preventDefault();
    fetchData();
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getStudentById(idInput);
      //console.log("result", result.data[0]);
      setStudentData(result.data[0]);
    } catch (err) {
      setError("Failed to fetch student data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [idInput]);

  const fullNameDivision = useCallback((division) => {
    const divisionMap = {
      oper: "Operative",
      endo: "Endodontic",
      perio: "Periodontic",
      prosth: "Prosthodontic",
      diag: "Diagnostic",
      radio: "Radiology",
      sur: "Oral Surgery",
      pedo: "Pediatric Dentistry",
      ortho: "Orthodontic",
    };
    return divisionMap[division] || "";
  }, []);

  const calculateStudentYear = (startClinicYear) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
    return currentYear - startClinicYear + (currentMonth > 4 ? 5 : 4);
  };

  return (
    <>
      {email ? (
        <>
          <NavbarAdmin />
          <Container className="mt-4">
            <div className="d-flex justify-content-center mb-4">
              <h2>Student {fullNameDivision(division)} Requirement</h2>
            </div>
            <Form onSubmit={retrieveStudentById}>
              <Row className="d-flex justify-content-center mb-4">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text id="div-id">Student Id</InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="Student Id"
                      aria-label="id"
                      aria-describedby="id"
                      value={idInput}
                      onChange={handleInput}
                      required
                    />
                    <Button type="submit">Fetch</Button>
                  </InputGroup>
                </Col>
              </Row>
            </Form>

            {loading ? (
              <LoadingComponent />
            ) : error ? (
              <div className="d-flex justify-content-center">
                <Alert variant="danger">{error}</Alert>
              </div>
            ) : studentData ? (
              <>
                <Row className="d-flex justify-content-center mb-4">
                  <Col className="d-flex justify-content-center mb-4">
                    <strong>Student ID: </strong> {studentData.studentId}
                  </Col>
                  <Col className="d-flex justify-content-center mb-4">
                    <strong>Student Name: </strong> {studentData.title}{" "}
                    {studentData.studentName}
                  </Col>
                  <Col className="d-flex justify-content-center mb-4">
                    <strong>Year: </strong>
                    {calculateStudentYear(studentData.startClinicYear)}th
                  </Col>
                  <Col className="d-flex justify-content-center mb-4">
                    <strong>Bay: </strong> M{studentData.floor}
                    {studentData.bay}
                    {studentData.unitNumber}
                  </Col>
                </Row>
                <Row>
                  <SumByDivAndStudentEmail
                    division={division}
                    studentEmail={studentData.studentEmail}
                  />
                </Row>
              </>
            ) : (
              <div className="text-center">
                No data available for the given ID.
              </div>
            )}
          </Container>
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default DivisionReqOfStudent;
