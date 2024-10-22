import React, { useState, useEffect, useContext } from "react";
import NavbarPatientBank from "./NavbarPatientBank";
import { Button, Form, Row, Col, Container, Alert } from "react-bootstrap";
import { ThemeContext } from "../../ThemeContext";
import Cookies from "js-cookie";
import {
  getInstructorsByTeamleaderRole,
  updatePatientbyhn,
  getPatientByHn,
} from "../../features/apiCalls";
import { calculateAge, convertToUTCPlus7 } from "../../utilities/dateUtils";

function AssignPatientToInstructor() {
  const { theme } = useContext(ThemeContext);
  const containerClass = theme === "dark" ? "container-dark" : "";
  const [user] = useState(() => {
    const cookieUser = Cookies.get("user");
    return cookieUser ? JSON.parse(cookieUser) : {};
  });

  const [hn, setHn] = useState("");
  const [patient, setPatient] = useState({});
  const [show, setShow] = useState(false);
  const [age, setAge] = useState("");

  const initialUpdatePtState = {
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
  };

  const [updatePt, setUpdatePt] = useState(initialUpdatePtState);

  useEffect(() => {
    if (Object.keys(patient).length === 0) {
      setUpdatePt(initialUpdatePtState);
      setSelectedTeamleader("");
    } else {
      setUpdatePt({
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
        planApprovedDate: patient.planApprovedDate
          ? convertToUTCPlus7(patient.planApprovedDate)
          : "",
        completedDate: patient.completedDate
          ? convertToUTCPlus7(patient.completedDate)
          : "",
        planApprovalBy: patient.planApprovalBy || "",
        completedTxApprovalBy: patient.completedTxApprovalBy || "",
        birthDate: patient.birthDate
          ? convertToUTCPlus7(patient.birthDate)
          : "",
        emergencyContact: patient.emergencyContact || "",
        emergencyTel: patient.emergencyTel || "",
        relationship: patient.relationship || "",
      });
      setSelectedTeamleader(patient.teamleaderEmail || "");
      if (patient.birthDate) {
        setAge(calculateAge(patient.birthDate));
      }
    }
  }, [patient]);

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Effect to clear success message after 2 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handler for fetching patient by HN
  const handleFetchPatientByHn = async () => {
    setShow(false);
    setError(null);
    setSuccessMessage(null);
    try {
      const result = await getPatientByHn(hn);
      if (result.error) {
        setError(result.error);
      } else if (!result || result.length === 0) {
        setError("ไม่พบข้อมูลผู้ป่วยตาม HN ที่ระบุ");
      } else {
        setPatient(result[0]);
        setShow(true);
        setError(null);
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  // Handler for form submission
  const handlePatientUpdateFormSubmit = async (e) => {
    e.preventDefault();

    const processedUpdatePt = {
      ...updatePt,
      acceptedDate:
        updatePt.acceptedDate === "" || updatePt.acceptedDate === "-"
          ? null
          : updatePt.acceptedDate,
      completedDate:
        updatePt.completedDate === "" || updatePt.completedDate === "-"
          ? null
          : updatePt.completedDate,
      planApprovedDate:
        updatePt.planApprovedDate === "" || updatePt.planApprovedDate === "-"
          ? null
          : updatePt.planApprovedDate,
    };

    // Submit patient update form
    try {
      const result = await updatePatientbyhn(patient.hn, processedUpdatePt);
      console.log(result);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage("บันทึกสำเร็จ!");
        setError(null);

        // Clear the success message after 2 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);

        // Clear form after successful submission
        setUpdatePt(initialUpdatePtState);
        setPatient({});
        setSelectedTeamleader("");
        setHn("");
        setShow(false);
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  const [instructors, setInstructors] = useState([]);
  const [selectedTeamleader, setSelectedTeamleader] = useState("");

  const handleTeamleaderChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedTeamleader(selectedValue);
    setUpdatePt((prevUpdatePt) => ({
      ...prevUpdatePt,
      teamleaderEmail: selectedValue,
    }));
  };

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

  const handleUpdatePtFormChange = (e) => {
    const { name, value } = e.target;
    setUpdatePt((prevUpdatePt) => ({
      ...prevUpdatePt,
      [name]: value,
    }));
  };

  return (
    <>
      <NavbarPatientBank />

      <Container className={`mt-4 ${containerClass}`}>
        <h2>แก้ไขข้อมูลผู้ป่วย</h2>
        <Form onSubmit={handlePatientUpdateFormSubmit}>
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
              <Button variant="outline-dark" onClick={handleFetchPatientByHn}>
                ค้นหาผู้ป่วย
              </Button>
            </Col>
          </Form.Group>

          {show && (
            <>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column md={3}>
                  ชื่อ นามสกุล ผู้ปวย
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="text"
                    name="name"
                    value={updatePt.name}
                    onChange={handleUpdatePtFormChange}
                    required
                    placeholder="คำนำหน้า ชื่อ นามสกุล ผู้ปวย"
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
                    onChange={handleUpdatePtFormChange}
                    placeholder="เบอร์โทรศัพท์ผู้ป่วย"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column md={3}>
                  วันเกิดผู้ป่วย: {age !== "" && `(อายุ ${age} ปี)`}
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={updatePt.birthDate}
                    onChange={handleUpdatePtFormChange}
                    placeholder="วันเกิดผู้ป่วย"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column md={3}>
                  ชื่อผู้ติดต่อกรณีฉุกเฉิน:
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="text"
                    name="emergencyContact"
                    value={updatePt.emergencyContact}
                    onChange={handleUpdatePtFormChange}
                    placeholder="ชื่อผู้ติดต่อกรณีฉุกเฉิน"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column md={3}>
                  หมายเลขโทรศัพท์ผู้ติดต่อกรณีฉุกเฉิน:
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="text"
                    name="emergencyTel"
                    value={updatePt.emergencyTel}
                    onChange={handleUpdatePtFormChange}
                    placeholder="หมายเลขโทรศัพท์ผู้ติดต่อกรณีฉุกเฉิน"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column md={3}>
                  ความสัมพันธ์กับผู้ป่วย:
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="text"
                    name="relationship"
                    value={updatePt.relationship}
                    onChange={handleUpdatePtFormChange}
                    placeholder="ความสัมพันธ์กับผู้ป่วย"
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
                    onChange={handleUpdatePtFormChange}
                    placeholder="หมายเหตุสำคัญสำหรับผู้ป่วยรายนี้"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column md={3}>
                  อาจารย์ผู้รับมอบหมาย:
                </Form.Label>
                <Col md={9}>
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
                </Col>
              </Form.Group>

              <Button variant="dark" type="submit">
                บันทึกข้อมูล
              </Button>
            </>
          )}
        </Form>
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success" className="mt-3">
            {successMessage}
          </Alert>
        )}
      </Container>
    </>
  );
}

export default AssignPatientToInstructor;
