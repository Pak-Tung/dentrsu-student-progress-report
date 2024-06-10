import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getStudentByEmail, getAllDivisions } from "../../features/apiCalls";
import Cookies from "js-cookie";
import GoogleLogin from "../../components/GoogleLogin";
import Navbar from "../../components/Navbar";
import SubmissionForm from "./SubmissionForm";
import { Form, Container, Row, Col } from "react-bootstrap";
import "../../pages/CustomStyles.css";

function ReqSubmit() {
  if (Cookies.get("user") === undefined) {
    Cookies.set("user", JSON.stringify({}));
  } else {
    console.log("User email", Cookies.get("user"));
  }

  const user = JSON.parse(Cookies.get("user"));
  console.log("User in Profile", user);
  const userEmail = user.email;
  console.log("UserEmail", userEmail);

  const [student, setStudent] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("oper");
  const [requirementLabel, setRequirementLabel] = useState(
    "Operative Requirement"
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await getStudentByEmail(userEmail);
      const { error } = result;
      const data = result[0];
      console.log("result", result[0]);
      if (error) {
        console.log(error);
      } else {
        if (data) {
          console.log(data);
          setStudent(data);
        } else {
          console.log("Data is undefined");
        }
      }
    };
    fetchData();
  }, [userEmail]);

  useEffect(() => {
    const fetchDivisions = async () => {
      const result = await getAllDivisions();
      console.log("Divisions", result);
      const { error } = result;
      if (error) {
        console.log(error);
      } else {
        setDivisions(result);
      }
    };
    fetchDivisions();
  }, []);

  const handleDivisionChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedDivision(selectedValue);
    const selectedDivisionObj = divisions.find(
      (division) => division.shortName === selectedValue
    );
    setRequirementLabel(
      selectedDivisionObj
        ? selectedDivisionObj.fullName + " Requirement"
        : "Requirement"
    );
  };

  return (
    <>
      {userEmail !== undefined ? (
        <>
          <Navbar />
          <Container>
            <Row className="justify-content-center">
              <Col md={6} className="text-center">
                <h4>{requirementLabel} Submission</h4>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={6} className="text-center">
                <Form.Group controlId="divisionSelect">
                  <Form.Label className="w-100">
                    <b>Select Division</b>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedDivision}
                    onChange={handleDivisionChange}
                    className="custom-width"
                  >
                    {divisions.map((division) => (
                      <option key={division.id} value={division.shortName}>
                        {division.fullName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Container>
          <br />
          <div className="d-flex justify-content-center">
            <SubmissionForm
              division={selectedDivision}
              key={selectedDivision}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <GoogleLogin />
          </div>
        </>
      )}
    </>
  );
}

export default ReqSubmit;
