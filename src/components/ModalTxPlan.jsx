import React, { useEffect, useState, useContext } from "react";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  ListGroup,
  Alert,
} from "react-bootstrap";
import Cookies from "js-cookie";
import { ThemeContext } from "../ThemeContext";
import * as loadingData from "./loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import {
  getTxPlanByPatientHn,
  insertTxPlan,
  getAllDivisions,
  getInstructorsByTeamleaderRole,
  getAllStudents,
  updatePatientbyhn,
  getStudentByTeamleaderEmail,
  getTxtypesByDivision,
} from "../features/apiCalls";
import TxPlanCard from "./TxPlanCard";
import "../App.css";
import UpdateComplexity from "./UpdateComplexity";
import ButtonTreatmentPlanApproval from "./ButtonTreatmentPlanApproval";
import ButtonCompletedTxApproval from "./ButtonCompletedTxApproval";
import ButtonUpdatePatientProfile from "./ButtonUpdatePatientProfile";
import {
  formatDateFormISO,
  formatDate,
  convertToUTCPlus7,
  calculateAge,
} from "../utilities/dateUtils";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const patientStatuses = [
  { statusId: "-1", status: "Discharged" },
  { statusId: "0", status: "Charting" },
  { statusId: "1", status: "Pending Treatment Plan Approve" },
  { statusId: "2", status: "Treatment Plan Approved" },
  { statusId: "3", status: "Pending Completed Case Approve" },
  { statusId: "4", status: "Completed and Pending Recall" },
  { statusId: "5", status: "Orthodontic Referral" },
];

