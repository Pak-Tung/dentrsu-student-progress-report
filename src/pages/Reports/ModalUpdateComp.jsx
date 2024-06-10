import React, { useEffect, useState } from "react";
import { Modal, Button, Form, InputGroup, Container, Row, Col } from "react-bootstrap";
import Cookies from "js-cookie";
import {
  updateCompReqById,
  getCompcasesDetails,
  getInstructorsByTeamleaderRole,
  deleteCompReqById,
} from "../../features/apiCalls";

function ModalUpdateComp({ show, handleClose, compReq }) {
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [options, setOptions] = useState([]);
  const [optionsInstructor, setOptionsInstructor] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    studentEmail: userEmail,
    caseNo: 0,
    complexity: "",
    HN: "",
    patientName: "",
    isApproved: 0,
    instructorEmail: "",
    approvedDate: "",
    note: "",
    note2: "",
    id: 0,
  });

  useEffect(() => {
    const fetchComplexityDetails = async () => {
      try {
        const response = await getCompcasesDetails();
        if (response.error) throw new Error(response.error);
        
        const defaultOption = {
          id: 0,
          complexity: "Select complexity",
          note: "Note",
        };
        setOptions([defaultOption, ...response]);
      } catch (error) {
        console.error("Error fetching complexity details:", error);
      }
    };

    fetchComplexityDetails();
  }, []);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await getInstructorsByTeamleaderRole(1);
        if (response.error) throw new Error(response.error);
        
        const defaultInstructor = {
          id: 0,
          instructorName: "Select instructor for approval request",
        };
        setOptionsInstructor([defaultInstructor, ...response]);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    if (compReq) {
      setFormData({
        studentEmail: userEmail,
        caseNo: compReq.caseNo || 0,
        complexity: compReq.complexity || "",
        HN: compReq.HN || "",
        patientName: compReq.patientName || "",
        isApproved: 0,
        instructorEmail: compReq.instructorEmail || "",
        approvedDate: compReq.approvedDate || "",
        id: compReq.id || 0,
        note: compReq.note || "",
        note2: compReq.note2 || "",
      });
      setSelectedOption(compReq.complexity || "");
      setSelectedInstructor(compReq.instructorEmail || "");
      setValidated(false);
    }
  }, [compReq, userEmail]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedOption(value);
    const selectedItem = options.find((d) => d.complexity === value);

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      caseNo: selectedItem ? selectedItem.id : prevState.caseNo,
    }));
  };

  const handleChangeInstructor = (event) => {
    const { name, value } = event.target;
    setSelectedInstructor(value);

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
    } else {
      try {
        const response = await updateCompReqById(compReq.id, formData);
        if (response.affectedRows === 1) {
          alert("Form submitted successfully!");
          //window.location.reload();
          handleClose();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
    setValidated(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this case from database? This action cannot be undone.")) {
      try {
        const result = await deleteCompReqById(id);
        if (result.error) throw new Error(result.error);
        
        alert("Case deleted successfully!");
        handleClose();
      } catch (error) {
        console.error("Error deleting case:", error);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Complete Case</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {compReq && (
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Container fluid>
              <Row className="justify-content-center">
                <Col>
                  <Form.Group controlId="Form.SelectCustom" className="mb-3">
                    <Form.Select
                      name="complexity"
                      value={selectedOption}
                      onChange={handleChange}
                    >
                      {options.map((option) => (
                        <option key={option.id} value={option.complexity}>
                          {option.complexity}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col md={4}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="HN">HN</InputGroup.Text>
                    <Form.Control
                      placeholder="0000000"
                      aria-label="HN"
                      aria-describedby="HN"
                      name="HN"
                      value={formData.HN}
                      onChange={handleInput}
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="patientName">Pt Name</InputGroup.Text>
                    <Form.Control
                      placeholder="Name of Patient"
                      aria-label="patientName"
                      aria-describedby="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInput}
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="Form.SelectInstructor" className="mb-3">
                    <Form.Select
                      name="instructorEmail"
                      value={selectedInstructor}
                      onChange={handleChangeInstructor}
                    >
                      {optionsInstructor.map((option) => (
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
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="note2">Case Note</InputGroup.Text>
                    <Form.Control
                      placeholder="Note"
                      aria-label="note2"
                      aria-describedby="note2"
                      name="note2"
                      value={formData.note2}
                      onChange={handleInput}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="note-label">Comment</InputGroup.Text>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Message from Instructor"
                      aria-label="note"
                      aria-describedby="note"
                      name="note"
                      value={formData.note}
                      onChange={handleInput}
                      disabled
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <div className="d-grid gap-2">
                  <Button variant="dark" size="lg" type="submit">
                    Save Changes
                  </Button>
                </div>
              </Row>
            </Container>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Container>
          <Row>
            <Col md={2}>
              <Button variant="outline-danger" onClick={() => handleDelete(formData.id)}>
                Delete
              </Button>
            </Col>
            <Col md={8}></Col>
            <Col md={2}>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalUpdateComp;

