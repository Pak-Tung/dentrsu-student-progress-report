import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import {
  updateCompReqById,
  getCompcasesDetails,
  getInstructorsByTeamleaderRole,
} from "../../features/apiCalls";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function ModalCompReqApproval({ show, handleClose, compReq, studentName }) {
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [options, setOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getCompcasesDetails();
      const { error } = response;
      console.log("result", response);
      if (error) {
        console.log(error);
      } else {
        const df = {
          id: -1,
          complexity: "select complexity",
          note: "note",
        };
        response.unshift(df);
        setOptions(response);
      }
    };
    fetchData();
  }, []);

  const [selectedOption, setSelectedOption] = useState("");
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
    if (compReq) {
      setFormData({
        studentEmail: userEmail,
        caseNo: compReq.caseNo,
        complexity: compReq.complexity,
        HN: compReq.HN,
        patientName: compReq.patientName,
        isApproved: 0,
        instructorEmail: compReq.instructorEmail,
        approvedDate: addSevenHoursToISOString(new Date().toISOString()),
        id: compReq.id,
        note: compReq.note,
        note2: compReq.note2,
      });
      setSelectedOption(compReq.complexity);
      setSelectedInstructor(compReq.instructorEmail);
    }
  }, [compReq, userEmail]);

  const addSevenHoursToISOString = useCallback((dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date.toISOString().slice(0, 19).replace("T", " ");
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedOption(value);
    console.log("options", options);

    const item = options.find((d) => d.type === value);

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

  const [optionsInstructor, setOptionsInstructor] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getInstructorsByTeamleaderRole(1);
      const { error } = response;
      console.log("result", response);
      if (error) {
        console.log(error);
      } else {
        const df = {
          id: -1,
          instructorName: "Select instructor for approval request",
        };
        response.unshift(df);
        setOptionsInstructor(response);
      }
    };
    fetchData();
  }, []);

  // State to hold the selected instructor
  const [selectedInstructor, setSelectedInstructor] = useState("");

  const handleChangeInstructor = (event) => {
    const { name, value } = event.target;
    setSelectedInstructor(value);

    // Update the form data
    const selectedItem = options.find((d) => d.complexity === value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      caseNo: selectedItem ? selectedItem.id : prevState.id,
    }));
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.stopPropagation();
  //   } else {
  //     try {
  //       console.log("form data", JSON.stringify(formData));
  //       const response = await updateCompReqById(compReq.id, formData);
  //       console.log("responseAPI", response);
  //       if (response.affectedRows === 1) {
  //         alert("Form submitted successfully!");
  //         window.location.reload();
  //       }
  //     } catch (error) {
  //       console.error("Error submitting form:", error);
  //     }
  //   }
  //   setValidated(true);
  // };

  const handleApprove = async (event) => {
    event.preventDefault();
    try {
      const updatedFormData = { ...formData, isApproved: 1 };
      console.log("form data", JSON.stringify(updatedFormData));
      const response = await updateCompReqById(
        compReq.id,
        updatedFormData
      );
      console.log("responseAPI", response);
      if (response.affectedRows === 1) {
        alert("Form approved successfully!");
        //window.location.reload();
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleRevision = async (event) => {
    event.preventDefault();
    try {
      const updatedFormData = { ...formData, isApproved: -1 };
      console.log("form data", JSON.stringify(updatedFormData));
      const response = await updateCompReqById(
        compReq.id,
        updatedFormData
      );
      console.log("responseAPI", response);
      if (response.affectedRows === 1) {
        alert("Form sent back for revision!");
        //window.location.reload();
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Complete Case</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {compReq && (
          <Form noValidate validated={validated}>
            <Container fluid>
              <Row className="justify-content-center">
                <Col>
                  <div className="d-flex justify-content-center">
                  <h3>Student: {studentName} </h3>
                  </div>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col>
                  <Form.Group controlId="Form.SelectCustom" className="mb-3">
                    <Form.Select
                      name="complexity"
                      value={selectedOption}
                      disabled
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
                      disabled
                      onInput={handleInput}
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
                      onInput={handleInput}
                      disabled
                      required
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="area">Case Note</InputGroup.Text>
                    <Form.Control
                      placeholder="Note"
                      aria-label="area"
                      aria-describedby="area"
                      name="note2"
                      value={formData.note2}
                      onInput={handleInput}
                      disabled
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="d-grid gap-2">
                    <Button style={{ backgroundColor: '#339933', borderColor: '#339933' }} 
                    size="lg" onClick={handleApprove}>
                      Approve
                    </Button>
                  </div>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="note-label">
                      Revision required
                    </InputGroup.Text>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Message to Student"
                      aria-label="note"
                      aria-describedby="note"
                      name="note"
                      value={formData.note}
                      onInput={handleInput}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <div className="d-grid gap-2">
                  <Button 
                  style={{ backgroundColor: '#6600cc', borderColor: '#6600cc' }} 
                  size="lg" onClick={handleRevision}>
                    Sent Back for Revision
                  </Button>
                </div>
              </Row>
            </Container>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCompReqApproval;