function ModalTxPlan({
  show,
  handleClose,
  patient,
  updatedPatient,
}) {
  const { theme } = useContext(ThemeContext);
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = Cookies.get("role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const [user] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email || "";

  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [txPlan, setTxPlan] = useState([]);
  const [nextTxId, setNextTxId] = useState(0);
  const [loadingTxPlan, setLoadingTxPlan] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPatientUpdateForm, setShowPatientUpdateForm] = useState(false);
  const [age, setAge] = useState("");
  const [newTxPlan, setNewTxPlan] = useState({
    txid: nextTxId,
    phase: "",
    area: "",
    description: "",
    hn: "",
    patientName: "",
    note: "",
    division: "",
    startDate: "",
    completedDate: "",
    status: "",
  });
  const initialUpdatePtState = {
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

  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");

  useEffect(() => {
    if (patient && patient.hn) {
      const fetchTxPlanData = async () => {
        setLoadingTxPlan(true);
        try {
          const result = await getTxPlanByPatientHn(patient.hn);
          if (result.error) {
            setError(result.error);
          } else {
            setTxPlan(result);

            // Sort treatments by txid before rendering
            const sortedTreatments = result.sort((a, b) => a.txid - b.txid);

            // Calculate the next txid
            const latestTxid = sortedTreatments.length
              ? sortedTreatments[sortedTreatments.length - 1].txid
              : 0;
            setNextTxId(latestTxid + 1);
          }
        } catch (error) {
          setError("Error fetching tx plan data: " + error.message);
        } finally {
          setLoadingTxPlan(false);
        }
      };
      fetchTxPlanData();
    }
  }, [patient.hn]);

  useEffect(() => {
    setNewTxPlan((prevTxPlan) => ({
      ...prevTxPlan,
      txid: nextTxId,
      hn: patient.hn || "",
      patientName: patient.name || "",
      status: 0,
    }));
  }, [nextTxId, patient.hn, patient.name]);

  useEffect(() => {
    if (patient) {
      setUpdatePt({
        hn: patient.hn || "",
        tel: patient.tel || "",
        teamleaderEmail: patient.teamleaderEmail || "",
        studentEmail: patient.studentEmail || "",
        complexity: patient.complexity || "",
        note: patient.note || "",
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
        status: patient.status || "",
      });

      setSelectedTeamleader(patient.teamleaderEmail || "");
      setSelectedStudent(patient.studentEmail || "");
      setSelectedStatus(patient.status || "");

      if (patient.birthDate) {
        setAge(calculateAge(patient.birthDate));
      }
      //console.log("acceptedDate", patient.acceptedDate);
    }
  }, [patient]);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const result = await getAllDivisions();
        if (result.error) {
          setError(result.error);
        } else {
          setDivisions(result);
        }
      } catch (error) {
        setError("Error fetching divisions: " + error.message);
      }
    };
    fetchDivisions();
  }, []);

  const handleAddTreatmentPlan = () => {
    if (role === "student") {
      setShowAddForm((prev) => !prev);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSelectedOption(value);
    setNewTxPlan((prevTxPlan) => ({
      ...prevTxPlan,
      [name]: value,
    }));
  };

  const handleUpdatePtFormChange = (e) => {
    const { name, value } = e.target;
    setUpdatePt((prevUpdatePt) => ({
      ...prevUpdatePt,
      [name]: value,
    }));
  };

  const handleDivisionChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedDivision(selectedValue);
    setNewTxPlan((prevTxPlan) => ({
      ...prevTxPlan,
      division: selectedValue,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await insertTxPlan(newTxPlan);
      if (result.error) {
        setError(result.error);
      } else {
        setTxPlan((prevTxPlan) => [
          ...prevTxPlan,
          { ...newTxPlan, id: nextTxId },
        ]);
        setShowAddForm(false);
        setNextTxId(nextTxId + 1);

        // Clear form inputs
        setNewTxPlan({
          txid: nextTxId + 1,
          phase: "",
          area: "",
          description: "",
          hn: patient.hn || "",
          patientName: patient.name || "",
          note: "",
          division: "",
          startDate: "",
          completedDate: "",
          status: 0,
        });
        setSelectedDivision("");
        setSelectedOption("");
      }
    } catch (error) {
      setError("Error saving tx plan data: " + error.message);
    }
  };

  const convertStatus = (status) => {
    switch (status) {
      case "-1":
        return "Discharged";
      case "0":
        return "Charting";
      case "1":
        return "Pending Tx Plan Approval";
      case "2":
        return "Tx Plan Approved";
      case "3":
        return "Pending Approval";
      case "4":
        return "Completed case and pending recall";
      case "5":
        return "Orthodontic Referral";
      default:
        return "Unknown";
    }
  };

  const handlePatientUpdate = () => {
    // Display patient update form
    setShowPatientUpdateForm((prev) => !prev);
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

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const handleStudentChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedStudent(selectedValue);
    setUpdatePt((prevUpdatePt) => ({
      ...prevUpdatePt,
      studentEmail: selectedValue,
    }));
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await getAllStudents();
        if (result.error) {
          setError(result.error);
        } else {
          setStudents(result.data.result);
        }
      } catch (error) {
        setError("Error fetching students: " + error.message);
      }
    };
    fetchStudents();
  }, []);

  const [selectedStatus, setSelectedStatus] = useState("");

  const handleStatusChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedStatus(selectedValue);
    setUpdatePt((prevUpdatePt) => ({
      ...prevUpdatePt,
      status: selectedValue,
    }));
  };

  const handlePatientUpdateFormSubmit = async (e) => {
    e.preventDefault();

    const processedUpdatePt = {
      ...updatePt,
      acceptedDate:
        updatePt.acceptedDate === "" || updatePt.acceptedDate === "-"
          ? formatDateFormISO(new Date().toISOString())
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
      if (result.error) {
        setError(result.error);
      } else {
        // Update patient data in the parent component

        if (processedUpdatePt) {
          updatedPatient((prevPatients) =>
            prevPatients.map((pt) =>
              pt.hn === patient.hn ? { ...pt, ...processedUpdatePt } : pt
            )
          );
        }
        setComplexity(updatePt.complexity);

        setShowPatientUpdateForm(false);
      }
    } catch (error) {
      setError("Error updating patient data: " + error.message);
    }
  };

  const [complexity, setComplexity] = useState(patient.complexity);

  const updateComplexity = (updatedPatient) => {
    setUpdatePt((prevUpdatePt) => ({
      ...prevUpdatePt,
      complexity: updatedPatient.complexity,
    }));

    updatedPatient((prevPatients) =>
      prevPatients.map((pt) =>
        pt.hn === updatedPatient.hn
          ? { ...pt, complexity: updatedPatient.complexity }
          : pt
      )
    );
  };

  const updateStatus = (updatedPatientStatus) => {
    setUpdatePt((prevUpdatePt) => ({
      ...prevUpdatePt,
      status: updatedPatientStatus.status,
      planApprovalBy: updatedPatientStatus.planApprovalBy,
      planApprovedDate: updatedPatientStatus.planApprovedDate,
      completedTxApprovalBy: updatedPatientStatus.completedTxApprovalBy,
      completedDate: updatedPatientStatus.completedDate,
    }));

    updatedPatient(updatedPatientStatus);
  };

  useEffect(() => {
    setComplexity(updatePt.complexity);
  }, [updatePt]);

  const updateTreatment = (updatedTreatment) => {
    setTxPlan((prevTxPlan) =>
      prevTxPlan.map((tx) =>
        tx.id === updatedTreatment.id ? { ...tx, ...updatedTreatment } : tx
      )
    );
  };

  const updateNewTreatment = (updatedNewTreatment) => {
    setTxPlan((prevTxPlan) => [...prevTxPlan, updatedNewTreatment]);
  };

  const [studentsInTeam, setStudentsInTeam] = useState([]);

  useEffect(() => {
    const fetchStudentsInTeam = async () => {
      try {
        if (userEmail) {
          const result = await getStudentByTeamleaderEmail(userEmail);
          if (result.error) {
            setError(result.error);
          } else {
            setStudentsInTeam(result);
          }
        }
      } catch (error) {
        setError("Error fetching students: " + error.message);
      }
    };
    fetchStudentsInTeam();
  }, [userEmail]);

  const getInstructorName = (email) => {
    if (!email) {
      return "-";
    } else {
      const instructor = instructors.find(
        (instructor) => instructor.instructorEmail === email
      );
      return instructor ? instructor.instructorName : email;
    }
  };

  const getStudentName = (email) => {
    if (!email) {
      return "-";
    } else {
      const student = students.find(
        (student) => student.studentEmail === email
      );
      return student ? student.studentName : email;
    }
  };

  const [txtypes, setTxtypes] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchTxtypes = async () => {
      try {
        if (selectedDivision) {
          const result = await getTxtypesByDivision(selectedDivision);
          if (result.error) {
            setError(result.error);
          } else {
            setTxtypes(result.data);
          }
        }
      } catch (error) {
        setError("Error fetching txtypes: " + error.message);
      }
    };
    fetchTxtypes();
  }, [selectedDivision]);

  const handleClosePatientUpdateForm = () => {
    setShowPatientUpdateForm(false);
  };

  const handleDescriptionChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);
    setNewTxPlan((prevTxPlan) => ({
      ...prevTxPlan,
      description: selectedOption,
    }));
  };

  return (
    <Modal show={show} onHide={handleClose} className={theme} fullscreen={true}>
      <Modal.Header closeButton className={theme}>
        <Modal.Title>Patient Data</Modal.Title>
      </Modal.Header>
      <Modal.Body className={theme}>
        {loadingTxPlan ? (
          <FadeIn>
            <Container>
              <Row className="d-flex justify-content-center">
                <Lottie options={defaultOptions} height={140} width={140} />
              </Row>
            </Container>
          </FadeIn>
        ) : error ? (
          <div className="d-flex justify-content-center">
            <Alert variant="danger" className={alertClass}>
              {error}
            </Alert>
          </div>
        ) : (
          <>
            <Container
              fluid="md"
              className={`status-by-div-container ${theme}`}
            >
              <ListGroup>
                <ListGroup.Item
                  key={patient.hn}
                  className={`myDiv ${
                    theme === "dark" ? "bg-dark text-white" : ""
                  }`}
                >
                  <Row className="mb-3">
                    <Col>
                      <strong>
                        {patient.hn} {patient.name}
                      </strong>
                      <br />
                      <p>
                        {role === "ptBank" ? (
                          "Patient"
                        ) : (
                          <ButtonUpdatePatientProfile
                            handlePatientUpdate={handlePatientUpdate} // Pass the function as a prop
                            patient={patient} // Pass the patient object as a prop
                          />
                        )}
                      </p>
                      <strong>{convertStatus(updatePt.status)}</strong>
                      <br />
                      <p>Status</p>
                    </Col>
                    <Col>
                      <strong>
                        {getInstructorName(updatePt.teamleaderEmail)}
                      </strong>
                      <br />
                      <p>Team Leader</p>
                      <strong>
                        {complexity === "0" && role === "student" ? (
                          <UpdateComplexity
                            patient={patient}
                            updateComplexity={updateComplexity}
                          />
                        ) : (
                          complexity
                        )}
                      </strong>
                      <p title={"Contact Team Leader to update complexity"}>
                        Complexity
                      </p>
                    </Col>
                    <Col>
                      <strong>{getStudentName(updatePt.studentEmail)}</strong>
                      <br />
                      <p>Main Operator</p>
                      <strong>{formatDate(updatePt.acceptedDate)}</strong>
                      <br />
                      <p>Accepted Date</p>
                    </Col>
                    <Col>
                      <strong>
                        {(updatePt.planApprovalBy === "" ||
                          updatePt.planApprovalBy === null) &&
                        updatePt.status === (role === "student" ? "0" : "1") ? (
                          <ButtonTreatmentPlanApproval
                            patient={patient}
                            updateStatus={updateStatus}
                          />
                        ) : (
                          getInstructorName(updatePt.planApprovalBy)
                        )}
                      </strong>
                      <br />
                      <p>Tx Plan Approval</p>
                      <strong>{formatDate(updatePt.planApprovedDate)}</strong>
                      <br />
                      <p>Approval Date</p>
                    </Col>
                    <Col>
                      <strong>
                        {(updatePt.completedTxApprovalBy === "" ||
                          updatePt.completedTxApprovalBy === null) &&
                        updatePt.status === (role === "student" ? "2" : "3") ? (
                          <ButtonCompletedTxApproval
                            patient={patient}
                            updateStatus={updateStatus}
                          />
                        ) : (
                          getInstructorName(updatePt.completedTxApprovalBy)
                        )}
                      </strong>
                      <br />
                      <p>Complete case Approval</p>
                      <strong>{formatDate(updatePt.completedDate)}</strong>
                      <br />
                      <p>Completed Date</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col></Col>
                    <Col>
                      <strong>{age}</strong>
                      <br />
                      <p>Age </p>
                    </Col>
                    <Col>
                      <strong>{updatePt.emergencyContact}</strong>
                      <br />
                      <p>Emergency Contact </p>
                    </Col>
                    <Col>
                      <strong>{updatePt.emergencyTel}</strong>
                      <br />
                      <p>Emergency Tel </p>
                    </Col>
                    <Col>
                      <strong>{updatePt.relationship}</strong>
                      <br />
                      <p>Relationship </p>
                    </Col>
                  </Row>
                  <Row>
                    <h5>Important note:</h5> <br />
                    <p> {updatePt.note}</p>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Container>

            {showPatientUpdateForm && (
              <Container>
                <Form
                  onSubmit={handlePatientUpdateFormSubmit}
                  className={`mt-4 ${containerClass}`}
                >
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Tel:
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="tel"
                        value={updatePt.tel}
                        onChange={handleUpdatePtFormChange}
                        required
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Birth Date
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="date"
                        name="birthDate"
                        value={updatePt.birthDate}
                        onChange={handleUpdatePtFormChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Emergency Contact
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="emergencyContact"
                        value={updatePt.emergencyContact}
                        onChange={handleUpdatePtFormChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Emergency Tel
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="emergencyTel"
                        value={updatePt.emergencyTel}
                        onChange={handleUpdatePtFormChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Relationship
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="relationship"
                        value={updatePt.relationship}
                        onChange={handleUpdatePtFormChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    hidden={role === "student"} // Hide if role is "student"
                  >
                    <Form.Label column md={3}>
                      Complexity
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="number"
                        name="complexity"
                        value={updatePt.complexity}
                        onChange={handleUpdatePtFormChange}
                        required
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Note
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="note"
                        value={updatePt.note}
                        onChange={handleUpdatePtFormChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Team Leader
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        as="select"
                        name="teamleaderEmail"
                        value={selectedTeamleader}
                        onChange={handleTeamleaderChange}
                        required
                        disabled={role === "student"} // Disable if role is "student"
                      >
                        <option value="" disabled>
                          Select Team Leader
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

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Main Operator
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        as="select"
                        name="studentEmail"
                        value={selectedStudent}
                        onChange={handleStudentChange}
                        {...(role === "student" ? { disabled: true } : {})} // Disable if role is "student"
                      >
                        <option value="" disabled>
                          Select Main Operator to Assign {role}
                        </option>
                        {studentsInTeam.map((student) => (
                          <option
                            key={student.studentId}
                            value={student.studentEmail}
                          >
                            {student.studentName}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Patient Status
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        as="select"
                        name="status"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        {...(role === "student" ? { disabled: true } : {})} // Disable if role is "student"
                      >
                        <option value="" disabled>
                          Select Patient Status
                        </option>
                        {patientStatuses.map((status) => (
                          <option key={status.statusId} value={status.status}>
                            {status.status}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Col md={4}></Col>
                    <Col md={4}>
                      <Button variant="dark" type="submit">
                        Save Patient Update
                      </Button>
                    </Col>
                    <Col md={4}>
                      <Button
                        variant="outline-dark"
                        onClick={handleClosePatientUpdateForm}
                      >
                        Close Patient Update Form
                      </Button>
                    </Col>
                  </Form.Group>
                </Form>
              </Container>
            )}

            <br />
            <Container
              fluid="md"
              className={`status-by-div-container ${theme}`}
            >
              {/*******************************************************************************/}
              {/* <TxPlanCard
                treatments={txPlan}
                updateTreatment={updateTreatment}
                updateNewTreatment={updateNewTreatment}
              /> */}
              {/*******************************************************************************/}

              {showAddForm && (
                <Form
                  onSubmit={handleFormSubmit}
                  className={`mt-4 ${containerClass}`}
                >
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      HN
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="hn"
                        value={patient.hn}
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Patient Name:
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="patientName"
                        value={newTxPlan.patientName}
                        onChange={handleFormChange}
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Treatment No.
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="txid"
                        value={newTxPlan.txid}
                        readOnly
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Phase
                    </Form.Label>
                    <Col md={9}>
                      <Form.Select
                        name="phase"
                        value={newTxPlan.phase}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">Select Phase</option>
                        <option value="Systemic">Systemic</option>
                        <option value="Acute">Acute</option>
                        <option value="Disease control">Disease control</option>
                        <option value="Definitive">Definitive</option>
                        <option value="Maintenance">Maintenance</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Area
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="area"
                        value={newTxPlan.area}
                        onChange={handleFormChange}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Select Division
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        as="select"
                        value={selectedDivision}
                        onChange={handleDivisionChange}
                      >
                        <option value="" disabled>
                          Select Division
                        </option>
                        {divisions.map((division) => (
                          <option key={division.id} value={division.shortName}>
                            {division.fullName}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Description
                    </Form.Label>
                    <Col md={9}>
                      <Form.Group
                        controlId="Form.SelectCustom"
                        className="mb-3"
                      >
                        <Form.Select
                          name="description"
                          value={selectedOption}
                          onChange={handleDescriptionChange}
                        >
                          <option value="" disabled>
                            Select Type of Work
                          </option>
                          {txtypes.map((option) => (
                            <option key={option.id} value={option.treatment}>
                              {option.treatment}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column md={3}>
                      Note
                    </Form.Label>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        name="note"
                        value={newTxPlan.note}
                        onChange={handleFormChange}
                      />
                    </Col>
                  </Form.Group>

                  <Button variant="dark" type="submit">
                    Save Treatment Plan
                  </Button>
                </Form>
              )}
              <br />
              <ListGroup>
                <ListGroup.Item
                  key="add-tx-plan"
                  onClick={handleAddTreatmentPlan}
                  className={`myDiv ${
                    theme === "dark" ? "bg-dark text-white" : ""
                  }`}
                  hidden //{role === "ptBank"} // Hide if role is "ptBank"
                >
                  <Row className="text-center">
                    <Col>
                      <strong>
                        {showAddForm ? "Close Form" : "Add Treatment Plan"}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Container>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className={theme}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalTxPlan;
