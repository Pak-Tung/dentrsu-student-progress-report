import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Spinner,
  Alert,
  Button,
  Form,
} from "react-bootstrap";
import NavbarAdmin from "./NavbarAdmin";
import { getAllStudents, getAllInstructors } from "../../features/apiCalls";
import ModalAssignAdvisor from "./ModalAssignAdvisor";
import * as loadingData from "../../components/loading.json";
import * as successData from "../../components/success.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import Cookies from "js-cookie";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function DivisionAdvisee() {
  const [division, setDivision] = useState(() => {
    const savedDivision = Cookies.get("division");
    return savedDivision ? savedDivision : "";
  });

  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentYearFilter, setStudentYearFilter] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const [bayFilter, setBayFilter] = useState("");

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

  const filteredStudents = students.filter((student) => {
    const studentYear = calculateStudentYear(student.startClinicYear);
    return (
      (studentYearFilter === "" || studentYear === parseInt(studentYearFilter)) &&
      (floorFilter === "" || student.floor === parseInt(floorFilter)) &&
      (bayFilter === "" || student.bay === bayFilter)
    );
  });

  return (
    <>
      <NavbarAdmin />
      <Container fluid>
        <Row>
          <Col className="d-flex justify-content-center mb-4">
            <h4 className="mb-4">{fullNameDivision(division)} Advisee</h4>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="studentYearFilter">
              <Form.Label>Filter by Student Year</Form.Label>
              <Form.Control
                as="select"
                value={studentYearFilter}
                onChange={(e) => setStudentYearFilter(e.target.value)}
              >
                <option value="">All</option>
                {[...new Set(students.map((student) => calculateStudentYear(student.startClinicYear)))]
                  .sort((a, b) => a - b)
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}th Year
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="floorFilter">
              <Form.Label>Filter by Floor</Form.Label>
              <Form.Control
                as="select"
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
              >
                <option value="">All</option>
                {[...new Set(students.map((student) => student.floor))]
                  .sort((a, b) => a - b)
                  .map((floor) => (
                    <option key={floor} value={floor}>
                      Floor {floor}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="bayFilter">
              <Form.Label>Filter by Bay</Form.Label>
              <Form.Control
                as="select"
                value={bayFilter}
                onChange={(e) => setBayFilter(e.target.value)}
              >
                <option value="">All</option>
                {[...new Set(students.map((student) => student.bay))]
                  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
                  .map((bay) => (
                    <option key={bay} value={bay}>
                      Bay {bay}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <ListGroup>
          <ListGroup.Item>
            <Row>
              <Col md={4}>
                <strong>Student Name</strong>
              </Col>
              <Col md={1}>
                <strong>Year</strong>
              </Col>
              <Col md={1}>
                <strong>Bay</strong>
              </Col>
              <Col md={3}>
                <strong>Advisor</strong>
              </Col>
              <Col></Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>

        {loading ? (
          <div className="d-flex justify-content-center">
            <FadeIn>
              <div>
                <Container>
                  <Row className="d-flex justify-content-center">
                    <Lottie options={defaultOptions} height={140} width={140} />
                  </Row>
                </Container>
              </div>
            </FadeIn>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : (
          <ListGroup>
            {filteredStudents.map((student) => (
              <ListGroup.Item key={student.studentId}>
                <Row>
                  <Col md={4}>
                    <h5>
                      {student.title}. {student.studentName}
                    </h5>
                  </Col>
                  <Col md={1}>
                    <strong>
                      {calculateStudentYear(student.startClinicYear)}th
                    </strong>
                  </Col>
                  <Col md={1}>
                    <p>
                      <strong>
                        M{student.floor}
                        {student.bay}
                        {student.unitNumber}
                      </strong>
                    </p>
                  </Col>
                  <Col md={3}>
                    {getInstructorName(divInstructionEmail(division, student))}
                  </Col>
                  <Col>
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
