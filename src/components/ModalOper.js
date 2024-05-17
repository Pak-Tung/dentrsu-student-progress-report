import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import { updateOperReqById, getReqByDivision } from "../features/apiCalls";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getInstructorsByDivision } from "../features/apiTL";

function ModalOper({ show, handleClose, operReq }) {
  const division = { division: "oper" };
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [options, setOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getReqByDivision(division.division);
      const { error } = response;
      console.log("result", response);
      if (error) {
        console.log(error);
      } else {
        const df = {
          id: 0,
          division: "division",
          type: "Select Type of Work",
          req_RSU: 0,
          req_DC: 0,
          unit_RSU: "unit_RSU",
          unit_DC: "unit_DC",
        };
        response.unshift(df);
        setOptions(response);
      }
    };
    fetchData();
  }, []);

  const [selectedOption, setSelectedOption] = useState("");
  const [unitRSU, setUnitRSU] = useState("unit_RSU");
  const [unitDC, setUnitDC] = useState("unit_DC");
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    studentEmail: userEmail,
    type: "",
    area: "",
    req_RSU: 0,
    req_DC: 0,
    HN: "",
    patientName: "",
    isApproved: 0,
    instructorEmail: "",
    approvedDate: "",
    id: 0,
  });

  useEffect(() => {
    if (operReq) {
      setFormData({
        studentEmail: userEmail,
        type: operReq.type,
        area: operReq.area,
        req_RSU: operReq.req_RSU,
        req_DC: operReq.req_DC,
        HN: operReq.HN,
        patientName: operReq.patientName,
        isApproved: 0,
        instructorEmail: operReq.instructorEmail,
        approvedDate: operReq.approvedDate,
        id: operReq.id,
      });
      setSelectedOption(operReq.type);
      setSelectedInstructor(operReq.instructorEmail);
      setUnitRSU(operReq.req_RSU > 0 ? operReq.unit_RSU : "");
      setUnitDC(operReq.req_DC > 0 ? operReq.unit_DC : "");
    }
  }, [operReq, userEmail]);

  const handleChange = (event) => {
    const selected = event.target.value;
    setSelectedOption(event.target.value);
    console.log("options", options);

    const item = options.find((d) => d.type === selected);

    if (item && item.req_RSU > 0) {
      setUnitRSU(item.unit_RSU);
    } else {
      setUnitRSU("");
    }

    if (item && item.req_DC > 0) {
      setUnitDC(item.unit_DC);
    } else {
      setUnitDC("");
    }

    const { name, value } = event.target;
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
      const response = await getInstructorsByDivision(division.division);
      const { error } = response;
      console.log("result", response);
      if (error) {
        console.log(error);
      } else {
        const df = { id: 0, instructorName: "Select instructor for approval request" };
        response.unshift(df);
        setOptionsInstructor(response);
      }
    };
    fetchData();
  }, []);

  // State to hold the selected instructor
  const [selectedInstructor, setSelectedInstructor] = useState("");

  const handleChangeInstructor = (event) => {
    //const selected = event.target.value;
    setSelectedInstructor(event.target.value);

    // Update the form data
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
        console.log("form data", JSON.stringify(formData));
        const response = await updateOperReqById(operReq.id, formData);
        console.log("responseAPI", response);
        if (response.affectedRows === 1) {
          alert("Form submitted successfully!");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
    setValidated(true);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Operative Requirement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {operReq && (
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Container fluid>
              <Row className="justify-content-center">
                <Col>
                  <Form.Group controlId="Form.SelectCustom" className="mb-3">
                    <Form.Select name="type" value={selectedOption} onChange={handleChange}>
                      {options.map((option) => (
                        <option key={option.id} value={option.type}>
                          {option.type}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="area">Area/Teeth</InputGroup.Text>
                    <Form.Control
                      placeholder="Tooth/Sextant/Quadrant/Full Mouth/Case"
                      aria-label="area"
                      aria-describedby="area"
                      name="area"
                      value={formData.area}
                      required
                      onInput={handleInput}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="requirement-rsu">
                      Requirement (RSU)
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="0"
                      aria-label="requirement-rsu"
                      aria-describedby="requirement-rsu"
                      disabled={unitRSU === "" || unitRSU === "unit_RSU"}
                      name="req_RSU"
                      value={formData.req_RSU}
                      onInput={handleInput}
                      required
                    />
                    <InputGroup.Text id="unit-rsu">{unitRSU}</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="requirement-dc">
                      Requirement (DC)
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="0"
                      aria-label="requirement-dc"
                      aria-describedby="requirement-dc"
                      disabled={unitDC === "" || unitDC === "unit_DC"}
                      name="req_DC"
                      value={formData.req_DC}
                      onInput={handleInput}
                      required
                    />
                    <InputGroup.Text id="unit-rsu">{unitDC}</InputGroup.Text>
                  </InputGroup>
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
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalOper;