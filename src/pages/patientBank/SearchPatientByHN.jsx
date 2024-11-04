import React, { useState, useEffect, useContext } from "react";
import NavbarPatientBank from "./NavbarPatientBank";
import NavbarSupervisor from "../supervisor/NavbarSupervisor";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { ThemeContext } from "../../ThemeContext";
import {
  getInstructorsByTeamleaderRole,
  getPatientByHn,
  getAllStudents,
} from "../../features/apiCalls";
import { convertToUTCPlus7 } from "../../utilities/dateUtils";
import Cookies from "js-cookie";
import LoginByEmail from "../../components/LoginByEmail";

function SearchPatientByHN() {
  const { theme } = useContext(ThemeContext);
  const themeClass = theme === "dark" ? "form-control-dark" : "";
  const containerClass = theme === "dark" ? "container-dark" : "";

  const email = Cookies.get("email");

  const [role, setRole] = useState("");
  useEffect(() => {
    const savedRole = Cookies.get("role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const [hn, setHn] = useState("");
  const [patient, setPatient] = useState({});
  const [show, setShow] = useState(false);

  const [updatePt, setUpdatePt] = useState({
    name: "",
    tel: "",
    teamleaderEmail: "",
    studentEmail: "",
    complexity: "",
    note: "",
    status: "",
    acceptedDate: "",
    planApprovedDate: "",
    completedDate: "",
    planApprovalBy: "",
    completedTxApprovalBy: "",
    birthDate: "",
    emergencyContact: "",
    emergencyTel: "",
    relationship: "",
  });

  useEffect(() => {
    if (patient) {
      setUpdatePt((prevPt) => ({
        ...prevPt,
        name: patient.name || "",
        tel: patient.tel || "",
        teamleaderEmail: patient.teamleaderEmail || "",
        studentEmail: patient.studentEmail || "",
        complexity: patient.complexity || "",
        note: patient.note || "",
        status: patient.status || "",
        acceptedDate: patient.acceptedDate
          ? convertToUTCPlus7(patient.acceptedDate)
          : "",
        planApprovalBy: patient.planApprovalBy || "",
        planApprovedDate: patient.planApprovedDate
          ? convertToUTCPlus7(patient.planApprovedDate)
          : "",
        completedDate: patient.completedDate
          ? convertToUTCPlus7(patient.completedDate)
          : "",
        completedTxApprovalBy: patient.completedTxApprovalBy || "",
        birthDate: patient.birthDate
          ? convertToUTCPlus7(patient.birthDate)
          : "",
        emergencyContact: patient.emergencyContact || "",
        emergencyTel: patient.emergencyTel || "",
        relationship: patient.relationship || "",
      }));
    }
  }, [patient]);

  const [error, setError] = useState(null);

  // Handler for fetching patient by HN
  const handleFetchPatientByHn = async () => {
    try {
      const result = await getPatientByHn(hn);
      if (result.error) {
        setError(result.error);
      } else {
        setPatient(result[0]);
        setShow(true);
        setError(null);
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const result = await getInstructorsByTeamleaderRole(1);
        if (result.error) {
          setError(result.error);
        } else {
          setInstructors(result);
        }
      } catch (error) {
        setError("Error fetching instructors: " + error.message);
      }
    };
    fetchInstructors();
  }, []);

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await getAllStudents();
        if (result.error) {
          setError(result.error);
        } else {
          //console.log(result.data.result);
          setStudents(result.data.result);
        }
      } catch (error) {
        setError("Error fetching students: " + error.message);
      }
    };
    fetchStudents();
  }, []);

  const getStudentName = (studentEmail) => {
    const student = students.find(
      (student) => student.studentEmail === studentEmail
    );
    return student ? student.studentName : "";
  };

  const getInstructorName = (instructorEmail) => {
    const instructor = instructors.find(
      (instructor) => instructor.instructorEmail === instructorEmail
    );
    return instructor ? instructor.instructorName : "";
  };

  return (
    <>
      {email ? (
        <>
          {role === "ptBank" ? <NavbarPatientBank /> : <NavbarSupervisor />}
          <Container className={`${containerClass}`}>
            <Form className="mt-4">
              <Form.Group as={Row} className="mb-3">
                <Col md={8}>
                  <Form.Control
                    type="text"
                    name="hn"
                    value={hn}
                    onChange={(e) => setHn(e.target.value)}
                    required
                    placeholder="กรอกเลขที่บัตรผู้ป่วย"
                    className={themeClass}
                  />
                </Col>
                <Col>
                  <Button
                    variant={
                      theme === "light" ? "outline-dark" : "outline-light"
                    }
                    onClick={handleFetchPatientByHn}
                  >
                    ค้นหาผู้ป่วยจากเลขที่บัตร
                  </Button>
                </Col>
              </Form.Group>

              {/* Render the patient details only if patient data is available */}
              {show && (
                <>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      ชื่อ นามสกุล ผู้ปวย
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        className={themeClass}
                        type="text"
                        name="name"
                        value={updatePt.name}
                        placeholder="คำนำหน้า ชื่อ นามสกุล ผู้ปวย"
                        onChange={(e) =>
                          setUpdatePt((prevPt) => ({
                            ...prevPt,
                            name: e.target.value,
                          }))
                        }
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      หมายเลขโทรศัพท์ผู้ป่วย:
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        className={themeClass}
                        type="text"
                        name="tel"
                        value={updatePt.tel}
                        onChange={(e) =>
                          setUpdatePt((prevPt) => ({
                            ...prevPt,
                            tel: e.target.value,
                          }))
                        }
                        placeholder="เบอร์โทรศัพท์ผู้ป่วย"
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      วันเกิดผู้ป่วย:
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        className={themeClass}
                        type="text"
                        name="birthDate"
                        value={updatePt.birthDate}
                        onChange={(e) =>
                          setUpdatePt((prevPt) => ({
                            ...prevPt,
                            birthDate: e.target.value,
                          }))
                        }
                        placeholder="วันเกิดผู้ป่วย"
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      ชื่อผู้ติดต่อกรณีฉุกเฉิน:
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        className={themeClass}
                        type="text"
                        name="emergencyContact"
                        value={updatePt.emergencyContact}
                        onChange={(e) =>
                          setUpdatePt((prevPt) => ({
                            ...prevPt,
                            emergencyContact: e.target.value,
                          }))
                        }
                        placeholder="ชื่อผู้ติดต่อกรณีฉุกเฉิน"
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      ความสัมพันธ์กับผู้ป่วย:
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        className={themeClass}
                        type="text"
                        name="relationship"
                        value={updatePt.relationship}
                        onChange={(e) =>
                          setUpdatePt((prevPt) => ({
                            ...prevPt,
                            relationship: e.target.value,
                          }))
                        }
                        placeholder="ความสัมพันธ์กับผู้ป่วย"
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      หมายเลขโทรศัพท์ผู้ติดต่อกรณีฉุกเฉิน:
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        className={themeClass}
                        type="text"
                        name="emergencyTel"
                        value={updatePt.emergencyTel}
                        onChange={(e) =>
                          setUpdatePt((prevPt) => ({
                            ...prevPt,
                            emergencyTel: e.target.value,
                          }))
                        }
                        placeholder="หมายเลขโทรศัพท์ผู้ติดต่อกรณีฉุกเฉิน"
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      หมายเหตุ:
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        className={themeClass}
                        type="text"
                        name="note"
                        value={updatePt.note}
                        onChange={(e) =>
                          setUpdatePt((prevPt) => ({
                            ...prevPt,
                            note: e.target.value,
                          }))
                        }
                        placeholder="หมายเหตุ"
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      อาจารย์ผู้รับมอบหมาย:
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        className={themeClass}
                        type="text"
                        name="teamleaderEmail"
                        value={getInstructorName(updatePt.teamleaderEmail)}
                        placeholder="อาจารย์ผู้รับมอบหมาย"
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      นักศึกษาผู้รับเคส:
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        className={themeClass}
                        type="text"
                        name="studentEmail"
                        value={getStudentName(updatePt.studentEmail)}
                        placeholder="นักศึกษาผู้รับเคส"
                        readOnly
                      />
                    </Col>
                  </Form.Group>
                </>
              )}
            </Form>
          </Container>
        </>
      ) : (
        <>
          <div>
            <LoginByEmail />
          </div>
        </>
      )}
    </>
  );
}

export default SearchPatientByHN;
