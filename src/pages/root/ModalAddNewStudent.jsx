import { React, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { insertStudent, getInstructorsByTeamleaderRole } from "../../features/apiCalls";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  Modal,
} from "react-bootstrap";

function ModalAddNewStudent({ show, handleClose }) {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
      studentId: 0,
      title: "",
      studentName: "",
      studentEmail: "",
      startClinicYear: "",
      floor: 0,
      bay: "",
      unitNumber: 0,
      status: "Incomplete",
      image: "",
      teamLeaderId: 0,
      permission: "student",
      teamleaderEmail: "",
      operInstructorEmail: "",
      endoInstructorEmail: "",
      perioInstructorEmail: "",
      prosthInstructorEmail: "",
      diagInstructorEmail: "",
      radioInstructorEmail: "",
      surInstructorEmail: "",
      orthoInstructorEmail: "",
      pedoInstructorEmail: "",
    });

    const [optionsInstructors, setOptionsInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState("");

    useEffect(() => {
      const fetchInstructors = async () => {
        try {
          const roleId = 1;
          const response = await getInstructorsByTeamleaderRole(roleId);
          setOptionsInstructors(response);
        } catch (err) {
          console.error("Failed to fetch instructors:", err);
        }
      };
      fetchInstructors();
    }, []);



  
    const handleInput = (event) => {
      const { name, value } = event.target;
      const updatedValue = name === "bay" ? value.toUpperCase() : value;
      setFormData((prevState) => ({
        ...prevState,
        [name]: updatedValue,
      }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      }
      setValidated(true);
      try {
        const response = await insertStudent(formData);
        console.log("responseAPI", response);
        if (response.data.affectedRows === 1) {
            alert("Add New Student successfully!");
            handleClose();
        }
      } catch (err) {
        console.log(err);
      }
    };

    // Handle instructor selection change
  const handleChangeInstructor = (event) => {
    const selectedEmail = event.target.value;
    setSelectedInstructor(selectedEmail);

    const instructor = optionsInstructors.find(
      (instructor) => instructor.instructorEmail === selectedEmail
    );

    if (instructor) {
      setFormData((prevState) => ({
        ...prevState,
        teamleaderEmail: instructor.instructorEmail,
        teamLeaderId: instructor.id,
      }));
    }
  };


  return (
     <>
     <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Container>
          <Row>
            <Col>
              <h5>Add New Student</h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="studentEmail">Email</InputGroup.Text>
                <Form.Control
                  type="email"
                  name="studentEmail"
                  placeholder="Enter email"
                  onInput={handleInput}
                  required
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="studentId">Student ID</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="studentId"
                  placeholder="Enter student ID"
                  onInput={handleInput}
                  required
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="title">Title</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  onInput={handleInput}
                  required
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="studentName">Student Name</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="studentName"
                  placeholder="Enter student name"
                  onInput={handleInput}
                  required
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="startClinicYear">
                  Start Clinic Year
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  name="startClinicYear"
                  placeholder="Enter start clinic year"
                  onInput={handleInput}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="floor">Floor</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="floor"
                  placeholder="Enter floor"
                  onInput={handleInput}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="bay">Bay</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="bay"
                  placeholder="Enter bay"
                  onInput={handleInput}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <InputGroup className="mb-3">
                <InputGroup.Text id="unitNumber">Unit Number</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="unitNumber"
                  placeholder="Enter unit number"
                  onInput={handleInput}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="teamleader">Team Leader</InputGroup.Text>
                  <Form.Select
                    name="instructorEmail"
                    value={selectedInstructor}
                    onChange={handleChangeInstructor}
                    required
                  >
                    <option value="" disabled>
                      Select Team Leader
                    </option>
                    {optionsInstructors.map((option) => (
                      <option key={option.id} value={option.instructorEmail}>
                        {option.instructorName}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
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

export default ModalAddNewStudent;