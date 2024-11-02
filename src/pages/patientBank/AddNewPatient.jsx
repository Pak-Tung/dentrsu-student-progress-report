import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../ThemeContext";
import NavbarPatientBank from "./NavbarPatientBank";
import {
  insertNewPatient,
  getInstructorsByTeamleaderRole,
  getStudentByTeamleaderEmail,
} from "../../features/apiCalls";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { calculateAge } from "../../utilities/dateUtils";
import Cookies from "js-cookie";
import LoginByEmail from "../../components/LoginByEmail";

function AddNewPatient() {
  const { theme } = useContext(ThemeContext);
  const containerClass = theme === "dark" ? "container-dark" : "";
  const userEmail = Cookies.get("email");

  const [formData, setFormData] = useState({
    hn: "",
    name: "",
    tel: "",
    teamleaderEmail: "",
    studentEmail: "",
    birthDate: "",
    emergencyContact: "",
    emergencyTel: "",
    relationship: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Effect to clear success message after 2 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 2000); // Clear after 2 seconds

      return () => clearTimeout(timer); // Clean up the timer on unmount or when the successMessage changes
    }
  }, [successMessage]);

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "birthDate") {
      const calculatedAge = calculateAge(value);
      setAge(calculatedAge);
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submit behavior

    try {
      const result = await insertNewPatient(formData); // Call the API to insert the patient
      console.log(result);
      if (result.error) {
        setError(
          result.error.message ||
            "An error occurred while creating the patient."
        );
        setSuccessMessage(null);
      } else if (result.affectedRows === 1) {
        setSuccessMessage("สร้างผู้ป่วยใหม่สำเร็จ!");
        setError(null);
        // Clear form after successful submission
        setFormData({
          hn: "",
          name: "",
          tel: "",
          teamleaderEmail: "",
          studentEmail: "",
          birthDate: "",
          emergencyContact: "",
          emergencyTel: "",
          relationship: "",
        });
        setSelectedTeamleader("");
        setSelectedStudent("");
        setAge("");
      } else {
        setError("ไม่สามารถสร้างผู้ป่วยใหม่ได้ กรุณาลองอีกครั้ง");
        setSuccessMessage(null);
      }
    } catch (error) {
      console.log("error", error);
      setError(
        "เกิดข้อผิดพลาดในการสร้างผู้ป่วย: " +
          (error.message || "Unknown error.")
      );
      setSuccessMessage(null);
    }
  };

  const [instructors, setInstructors] = useState([]);
  const [selectedTeamleader, setSelectedTeamleader] = useState("");

  const handleTeamleaderChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedTeamleader(selectedValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      teamleaderEmail: selectedValue,
    }));
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const result = await getInstructorsByTeamleaderRole(1);
        if (result.error) {
          setError(result.error.message || "Error fetching instructors");
        } else {
          setInstructors(result);
        }
      } catch (error) {
        setError("Error fetching instructors: " + error.message);
      }
    };
    fetchInstructors();
  }, []);

  const [studentsInTeam, setStudentsInTeam] = useState([]);

  useEffect(() => {
    const fetchStudentsInTeam = async () => {
      try {
        if (selectedTeamleader) {
          const result = await getStudentByTeamleaderEmail(selectedTeamleader);
          if (result.error) {
            setError(result.error.message || "Error fetching students");
          } else {
            setStudentsInTeam(result);
          }
        }
      } catch (error) {
        setError("Error fetching students: " + error.message);
      }
    };
    fetchStudentsInTeam();
  }, [selectedTeamleader]);

  const [selectedStudent, setSelectedStudent] = useState("");

  const handleStudentChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedStudent(selectedValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      studentEmail: selectedValue,
    }));
  };

  const [age, setAge] = useState("");

  return (
    <>
      {userEmail ? (
        <>
          <NavbarPatientBank />

          <Container fluid className={`${containerClass}`}>
            <h2>เพิ่มบัตรผู้ป่วยใหม่</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}
            <Form className="container-md mt-3 border" onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
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
                </Col>

                <Col md={8}>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>ชื่อ นามสกุล ผู้ป่วย</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="กรอกคำนำหน้า ชื่อ นามสกุล ผู้ป่วย"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="tel" className="mb-3">
                    <Form.Label>หมายเลขโทรศัพท์ผู้ป่วย</Form.Label>
                    <Form.Control
                      type="tel"
                      name="tel"
                      value={formData.tel}
                      onChange={handleChange}
                      placeholder="กรอกหมายเลขโทรศัพท์"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="birthDate" className="mb-3">
                    <Form.Label>
                      วันเกิดผู้ป่วย "ค.ศ. เท่านั้น"{" "}
                      {age !== "" && `(อายุ ${age} ปี)`}
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      placeholder="กรอกวันเกิด"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="emergencyContact" className="mb-3">
                    <Form.Label>ชื่อผู้ติดต่อกรณีฉุกเฉิน</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="กรอกชื่อผู้ติดต่อกรณีฉุกเฉิน"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="relationship" className="mb-3">
                    <Form.Label>ความสัมพันธ์กับผู้ป่วย</Form.Label>
                    <Form.Control
                      type="text"
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleChange}
                      placeholder="กรอกความสัมพันธ์กับผู้ป่วย"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="emergencyTel" className="mb-3">
                    <Form.Label>หมายเลขโทรศัพท์ผู้ติดต่อกรณีฉุกเฉิน</Form.Label>
                    <Form.Control
                      type="tel"
                      name="emergencyTel"
                      value={formData.emergencyTel}
                      onChange={handleChange}
                      placeholder="กรอกหมายเลขโทรศัพท์ผู้ติดต่อกรณีฉุกเฉิน"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="teamleader" className="mb-3">
                    <Form.Label>อาจารย์ผู้รับมอบหมาย:</Form.Label>
                    <Form.Select
                      name="teamleaderEmail"
                      value={selectedTeamleader}
                      onChange={handleTeamleaderChange}
                    >
                      <option value="" disabled>
                        เลือกอาจารย์ผู้รับมอบหมาย
                      </option>
                      {instructors.map((instructor) => (
                        <option
                          key={instructor.id}
                          value={instructor.instructorEmail}
                        >
                          {instructor.instructorName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="studentEmail" className="mb-3">
                    <Form.Label>นักศึกษาเจ้าของเคส:</Form.Label>
                    <Form.Select
                      name="studentEmail"
                      value={selectedStudent}
                      onChange={handleStudentChange}
                    >
                      <option value="" disabled>
                        เลือกนักศึกษาที่จะมอบหมาย
                      </option>
                      {studentsInTeam.map((student) => (
                        <option
                          key={student.studentId}
                          value={student.studentEmail}
                        >
                          {student.studentName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="dark" type="submit" className="mt-3">
                บันทึกข้อมูล
              </Button>
            </Form>
          </Container>
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default AddNewPatient;
