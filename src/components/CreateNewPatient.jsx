import React, { useState, useEffect, useContext } from "react";
import NavbarInstructor from "./NavbarInstructor";
import { insertNewPatient, getStudentByTeamleaderEmail } from "../features/apiCalls";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { ThemeContext } from "../ThemeContext";
import Cookies from "js-cookie";

function CreateNewPatient() {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => {
    const cookieUser = Cookies.get("user");
    return cookieUser ? JSON.parse(cookieUser) : {};
  });

  const userEmail = user.email;

  const [formData, setFormData] = useState({
    hn: "",
    name: "",
    tel: "",
    teamleaderEmail: "",
    studentEmail: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [students, setStudents] = useState([]);

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userEmail) {
        setFormData({
          ...formData,
          teamleaderEmail: userEmail,
        });
        try {
          const result = await getStudentByTeamleaderEmail(userEmail);
          if (result.error) {
            setError(result.error);
          } else if (result) {
            setStudents(result);
          } else {
            setError("No student data found");
          }
        } catch (error) {
          setError("Error fetching student data: " + error.message);
        }
      }
    };
    fetchData();
  }, [userEmail]);

  const studentOptions = students.map((student) => (
    <option key={student.studentEmail} value={student.studentEmail}>
      {student.studentName}
    </option>
  ));

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submit behavior

    try {
      const result = await insertNewPatient(formData); // Call the API to insert the patient
      if (result.error) {
        setError(result.error);
        setSuccessMessage(null);
      } else {
        setSuccessMessage("Patient created successfully!");
        setError(null);
        // Clear form after successful submission
        setFormData({
          hn: "",
          name: "",
          tel: "",
          teamleaderEmail: userEmail,
          studentEmail: "",
        });
      }
    } catch (error) {
      setError("Error creating patient: " + error.message);
      setSuccessMessage(null);
    }
  };

  return (
    <>
      <NavbarInstructor />
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <h2>Create New Patient</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="hn">
                <Form.Label>HN</Form.Label>
                <Form.Control
                  type="text"
                  name="hn"
                  value={formData.hn}
                  onChange={handleChange}
                  required
                  placeholder="Enter hospital number"
                />
              </Form.Group>

              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter patient name"
                />
              </Form.Group>

              <Form.Group controlId="tel">
                <Form.Label>Telephone</Form.Label>
                <Form.Control
                  type="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  required
                  placeholder="Enter telephone number"
                />
              </Form.Group>

              <Form.Group controlId="studentEmail">
                <Form.Label>Student</Form.Label>
                <Form.Control
                  as="select" // Change input to select
                  name="studentEmail"
                  value={formData.studentEmail}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Student</option>
                  {studentOptions}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="teamleaderEmail">
                <Form.Label>Teamleader Email</Form.Label>
                <Form.Control
                  type="email"
                  name="teamleaderEmail"
                  value={formData.teamleaderEmail}
                  onChange={handleChange}
                  required
                  placeholder="Enter team leader email"
                  readOnly // Keep this field read-only since it comes from the user context
                />
              </Form.Group>

             

              <Button variant="dark" type="submit" className="mt-3">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CreateNewPatient;
