import React, { useState, useEffect, useContext } from "react";
import NavBarPatientBank from "./NavbarPatientBank";
import {
  insertNewPatient,
} from "../../features/apiCalls";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { ThemeContext } from "../../ThemeContext"
import Cookies from "js-cookie";
import { formatDateFormISO, formatDate } from "../../utilities/dateUtils";

function AddNewPatient() {
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
    acceptedDate: '1899-01-01',//formatDateFormISO(new Date().toISOString()),
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Effect to clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 2000); // Clear after 2 seconds

      return () => clearTimeout(timer); // Clean up the timer on unmount
    }
  }, [successMessage]);


  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submit behavior

    try {
      const result = await insertNewPatient(formData); // Call the API to insert the patient
      console.log(result);
      if (result.affectedRows === 1) {
        setSuccessMessage("Patient created successfully!");
        setError(null);
        // Clear form after successful submission
        setFormData({
          hn: "",
          name: "",
          tel: "",
          teamleaderEmail: "",
          studentEmail: "",
          acceptedDate: "",
        });
      } else {
        setError(result.response.data.error.sqlMessage);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.log("error", error);
      setError("Error creating patient: " + error.sqlMessage);
      setSuccessMessage(null);
    }
  };

  return (
    <>
      <NavBarPatientBank />

      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <h2>เพิ่มบัตรผู้ป่วยใหม่</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="hn">
                <Form.Label>เลขที่บัตรผู้ป่วย</Form.Label>
                <Form.Control
                  type="text"
                  name="hn"
                  value={formData.hn}
                  onChange={handleChange}
                  required
                  placeholder="กรอกเลขที่บัตรผู้ป่วย"
                />
              </Form.Group>

              <Form.Group controlId="name">
                <Form.Label>ชื่อ นามสกุล ผู้ปวย</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="กรอกคำนำหน้า ชื่อ นามสกุล ผู้ปวย"
                />
              </Form.Group>

              <Form.Group controlId="tel">
                <Form.Label>หมายเลขโทรศัพท์ผู้ป่วย</Form.Label>
                <Form.Control
                  type="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  
                  placeholder="กรอกหมายเลขโทรศัพท์"
                />
              </Form.Group>          

              <Button variant="dark" type="submit" className="mt-3">
                บันทึกข้อมูล
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AddNewPatient;
