import React, { useState, useEffect, useContext } from "react";
import NavBarPatientBank from "./NavbarPatientBank";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { ThemeContext } from "../../ThemeContext";
import Cookies from "js-cookie";
import {
  getInstructorsByTeamleaderRole,
  getPatientByHn,
  getAllStudents,
} from "../../features/apiCalls";

function SearchPatientByHN() {
  const { theme } = useContext(ThemeContext);
  const containerClass = theme === "dark" ? "container-dark" : "";

  const [hn, setHn] = useState("");
  const [patient, setPatient] = useState({});

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
  });

  useEffect(() => {
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
        ? patient.acceptedDate.split("T")[0]
        : "",
      planApprovalBy: patient.planApprovalBy || "",
      planApprovedDate: patient.planApprovedDate
        ? patient.planApprovedDate.split("T")[0]
        : "",
      completedDate: patient.completedDate
        ? patient.completedDate.split("T")[0]
        : "",
      completedTxApprovalBy: patient.completedTxApprovalBy || "",
    }));
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
      <NavBarPatientBank />
      <Container className="mt-4">
        <Form className={`mt-4 ${containerClass}`}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={3}>
              เลขที่บัตรผู้ป่วย
            </Form.Label>
            <Col md={7}>
              <Form.Control
                type="text"
                name="hn"
                value={hn}
                onChange={(e) => setHn(e.target.value)}
                required
                placeholder="เลขที่บัตรผู้ป่วย"
              />
            </Col>
            <Col md={2}>
              <Button variant="dark" onClick={handleFetchPatientByHn}>
                ค้นหาผู้ป่วยจากเลขที่บัตร
              </Button>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column md={3}>
              ชื่อ นามสกุล ผู้ปวย
            </Form.Label>
            <Col md={9}>
              <Form.Control
                type="text"
                name="name"
                value={updatePt.name}
                placeholder="คำนำหน้า ชื่อ นามสกุล ผู้ปวย"
                onChange={(e) =>
                  setUpdatePt((prevPt) => ({ ...prevPt, name: e.target.value }))
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
                type="text"
                name="tel"
                value={updatePt.tel}
                onChange={(e) =>
                  setUpdatePt((prevPt) => ({ ...prevPt, tel: e.target.value }))
                }
                placeholder="เบอร์โทรศัพท์ผู้ป่วย"
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
                type="text"
                name="note"
                value={updatePt.note}
                onChange={(e) =>
                  setUpdatePt((prevPt) => ({ ...prevPt, note: e.target.value }))
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
                type="text"
                name="studentEmail"
                value={getStudentName(updatePt.studentEmail)}
                placeholder="นักศึกษาผู้รับเคส"
                readOnly
              />
            </Col>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
}

export default SearchPatientByHN;
