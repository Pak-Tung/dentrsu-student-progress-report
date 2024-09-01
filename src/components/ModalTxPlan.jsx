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
} from "../features/apiCalls";
import TxPlanCard from "./TxPlanCard";
import "../App.css";
import {
  getInstructorsByTeamleaderRole,
  getAllStudents,
  updatePatientbyhn,
  getStudentByTeamleaderEmail,
  getTxtypesByDivision,
} from "../features/apiCalls";
import UpdateComplexity from "./UpdateComplexity";
import ButtonTreatmentPlanApproval from "./ButtonTreatmentPlanApproval";
import ButtonCompletedTxApproval from "./ButtonCompletedTxApproval";
import ButtonUpdatePatientProfile from "./ButtonUpdatePatientProfile";
import { formatDateFormISO, formatDate } from "../utilities/dateUtils";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function ModalTxPlan({ show, handleClose, patient, updatePatients }) {
  const { theme } = useContext(ThemeContext);
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = JSON.parse(localStorage.getItem("role"));
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email;

  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [txPlan, setTxPlan] = useState([]);
  const [nextTxId, setNextTxId] = useState(0);
  const [loadingTxPlan, setLoadingTxPlan] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPatientUpdateForm, setShowPatientUpdateForm] = useState(false);
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
  });
  const [updatePt, setUpdatePt] = useState({
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

  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");

  useEffect(() => {
    if (patient.hn) {
      const fetchTxPlanData = async () => {
        setLoadingTxPlan(true);
        try {
          const result = await getTxPlanByPatientHn(patient.hn);
          if (result.error) {
            setError(result.error);
          } else {
            //console.log(result);
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
      hn: patient.hn,
      patientName: patient.name,
    }));
  }, [nextTxId, patient.hn, patient.name]);

  useEffect(() => {
    setUpdatePt((prevPt) => ({
      ...prevPt,
      tel: patient.tel,
      teamleaderEmail: patient.teamleaderEmail,
      studentEmail: patient.studentEmail,
      complexity: patient.complexity,
      note: patient.note,
      status: patient.status,
      acceptedDate: patient.acceptedDate
        ? patient.acceptedDate.split("T")[0]
        : "",
      planApprovalBy: patient.planApprovalBy,
      planApprovedDate: patient.planApprovedDate
        ? patient.planApprovedDate.split("T")[0]
        : "",
      completedDate: patient.completedDate
        ? patient.completedDate.split("T")[0]
        : "",
      completedTxApprovalBy: patient.completedTxApprovalBy,
    }));

    setSelectedTeamleader(patient.teamleaderEmail);
    setSelectedStudent(patient.studentEmail);
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
    setShowAddForm((prev) => !prev);
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
    setUpdatePt((prevTxPlan) => ({
      ...prevTxPlan,
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
        setNewTxPlan((prevTxPlan) => ({
          ...prevTxPlan,
          txid: nextTxId + 1,
          phase: "",
          area: "",
          note: "",
          division: "",
        }));
        setSelectedDivision("");
        setSelectedOption("");
      }
    } catch (error) {
      setError("Error saving tx plan data: " + error.message);
    }
  };


  const convertStatus = (status) => {
    switch (status) {
      case -1:
        return "Discharged";
      case 0:
        return "Charting";
      case 1:
        return "Pending Tx Plan Approval";
      case 2:
        return "Tx Plan Approved";
      case 3:
        return "Pending Approval";
      case 4:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const handlePatientUpdate = (patient) => {
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
          //console.log(result);
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
    setUpdatePt((prevTxPlan) => ({
      ...prevTxPlan,
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
          //console.log(result.data.result);
          setStudents(result.data.result);
        }
      } catch (error) {
        setError("Error fetching students: " + error.message);
      }
    };
    fetchStudents();
  }, []);

  const handlePatientUpdateFormSubmit = async (e) => {
    e.preventDefault();

    const processedUpdatePt = {
      ...updatePt,
      acceptedDate: formatDateFormISO(new Date().toISOString()),
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
        // Update patient data in the parent component
        // Update patient data in the parent component
        if (processedUpdatePt) {
          updatePatients((prevPatients) =>
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

    updatePatients((prevPatients) =>
      prevPatients.map((pt) =>
        pt.tel === updatedPatient.tel
          ? { ...pt, complexity: updatedPatient.complexity }
          : pt
      )
    );
  };

  const updateStatus = (updatedPatient) => {
    setUpdatePt((prevUpdatePt) => ({
      ...prevUpdatePt,
      status: updatedPatient.status,
      planApprovalBy: updatedPatient.planApprovalBy,
      planApprovedDate: updatedPatient.planApprovedDate,
      completedTxApprovalBy: updatedPatient.completedTxApprovalBy,
      completedDate: updatedPatient.completedDate,
    }));

    updatePatients((prevPatients) =>
      prevPatients.map((pt) =>
        pt.tel === updatedPatient.tel
          ? {
              ...pt,
              status: updatedPatient.status,
              planApprovalBy: updatedPatient.planApprovalBy,
              planApprovedDate: updatedPatient.planApprovedDate,
              completedTxApprovalBy: updatedPatient.completedTxApprovalBy,
              completedDate: updatedPatient.completedDate,
            }
          : pt
      )
    );
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

  const [studentsInTeam, setStudentsInTeam] = useState({});

  useEffect(() => {
    const fetchStudentsInTeam = async () => {
      try {
        const result = await getStudentByTeamleaderEmail(userEmail);
        if (result.error) {
          setError(result.error);
        } else {
          //console.log(result);
          setStudentsInTeam(result);
        }
      } catch (error) {
        setError("Error fetching students: " + error.message);
      }
    };
    fetchStudentsInTeam();
  }, []);

  const getInstructorName = (email) => {
    const instructor = instructors.find(
      (instructor) => instructor.instructorEmail === email
    );
    return instructor ? instructor.instructorName : email;
  };

  const getStudentName = (email) => {
    const student = students.find((student) => student.studentEmail === email);
    return student ? student.studentName : email;
  };

  const [txtypes, setTxtypes] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchTxtypes = async () => {
      try {
        const result = await getTxtypesByDivision(selectedDivision);
        if (result.error) {
          setError(result.error);
        } else {
          console.log(result.data);
          setTxtypes(result.data);
        }
      } catch (error) {
        setError("Error fetching txtypes: " + error.message);
      }
    };
    if (selectedDivision) {
      fetchTxtypes();
    }
  }, [selectedDivision]);

  return (
    <Modal show={show} onHide={handleClose} className={theme} fullscreen={true}>
      <Modal.Header closeButton className={theme}>
        <Modal.Title>Treatment Plan</Modal.Title>
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
                <ListGroup.Item key={patient.hn}>
                  <Row className="mb-3">
                    <Col>
                      <strong>
                        {patient.hn} {patient.name}
                      </strong>
                      <br />
                      <p>
                        <ButtonUpdatePatientProfile
                          handlePatientUpdate={handlePatientUpdate} // Pass the function as a prop
                          patient={patient} // Pass the patient object as a prop
                        />
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
                        {complexity === 0 ? (
                          <UpdateComplexity
                            patient={patient}
                            updateComplexity={updateComplexity}
                          />
                        ) : (
                          complexity
                        )}
                      </strong>
                      <p
                        title={"Contact Team Leader to update complexity"}
                      >
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
                        updatePt.status === (role === "student" ? 0 : 1) ? (
                          <ButtonTreatmentPlanApproval
                            patient={patient}
                            updateStatus={updateStatus}
                          />
                        ) : (
                          updatePt.planApprovalBy
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
                        updatePt.status === (role === "student" ? 2 : 3) ? (
                          <ButtonCompletedTxApproval
                            patient={patient}
                            updateStatus={updateStatus}
                          />
                        ) : (
                          updatePt.completedTxApprovalBy
                        )}
                      </strong>
                      <br />
                      <p>Complete case Approval</p>
                      <strong>{formatDate(updatePt.completedDate)}</strong>
                      <br />
                      <p>Completed Date</p>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Container>

            {showPatientUpdateForm && (
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
                      <option value="-" disabled>
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
                      required
                      {...(role === "student" ? { disabled: true } : {})} // Disable if role is "student"
                    >
                      <option value="-" disabled>
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

                <Button variant="dark" type="submit">
                  Save Patient Update
                </Button>
              </Form>
            )}

            <br />
            <Container
              fluid="md"
              className={`status-by-div-container ${theme}`}
            >
              <TxPlanCard
                treatments={txPlan}
                updateTreatment={updateTreatment}
                updateNewTreatment={updateNewTreatment}
              />

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
                        required
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
                          onChange={handleFormChange}
                          required
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
