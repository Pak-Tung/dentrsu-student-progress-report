import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Modal,
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Alert,
  Button,
  InputGroup,
  Form,
} from "react-bootstrap";
import {
  getStudentByDivInstructorEmail,
  updateStudentDivInstructorByDivInstructorEmail,
} from "../../features/apiCalls";
import LoadingComponent from "../../components/LoadingComponent";
import Cookies from "js-cookie";


function ModalManageAdvisor({ show, handleClose, instructor }) {
  const [division, setDivision] = useState(() => {
    const savedDivision = Cookies.get("division");
    return savedDivision ? savedDivision : "";
  });


  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    division: division,
    instructorEmail: instructor.instructorEmail,
  });

  const divisionMap = useMemo(() => ({
    oper: "Operative",
    endo: "Endodontic",
    perio: "Periodontic",
    prosth: "Prosthodontic",
    diag: "Diagnostic",
    radio: "Radiology",
    sur: "Oral Surgery",
    pedo: "Pediatric Dentistry",
    ortho: "Orthodontic",
  }), []);

  const fullNameDivision = useCallback((division) => {
    return divisionMap[division] || "";
  }, [divisionMap]);

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const result = await getStudentByDivInstructorEmail(
          instructor.instructorEmail,
          instructor.division
        );
        setStudents(result);
      } catch (err) {
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    if (instructor) {
      fetchStudentsData();
    }
  }, [instructor, refresh]);

  const calculateStudentYear = (startClinicYear) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
    return currentYear - startClinicYear + (currentMonth > 4 ? 1 : 0);
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      instructorEmail: instructor.instructorEmail,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log("formData update", formData);
    try {
      const result = await updateStudentDivInstructorByDivInstructorEmail(
        formData.studentId,
        formData
      );
      if (result.data.affectedRows === 1) {
        alert("Successfully added advisee");
        setRefresh((prev) => !prev); // Toggle refresh state to re-fetch students
      } else {
        throw new Error("Failed to update student data");
      }
    } catch (err) {
      alert("Failed to add advisee. Please recheck student ID.");
    }
  };

  const handleRemove = async (student) => {
    try {
      const result = await updateStudentDivInstructorByDivInstructorEmail(
        student.studentId,
        {
          studentId: student.studentId,
          division: division,
          instructorEmail: "",
        }
      );
      if (result.data.affectedRows === 1) {
        alert("Successfully removed advisee");
        setRefresh((prev) => !prev); // Toggle refresh state to re-fetch students
      } else {
        throw new Error("Failed to update student data");
      }
    } catch (err) {
      alert("Failed to remove advisee. Please try again later.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Manage {fullNameDivision(division)} Advisor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <LoadingComponent />
        ) : error ? (
          <Container>
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          </Container>
        ) : (
          <Container fluid>
            <Row>
              <Col className="d-flex justify-content-center">
                <h4>Current Advisees of {instructor.instructorName}</h4>
              </Col>
            </Row>
            <br />
            <ListGroup>
              {students.length === 0 ? (
                <ListGroup.Item className="text-center">
                  No Assigned Student
                </ListGroup.Item>
              ) : (
                students.map((student) => (
                  <div key={student.studentId}>
                    <ListGroup.Item>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={student.image}
                            roundedCircle
                            fluid
                            width="75"
                            height="75"
                            alt={`${student.studentName}'s profile`}
                          />
                        </Col>
                        <Col>
                          <strong>Student ID:</strong> {student.studentId} <br />
                          <strong>Name:</strong> {student.studentName}
                        </Col>
                        <Col>
                          <strong>Year:</strong>{" "}
                          {calculateStudentYear(student.startClinicYear)} <br />
                          <strong>Bay:</strong> M{student.floor}
                          {student.bay}
                          {student.unitNumber} <br />
                        </Col>
                        <Col className="d-flex justify-content-end">
                          <Button variant="danger" onClick={() => handleRemove(student)}>Remove</Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <br />
                  </div>
                ))
              )}
            </ListGroup>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={8}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="studentId">Student ID</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="studentId"
                      placeholder="Enter student ID"
                      onInput={handleInput}
                      required
                      aria-describedby="studentId"
                    />
                  </InputGroup>
                </Col>
                <Col className="d-flex justify-content-center">
                  <Button type="submit">Add Advisee</Button>
                </Col>
              </Row>
            </Form>
          </Container>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ModalManageAdvisor;

