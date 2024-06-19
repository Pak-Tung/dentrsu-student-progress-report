import React, { useEffect, useState, useContext } from "react";
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
import { ThemeContext } from "../../ThemeContext";

const InputGroupField = ({
  id,
  label,
  placeholder,
  name,
  value,
  onChange,
  disabled,
  required,
  className,
}) => (
  <InputGroup className="mb-3">
    <InputGroup.Text id={id} className={className}>
      {label}:
    </InputGroup.Text>
    <Form.Control
      placeholder={placeholder}
      aria-label={label.toLowerCase()}
      aria-describedby={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={className}
    />
  </InputGroup>
);

function CompForm() {
  const { theme } = useContext(ThemeContext);
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [options, setOptions] = useState([]);
  const [optionsInstructor, setOptionsInstructor] = useState([]);
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
  const [divisionInstructor, setDivisionInstructor] = useState("");
  const [divisionInstructorName, setDivisionInstructorName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCompcasesDetails();
      const { error } = response;
      if (error) {
        console.log(error);
      } else {
        const complexity = response.map((item) => item.complexity);
        setOptions(response);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStudentByEmail(userEmail);
      const { error } = response;
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
      if (errorInstructor) {
        console.log(errorInstructor);
      } else {
        setOptionsInstructor(responseInstructor);
      }
    };
    fetchData();
  }, [userEmail]);

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
        const response = await insertCompletedCase(formData);
        if (response.insertId > 0 && response.affectedRows > 0) {
          alert("Form submitted successfully!");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
    setValidated(true);
  };

  const themeClass = theme === "dark" ? "form-control-dark" : "";

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
                className={themeClass}
              >
                <option value="" disabled>Select complexity</option>
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
              <InputGroup.Text id="HN" className={themeClass}>HN</InputGroup.Text>
              <Form.Control
                placeholder="0000000"
                aria-label="HN"
                aria-describedby="HN"
                name="HN"
                onInput={handleInput}
                required
                className={themeClass}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="patientName" className={themeClass}>Pt Name</InputGroup.Text>
              <Form.Control
                placeholder="Name of Patient"
                aria-label="patientName"
                aria-describedby="patientName"
                name="patientName"
                onInput={handleInput}
                required
                className={themeClass}
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
              className={themeClass}
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
              className={themeClass}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="note2" className={themeClass}>Note</InputGroup.Text>
              <Form.Control
                placeholder="(optional)"
                aria-label="note2"
                aria-describedby="note2"
                name="note2"
                onInput={handleInput}
                className={themeClass}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <div className="d-grid gap-2">
            <Button variant={theme === 'dark' ? "secondary" : "dark"} size="lg" type="submit">
              Submit
            </Button>
          </div>
        </Row>
      </Container>
    </Form>
  );
}

export default CompForm;

