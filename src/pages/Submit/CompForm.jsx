import React, { useEffect, useState } from "react";
import {
  getCompcasesDetails,
  insertCompletedCase,
  getInstructorsByTeamleaderRole,
  getStudentByEmail,
} from "../../features/apiCalls";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "../../App.css";
import Cookies from "js-cookie";

const InputGroupField = ({
  id,
  label,
  placeholder,
  name,
  value,
  onChange,
  disabled,
  required,
}) => (
  <InputGroup className="mb-3">
    <InputGroup.Text id={id}>{label}:</InputGroup.Text>
    <Form.Control
      placeholder={placeholder}
      aria-label={label.toLowerCase()}
      aria-describedby={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
    />
  </InputGroup>
);

function CompForm() {
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [options, setOptions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getCompcasesDetails();
      const { error } = response;
      //console.log("result", response);
      if (error) {
        console.log(error);
      } else {
        const complexity = response.map((item) => item.complexity);
        setOptions(response);
      }
    };
    fetchData();
  }, []);

  const [optionsInstructor, setOptionsInstructor] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getStudentByEmail(userEmail);
      const { error } = response;
      //console.log("result", response[0].teamleaderEmail);
      if (error) {
        console.log(error);
      } else {
        setDivisionInstructor(response[0].teamleaderEmail);
        setFormData((prevState) => ({
          ...prevState,
          instructorEmail: response[0].teamleaderEmail,
        }));
      }

      const responseInstructor = await getInstructorsByTeamleaderRole(1);
      const { errorInstructor } = responseInstructor;
      //console.log("result", responseInstructor);
      if (errorInstructor) {
        console.log(errorInstructor);
      } else {
        setOptionsInstructor(responseInstructor);
      }
    };
    fetchData();
  }, []);

  // State to hold the selected value
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
  });

  // Function to handle selection
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedOption(value);

    const selectedItem = options.find((d) => d.complexity === value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      caseNo: selectedItem ? selectedItem.id : prevState.id,
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
    } else if (formData.instructorEmail === "") {
      alert("Instructor Email cannot be empty.");
    } else {
      try {
        console.log("form data", JSON.stringify(formData));
        const response = await insertCompletedCase(formData);
        console.log("responseAPI", response);
        if (response.insertId > 0 && response.affectedRows > 0) {
          //await sendEmailToInstructor(formData);
          alert("Form submitted successfully!");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
    setValidated(true);
  };

  const [divisionInstructor, setDivisionInstructor] = useState("");
  const [divisionInstructorName, setDivisionInstructorName] = useState("");

  useEffect(() => {
    if (divisionInstructor) {
      const instructor = optionsInstructor.find(
        (item) => item.instructorEmail === divisionInstructor
      );
      if (instructor) {
        setDivisionInstructorName(instructor.instructorName);
        setFormData((prevState) => ({
          ...prevState,
          instructorEmail: divisionInstructor,
        }));
      } else {
        setDivisionInstructorName("Instructor Not Found");
      }
    }
  }, [divisionInstructor, optionsInstructor]);

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Container fluid>
        <Row className="justify-content-center">
          <Col>
            <Form.Group controlId="Form.SelectCustom" className="mb-3">
              <Form.Select
                name="complexity"
                value={selectedOption}
                onChange={handleChange}
                required
              >
                <option value="" selected disabled>Select complexity</option>
                {options.map((option) => (
                  <option key={option.id} value={option.complexity}>
                    {option.complexity}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="HN">HN</InputGroup.Text>
              <Form.Control
                placeholder="0000000"
                aria-label="HN"
                aria-describedby="HN"
                name="HN"
                onInput={handleInput}
                required
              />
            </InputGroup>
          </Col>
          </Row>
          <Row>
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
              <InputGroupField
                id="teamleader"
                label={`Team Leader Name`}
                placeholder="Name of Advisor"
                name="instructorName"
                value={formData.instructorName || divisionInstructorName}
                onChange={handleInput}
                disabled
                required
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroupField
                id="teamleaderEmail"
                label={`Team Leader Email`}
                placeholder="Advisor Email"
                name="instructorEmail"
                value={divisionInstructor}
                onChange={handleInput}
                disabled
              />
            </Col>
          </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="note2">Note</InputGroup.Text>
              <Form.Control
                placeholder="(optional)"
                aria-label="note2"
                aria-describedby="note2"
                name="note2"
                onInput={handleInput}
              />
            </InputGroup>
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
  );
}

export default CompForm;
