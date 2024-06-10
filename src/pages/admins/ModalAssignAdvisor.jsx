import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getInstructorsByDivision, updateStudentDivInstructorByDivInstructorEmail } from "../../features/apiCalls";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  Modal,
} from "react-bootstrap";

function ModalAssignAdvisor({ show, handleClose, student }) {
  const [division, setDivision] = useState(() => {
    const savedDivision = localStorage.getItem("division");
    return savedDivision ? JSON.parse(savedDivision) : "";
  });

  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    studentId: student.studentId,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getInstructorsByDivision(division);
        setInstructors(result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [division]);

  useEffect(() => {
    setFormData({
      studentId: student.studentId,
    });
  }, [student]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);
    try {
      const response = await updateStudentDivInstructorByDivInstructorEmail(
        formData.studentId,
        {
          studentId: formData.studentId,
          division: division,
          instructorEmail: selectedInstructor,
        }
      );
      if (response.data.affectedRows === 1) {
        alert("Advisor assigned successfully!");
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

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

  const handleChangeInstructor = (event) => {
    setSelectedInstructor(event.target.value);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Assign {fullNameDivision(division)} Advisor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Container>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="studentId">Student ID</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="studentId"
                      value={student.studentId}
                      readOnly
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="studentName">
                      Student Name
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="studentName"
                      value={student.studentName}
                      readOnly
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="bay">Bay</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="bay"
                      value={"M"+student.floor+student.bay+student.unitNumber}
                      readOnly
                    />
                  </InputGroup>
                </Col>
              </Row>
  
              <Row>
                <Col>
                  <Form.Group controlId="Form.SelectInstructor" className="mb-3">
                    <Form.Label>Choose advisor to assign</Form.Label>
                    <Form.Select
                      name="instructorEmail"
                      value={selectedInstructor}
                      onChange={handleChangeInstructor}
                      required
                    >
                      <option value="">Select {fullNameDivision(division)} Advisor</option>
                      {instructors.map((option) => (
                        <option key={option.id} value={option.instructorEmail}>
                          {option.instructorName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="outline-dark" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Container>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalAssignAdvisor;
