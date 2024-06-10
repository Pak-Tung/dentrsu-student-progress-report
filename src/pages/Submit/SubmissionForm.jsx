import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  getReqByDivision,
  insertDivisionReq,
  getStudentByEmail,
} from "../../features/apiCalls";
import { getInstructorsByDivision } from "../../features/apiTL";
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

const SubmissionForm = ({ division }) => {
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [options, setOptions] = useState([]);
  const [optionsInstructor, setOptionsInstructor] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [unitRSU, setUnitRSU] = useState("unit_RSU");
  const [unitDC, setUnitDC] = useState("unit_DC");
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    studentEmail: userEmail,
    type: "",
    area: "",
    req_RSU: 0,
    unit_RSU: "",
    req_DC: 0,
    unit_DC: "",
    HN: "",
    patientName: "",
    isApproved: 0,
    instructorEmail: "",
    approvedDate: "",
    bookNo: 0,
    pageNo: 0,
    note: "",
  });
  const [divisionInstructor, setDivisionInstructor] = useState("");
  const [divisionInstructorName, setDivisionInstructorName] = useState("");

  const divisionMap = useMemo(() => ({
    oper: "Operative",
    endo: "Endodontic",
    perio: "Periodontic",
    prosth: "Prosthodontic",
    diag: "Diagnostic",
    radio: "Radiology",
    sur: "Oral Surgery",
    pedo: "Pediatric Dentistry",
    ortho: "Orthodontic",
  }), []);

  const fullNameDivision = useCallback((division) => {
    return divisionMap[division] || "";
  }, [divisionMap]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqResponse, instructorResponse, studentResponse] = await Promise.all([
          getReqByDivision(division),
          getInstructorsByDivision(division),
          getStudentByEmail(userEmail)
        ]);


        setOptions(reqResponse);
        setOptionsInstructor(instructorResponse);

        const studentData = studentResponse[0];
        setDivisionInstructor(studentData[`${division}InstructorEmail`]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [division, userEmail]);

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

    const item = options.find((d) => d.type === value);
    const reqRSU = item?.req_RSU || 0;
    const reqDC = item?.req_DC || 0;

    setUnitRSU(reqRSU > 0 ? item.unit_RSU : "");
    setUnitDC(reqDC > 0 ? item.unit_DC : "");

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      req_RSU: reqRSU,
      req_DC: reqDC,
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
        const updatedFormData = {
          ...formData,
          unit_RSU: unitRSU,
          unit_DC: unitDC,
        };
        console.log('updatedFormData', updatedFormData);
        const response = await insertDivisionReq(updatedFormData, division);
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

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Container fluid>
          <Row className="justify-content-center">
            <Col>
              <InputGroupField
                id="bookNo"
                label="Requirement Book No"
                placeholder="Requirement Book No. (if not available, enter 0)"
                name="bookNo"
                onChange={handleInput}
                required={true}
              />
            </Col>
            </Row>
            <Row className="justify-content-center">
            <Col>
              <InputGroupField
                id="pageNo"
                label="Requirement Page No"
                placeholder="Requirement Page No. (if not available, enter 0)"
                name="pageNo"
                onChange={handleInput}
                required={true}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col>
              <Form.Group controlId="Form.SelectCustom" className="mb-3">
                <Form.Select
                  name="type"
                  value={selectedOption}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Type of Work</option>
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
              <InputGroupField
                id="area"
                label="Area/Teeth"
                placeholder="Tooth/Sextant/Quadrant/Full Mouth/Case"
                name="area"
                onChange={handleInput}
                required
              />
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="requirement-rsu">
                  Requirement (RSU)
                </InputGroup.Text>
                <Form.Control
                  id="requirement-rsu"
                  label="Requirement (RSU)"
                  placeholder="0"
                  name="req_RSU"
                  onChange={handleInput}
                  disabled={unitRSU === "" || unitRSU === "unit_RSU"}
                  required
                />
                <InputGroup.Text id="unit_rsu">{unitRSU}</InputGroup.Text>
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
                  id="requirement-dc"
                  label="Requirement (DC)"
                  placeholder="0"
                  name="req_DC"
                  onChange={handleInput}
                  disabled={unitDC === "" || unitDC === "unit_DC"}
                  required
                />
                <InputGroup.Text id="unit_dc">{unitDC}</InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col md={4}>
              <InputGroupField
                id="HN"
                label="HN"
                placeholder="0000000"
                name="HN"
                onChange={handleInput}
                required
              />
            </Col>
            <Col>
              <InputGroupField
                id="patientName"
                label="Pt Name"
                placeholder="Name of Patient"
                name="patientName"
                onChange={handleInput}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroupField
                id="advisor"
                label={`${fullNameDivision(division)} Advisor`}
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
                id="advisorEmail"
                label={`${fullNameDivision(division)} Advisor Email`}
                placeholder="Advisor Email"
                name="instructorEmail"
                value={divisionInstructor}
                onChange={handleInput}
                disabled
                required
              />
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
    </>
  );
}

export default SubmissionForm;
