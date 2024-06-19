import { React, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { insertInstructor, getAllDivisions, insertUser } from "../../features/apiCalls";
import { Container, Row, Col, Button, InputGroup, Form, Modal, } from "react-bootstrap";

function ModalAddNewInstructor({ show, handleClose, email, role }) {
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

  const [userFormDate, setUserFormData] = useState({
    email: "",
    role: "",
  });

  useEffect(() => {
    if (email && role) {
      setUserFormData({
        email: email,
        role: role,
      });
      setFormData((prevState) => ({
        ...prevState,
        instructorEmail: email,
      }));
    }
  }, [email, role]);

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
      const response = await insertInstructor(formData);
      //console.log("responseAPI", response);
      if (response.name === "AxiosError") {  
        alert(response.request.responseText);
        //window.location.reload(); 
      } else if (response.data.affectedRows === 1) {
        const responseUser = await insertUser(userFormDate);
        //console.log("responseUser", responseUser);
        alert("Add New Instructor successfully!");
        handleClose();
      }else {
        alert(response.request.responseText);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Instructor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Container>
              <Row>
                <Col>
                  <h5>Add New Instructor</h5>
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
                      value={email}
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
                    <InputGroup.Text id="instructorName">
                      Instructor Name
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="instructorName"
                      placeholder="Enter instructor name"
                      onInput={handleInput}
                      required
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
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="permission">
                      Permission
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="permission"
                      placeholder="Enter permission (admin or instructor)"
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

export default ModalAddNewInstructor;
