import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import NavbarAdmin from "./NavbarAdmin";
import { getAllStudents, getAllInstructors } from "../../features/apiCalls";
import ModalAssignAdvisor from "./ModalAssignAdvisor";

function DivisionAdvisee() {
  const [division, setDivision] = useState(() => {
    const savedDivision = localStorage.getItem("division");
    return savedDivision ? JSON.parse(savedDivision) : "";
  });

  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const result = await getAllStudents();
        setStudents(result.data.result);
      } catch (err) {
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsData();
  }, []);

  useEffect(() => {
    const fetchInstructorsData = async () => {
      try {
        const result = await getAllInstructors();
        console.log("result", result);
        setInstructors(result);
      } catch (err) {
        setError("Failed to fetch instructors");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorsData();
  }, []);

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

  const divInstructionEmail = useCallback((division, student) => {
    if (division === "oper") {
      return student.operInstructorEmail;
    } else if (division === "endo") {
      return student.endoInstructorEmail;
    } else if (division === "perio") {
      return student.perioInstructorEmail;
    } else if (division === "prosth") {
      return student.prosthInstructorEmail;
    } else if (division === "diag") {
      return student.diagInstructorEmail;
    } else if (division === "radio") {
      return student.radioInstructorEmail;
    } else if (division === "sur") {
      return student.surInstructorEmail;
    } else if (division === "ortho") {
      return student.orthoInstructorEmail;
    } else if (division === "pedo") {
      return student.pedoInstructorEmail;
    } else {
      return "";
    }
  }, []);

  const getInstructorName = (email) => {
    const instructor = instructors.find(
      (instructor) => instructor.instructorEmail === email
    );
    return instructor ? instructor.instructorName : "No Assigned Advisor";
  };

  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleAssignAdvisor = (student) => {
    setSelectedStudent(student);
    handleShow();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <NavbarAdmin />
      <Container fluid="md">
        <Row>
          <Col className="d-flex justify-content-center mb-4">
            <h4 className="mb-4">{fullNameDivision(division)} Advisee</h4>
          </Col>
        </Row>

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : (
          <ListGroup>
            {students.map((student) => (
              <ListGroup.Item key={student.studentId}>
                <Row>
                  <Col md={3}>
                    <h5>
                      {student.title}. {student.studentName}
                    </h5>
                  </Col>
                  <Col md={2}>
                    Year:{" "}
                    <strong>
                      {calculateStudentYear(student.startClinicYear)}th
                    </strong>
                  </Col>
                  <Col md={2}>
                    <p>
                      Bay:{" "}
                      <strong>
                        M{student.floor}
                        {student.bay}
                        {student.unitNumber}
                      </strong>
                    </p>
                  </Col>
                  <Col md={3}>
                    Advisor:{" "}
                    {getInstructorName(divInstructionEmail(division, student))}
                  </Col>
                  <Col md={2} className="d-flex justify-content-center mb-4">
                    <Button
                      variant="primary"
                      onClick={() => handleAssignAdvisor(student)}
                    >
                      Assign Advisor
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>
      {selectedStudent && (
        <ModalAssignAdvisor
          show={show}
          handleClose={handleClose}
          student={selectedStudent}
        />
      )}
    </>
  );
}

export default DivisionAdvisee;
