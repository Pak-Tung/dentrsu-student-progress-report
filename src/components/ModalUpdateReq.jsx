import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, Form, InputGroup, Container, Row, Col } from "react-bootstrap";
import Cookies from "js-cookie";
import { updateDivReqById, getReqByDivision } from "../features/apiCalls";
import { getInstructorsByDivision } from "../features/apiTL";
import { ThemeContext } from "../ThemeContext";

function ModalUpdateReq({ show, handleClose, divisionReq, division }) {
  const { theme } = useContext(ThemeContext);
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [options, setOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getReqByDivision(division);
      const { error } = response;
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
  }, [division]);

  const [selectedOption, setSelectedOption] = useState("");
  const [unitRSU, setUnitRSU] = useState("unit_RSU");
  const [unitDC, setUnitDC] = useState("unit_DC");
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    studentEmail: userEmail,
    bookNo: 0,
    pageNo: 0,
    type: "",
    area: "",
    req_RSU: 0,
    unit_RSU: "unit_RSU",
    req_DC: 0,
    unit_DC: "unit_DC",
    HN: "",
    patientName: "",
    isApproved: 0,
    instructorEmail: "",
    approvedDate: "",
    note: "",
    id: 0,
  });

  useEffect(() => {
    if (divisionReq) {
      setFormData({
        studentEmail: userEmail,
        bookNo: divisionReq.bookNo,
        pageNo: divisionReq.pageNo,
        type: divisionReq.type,
        area: divisionReq.area,
        req_RSU: divisionReq.req_RSU,
        unit_RSU: divisionReq.unit_RSU,
        req_DC: divisionReq.req_DC,
        unit_DC: divisionReq.unit_DC,
        HN: divisionReq.HN,
        patientName: divisionReq.patientName,
        isApproved: 0,
        instructorEmail: divisionReq.instructorEmail,
        approvedDate: divisionReq.approvedDate,
        id: divisionReq.id,
        note: divisionReq.note,
      });
      setSelectedOption(divisionReq.type);
      setSelectedInstructor(divisionReq.instructorEmail);
      setUnitRSU(divisionReq.req_RSU > 0 ? divisionReq.unit_RSU : "");
      setUnitDC(divisionReq.req_DC > 0 ? divisionReq.unit_DC : "");
      setValidated(false);
    }
  }, [divisionReq, userEmail]);

  const handleChange = (event) => {
    const selected = event.target.value;
    setSelectedOption(selected);

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
      const response = await getInstructorsByDivision(division);
      const { error } = response;
      if (error) {
        console.log(error);
      } else {
        const df = {
          id: 0,
          instructorName: "Select instructor for approval request",
        };
        response.unshift(df);
        setOptionsInstructor(response);
      }
    };
    fetchData();
  }, [division]);

  const [selectedInstructor, setSelectedInstructor] = useState("");

  const handleChangeInstructor = (event) => {
    setSelectedInstructor(event.target.value);

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
        const updatedFormData = {
          ...formData,
          unit_RSU: unitRSU,
          unit_DC: unitDC,
        };
        const response = await updateDivReqById(divisionReq.id, updatedFormData, division);
        if (response.affectedRows === 1) {
          alert("Form submitted successfully!");
          localStorage.setItem("selectedDivision", division);
          handleClose();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
    setValidated(true);
  };

  return (
    <Modal show={show} onHide={handleClose} className={theme}>
      <Modal.Header closeButton className={theme}>
        <Modal.Title>Edit Requirement</Modal.Title>
      </Modal.Header>
      <Modal.Body className={theme}>
        {divisionReq && (
          <Form noValidate validated={validated} onSubmit={handleSubmit} className={theme}>
            <Container fluid>
              <Row className="justify-content-center">
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="bookNo" className={theme === "dark" ? "bg-dark text-white" : ""}>Book No:</InputGroup.Text>
                    <Form.Control
                      placeholder="Requirement Book No."
                      aria-label="bookNo"
                      aria-describedby="bookNo"
                      name="bookNo"
                      value={formData.bookNo}
                      onInput={handleInput}
                      className={theme === "dark" ? "bg-dark text-white" : ""}
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="pageNo" className={theme === "dark" ? "bg-dark text-white" : ""}>Page No:</InputGroup.Text>
                    <Form.Control
                      placeholder="Requirement Page No."
                      aria-label="pageNo"
                      aria-describedby="pageNo"
                      name="pageNo"
                      value={formData.pageNo}
                      onInput={handleInput}
                      className={theme === "dark" ? "bg-dark text-white" : ""}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col>
                  <Form.Group controlId="Form.SelectCustom" className="mb-3">
                    <Form.Select
                      name="type"
                      value={selectedOption}
                      onChange={handleChange}
                      className={theme === "dark" ? "bg-dark text-white" : ""}
                    >
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
                    <InputGroup.Text id="area" className={theme === "dark" ? "bg-dark text-white" : ""}>Area/Teeth</InputGroup.Text>
                    <Form.Control
                      placeholder="Tooth/Sextant/Quadrant/Full Mouth/Case"
                      aria-label="area"
                      aria-describedby="area"
                      name="area"
                      value={formData.area}
                      required
                      onInput={handleInput}
                      className={theme === "dark" ? "bg-dark text-white" : ""}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="requirement-rsu" className={theme === "dark" ? "bg-dark text-white" : ""}>
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
                      className={theme === "dark" ? "bg-dark text-white" : ""}
                    />
                    <InputGroup.Text id="unit-rsu" className={theme === "dark" ? "bg-dark text-white" : ""}>{unitRSU}</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="requirement-dc" className={theme === "dark" ? "bg-dark text-white" : ""}>
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
                      className={theme === "dark" ? "bg-dark text-white" : ""}
                    />
                    <InputGroup.Text id="unit-dc" className={theme === "dark" ? "bg-dark text-white" : ""}>{unitDC}</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col md={4}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="HN" style={{ fontSize: "11pt" }} className={theme === "dark" ? "bg-dark text-white" : ""}>HN</InputGroup.Text>
                    <Form.Control
                      placeholder="0000000"
                      aria-label="HN"
                      aria-describedby="HN"
                      name="HN"
                      value={formData.HN}
                      onInput={handleInput}
                      className={theme === "dark" ? "bg-dark text-white" : ""}
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="patientName" style={{ fontSize: "11pt" }} className={theme === "dark" ? "bg-dark text-white" : ""}>Pt Name</InputGroup.Text>
                    <Form.Control
                      placeholder="Name of Patient"
                      aria-label="patientName"
                      aria-describedby="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onInput={handleInput}
                      required
                      className={theme === "dark" ? "bg-dark text-white" : ""}
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
                      className={theme === "dark" ? "bg-dark text-white" : ""}
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
                    <InputGroup.Text id="note-label" className={theme === "dark" ? "bg-dark text-white" : ""}>
                      Comment:
                    </InputGroup.Text>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Message from Instructor"
                      aria-label="note"
                      aria-describedby="note"
                      name="note"
                      value={formData.note}
                      onInput={handleInput}
                      disabled
                      className={theme === "dark" ? "bg-dark text-white" : ""}
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
      <Modal.Footer className={theme}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalUpdateReq;
