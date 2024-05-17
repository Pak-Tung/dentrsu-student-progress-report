import React, { useEffect, useState } from "react";
//import Dropdown from "react-bootstrap/Dropdown";
import { getReqByDivision, insertOperReq } from "../features/apiCalls";
import { getInstructorsByDivision, sendEmailToInstructor } from "../features/apiTL";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "../App.css";
import Cookies from "js-cookie";

function SubmissionForm(division) {
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
        const type = response.map((item) => item.type);
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

  // State to hold the selected value
  const [selectedOption, setSelectedOption] = useState("");

  // State to hold the selected instructor
  const [selectedInstructor, setSelectedInstructor] = useState("");

  const [unitRSU, setUnitRSU] = useState("unit_RSU");

  const [unitDC, setUnitDC] = useState("unit_DC");

  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
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
  });

  // Function to handle selection
  const handleChange = (event) => {
    const selected = event.target.value;
    setSelectedOption(event.target.value);
    console.log("options", options);

    // Find the item that matches the selected type
    const item = options.find((d) => d.type === selected);

    // Check if req_RSU is not zero, then set unit_RSU
    if (item && item.req_RSU > 0) {
      setUnitRSU(item.unit_RSU);
    } else {
      setUnitRSU(""); // Clear unit_RSU if condition is not met
    }

    // Check if req_DC is not zero, then set unit_DC
    if (item && item.req_DC > 0) {
      setUnitDC(item.unit_DC);
    } else {
      setUnitDC(""); // Clear unit_RSU if condition is not met
    }

    // Update the form data
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
        console.log("form data", JSON.stringify(formData));
        const response = await insertOperReq(formData);
        console.log("responseAPI", response);
        // Handle success, e.g. redirect or show a notification
        if (response.insertId > 0 && response.affectedRows > 0) {
          //await sendEmailToInstructor(formData);
          alert("Form submitted successfully!");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle errors, possibly network issues or server down
      }
    }
    setValidated(true);
  };

  return (
    <>
      <body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Container fluid>
            <Row className="justify-content-center">
              <Col>
                <Form.Group controlId="Form.SelectCustom" className="mb-3">
                  <Form.Select
                    name="type"
                    value={selectedOption}
                    onChange={handleChange}
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
                  <InputGroup.Text id="area">Area/Teeth</InputGroup.Text>
                  <Form.Control
                    placeholder="Tooth/Sextant/Quadrant/Full Mouth/Case"
                    aria-label="area"
                    aria-describedby="area"
                    name="area"
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
                    required
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
                  Submit
                </Button>
              </div>
            </Row>
          </Container>
        </Form>
      </body>
    </>
  );
}

export default SubmissionForm;
