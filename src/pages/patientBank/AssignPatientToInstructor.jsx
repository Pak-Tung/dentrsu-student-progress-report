import React, { useState, useEffect, useContext } from "react";
import NavBarPatientBank from "./NavbarPatientBank";
import { Button, Form, Row, Col, Container } from "react-bootstrap";
import { ThemeContext } from "../../ThemeContext";
import Cookies from "js-cookie";
import { formatDateFormISO } from "../../utilities/dateUtils";
import {
  getInstructorsByTeamleaderRole,
  updatePatientbyhn,
  getPatientByHn,
} from "../../features/apiCalls";

function AssignPatientToInstructor() {
  const { theme } = useContext(ThemeContext);
  const containerClass = theme === "dark" ? "container-dark" : "";
  const [user, setUser] = useState(() => {
    const cookieUser = Cookies.get("user");
    return cookieUser ? JSON.parse(cookieUser) : {};
  });

  const userEmail = user.email;
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
      complexity: patient.complexity || 0,
      note: patient.note || "",
      status: patient.status || 0,
      acceptedDate: patient.acceptedDate
        ? patient.acceptedDate.split("T")[0]
        : null,
      planApprovalBy: patient.planApprovalBy || "",
      planApprovedDate: patient.planApprovedDate
        ? patient.planApprovedDate.split("T")[0]
        : null,
      completedDate: patient.completedDate
        ? patient.completedDate.split("T")[0]
        : null,
      completedTxApprovalBy: patient.completedTxApprovalBy || "",
    }));

    setSelectedTeamleader(patient.teamleaderEmail || "");
  }, [patient]);

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  // Handler for form submission
  const handlePatientUpdateFormSubmit = async (e) => {
    e.preventDefault();

    const processedUpdatePt = {
      ...updatePt,
      acceptedDate:
        updatePt.completedDate === "" || "-" ? null : updatePt.acceptedDate,
      completedDate:
        updatePt.completedDate === "" ? null : updatePt.completedDate,
      planApprovedDate:
        updatePt.planApprovedDate === "" ? null : updatePt.planApprovedDate,
    };

    // Submit patient update form
    try {
      const result = await updatePatientbyhn(patient.hn, processedUpdatePt);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage("บันทึกสำเร็จ!");
        setError(null);
        // Clear form after successful submission
        setUpdatePt({
          hn: "",
          name: "",
          tel: "",
          teamleaderEmail: "",
          note: "",
        });
        setPatient({});
        setSelectedTeamleader("");
        setHn("");
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
    setUpdatePt((prevTxPlan) => ({
      ...prevTxPlan,
      [name]: value,
    }));
  };

  return (
    <>
      <NavBarPatientBank />

      <Container className={`mt-4 ${containerClass}`}>
        <Form
          onSubmit={handlePatientUpdateFormSubmit}
          className={`mt-4 ${containerClass}`}
        >
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
              <Form.Control
                as="select"
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
              </Form.Control>
            </Col>
          </Form.Group>

          <Button variant="dark" type="submit">
            บันทึกข้อมูล
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default AssignPatientToInstructor;
