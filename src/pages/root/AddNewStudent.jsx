import { React, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { insertStudent } from "../../features/apiCalls";
import NavbarRoot from "./NavbarRoot";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  InputGroup,
  Form,
} from "react-bootstrap";

function AddNewStudent() {

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    studentEmail: "",
    studentId: "",
    title: "",
    studentName: "",
    startClinicYear: "",
    floor: "",
    bay: "",
    unitNumber: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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
      await insertStudent(formData);
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <>
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
              <Button variant="outline-dark" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
    </>
  );
}

export default AddNewStudent;
