import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAllDivisions,
  updateInstructorByInstructorId,
} from "../../features/apiCalls";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  Modal,
} from "react-bootstrap";

function ModalEditInstructor({ show, handleClose, instructor }) {
  const [validated, setValidated] = useState(false);

  const [divisionOptions, setDivisionOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllDivisions();
      const { error } = response;
      if (error) {
        console.log(error);
      } else {
        setDivisionOptions(response);
      }
    };
    fetchData();
  }, []);

  const [selectedDivision, setSelectedDivision] = useState("");

  const handleChangeDivision = (event) => {
    setSelectedDivision(event.target.value);
    setFormData((prevState) => ({
      ...prevState,
      division: event.target.value,
    }));  
  };

  const [formData, setFormData] = useState({
    id: 0,
    instructorEmail: "",
    title: "",
    instructorName: "",
    division: "",
    teamleader: 0,
    permission: "",
    floor: 0,
    bay: "",
  });

  useEffect(() => {
    if (instructor) {
      setFormData({
        id: instructor.id || "",
        instructorEmail: instructor.instructorEmail || "",
        title: instructor.title || "",
        instructorName: instructor.instructorName || "",
        division: instructor.division || "",
        teamleader: instructor.teamleader || "",
        permission: instructor.permission || "",
        floor: instructor.floor || "",
        bay: instructor.bay || "",
      });
    }
  }, [instructor]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    let updatedValue = value;
    updatedValue = name === "bay" ? value.toUpperCase() : value;

    if (name === "teamleader" && value === "0") {
      setFormData((prevState) => ({
        ...prevState,
        floor: 0,
        bay: "",
      }));
    }

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
      const response = await updateInstructorByInstructorId(
        formData.id,
        formData
      );
      console.log("formData.id", formData.id);
      console.log("responseAPI", response);
      if (response.data.affectedRows === 0) {
        alert("Edit Instructor failed!");
        window.location.reload();
      } else if (response.data.affectedRows === 1) {
        alert("Edit Instructor successfully!");
        handleClose(formData.id);
      } else {
        alert("Edit Instructor failed!");
      }
    } catch (error) {
      console.error("Edit Instructor failed!", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Instructor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Container>
              <Row>
                <Col>
                  <h5>Edit Instructor</h5>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="instructorEmail">
                      Email
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="instructorEmail"
                      placeholder="Enter email"
                      onInput={handleInput}
                      required
                      value={formData.instructorEmail}
                      readOnly
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="id">Instructor ID</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="id"
                      placeholder="Enter instructor ID"
                      onInput={handleInput}
                      required
                      value={formData.id}
                      readOnly
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
                      value={formData.title}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="instructorName">
                      Instructor Name
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="instructorName"
                      placeholder="Enter instructor name"
                      onInput={handleInput}
                      required
                      value={formData.instructorName}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group
                    controlId="Form.SelectInstructor"
                    className="mb-3"
                  >
                    <Form.Label>Choose advisor to assign</Form.Label>
                    <Form.Select
                      name="instructorEmail"
                      value={selectedDivision}
                      onChange={handleChangeDivision}
                      required
                    >
                      <option value="">Select division</option>
                      {divisionOptions.map((option) => (
                        <option key={option.id} value={option.shortName}>
                          {option.fullName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="teamleader">
                      Teamleader Role
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="teamleader"
                      placeholder="Enter role (1 for yes, 0 for no)"
                      onInput={handleInput}
                      value={formData.teamleader}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="floor">Floor</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="floor"
                      placeholder="Enter floor"
                      onInput={handleInput}
                      value={formData.floor}
                      readOnly={formData.teamleader === 0}
                    />
                  </InputGroup>
                </Col>
                <Col md={12}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="bay">Bay</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="bay"
                      placeholder="Enter bay"
                      onInput={handleInput}
                      value={formData.bay}
                      readOnly={formData.teamleader === 0}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="permission">
                      Permission (Enter: admin or instructor)
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="permission"
                      placeholder="Enter permission (admin or instructor)"
                      onInput={handleInput}
                      required
                      value={formData.permission}
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

export default ModalEditInstructor;
