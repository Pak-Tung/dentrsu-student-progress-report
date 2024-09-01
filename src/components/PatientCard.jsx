import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Badge,
  Alert,
} from "react-bootstrap";
import ModalTxPlan from "./ModalTxPlan";
import "../App.css";
import { getAllStudents, getTxPlanByPatientHn } from "../features/apiCalls";
import { ThemeContext } from "../ThemeContext";
import { formatDate } from "../utilities/dateUtils";


function PatientCard({ patients = [], updatePatients }) {
  const { theme } = useContext(ThemeContext);
  const [role, setRole] = useState("");
  const [txPlans, setTxPlans] = useState({}); // State to store TxPlans

  useEffect(() => {
    const savedRole = JSON.parse(localStorage.getItem("role"));
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [selectedPatientStatus, setSelectedPatientStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null);

  const [students, setStudents] = useState([]);
  const [newPatients, setNewPatients] = useState([]);

  useEffect(() => {
    setNewPatients(patients);
  }, [patients]);

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

  useEffect(() => {
    fetchStudents();
  }, [patients]);

  const getStudentName = (email) => {
    const student = students.find((student) => student.studentEmail === email);
    return student ? student.studentName : email;
  };

  const handlePatientUpdate = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  // Fetch TxPlan for all patients when the component mounts
  useEffect(() => {
    const fetchAllTxPlans = async () => {
      const txPlanData = {};
      for (const patient of patients) {
        try {
          const result = await getTxPlanByPatientHn(patient.hn);
          if (!result.error) {
            txPlanData[patient.hn] = result;
          }
        } catch (error) {
          console.error("Error fetching tx plan data for patient HN:", patient.hn, error.message);
        }
      }
      setTxPlans(txPlanData);
    };

    if (patients.length > 0) {
      fetchAllTxPlans();
    }
  }, [patients]);

  const hasTxPlanStatusOne = (txPlan) => {
    if (!Array.isArray(txPlan)) return false;
    return txPlan.some(row => row.status === 1);
  };

  return (
    <>
      <Container fluid="md" className={`status-by-div-container ${theme}`}>
        <Row className="text-center">
          <Col md={3}></Col>
          <Col md={2}>
            <strong>Accepted Date</strong> <br />
          </Col>
          <Col md={2}>
            <strong>TxPlan Approved Date</strong>
            <br />
          </Col>
          <Col md={2}>
            <strong>Completed Date</strong>
            <br />
          </Col>
          <Col md={1}> 
            <strong>Complexity</strong>
            <br />
          </Col>
          <Col md={2}>
            <strong>{role === 'student' ? 'Note' : 'Operator'}</strong>
            <br />
          </Col>
        </Row>

        {error && (
          <div className="d-flex justify-content-center">
            <Alert variant="danger" className={alertClass}>
              {error}
            </Alert>
          </div>
        )}

        <ListGroup>
          {newPatients.length > 0 ? (
            newPatients
              .filter(
                (patient) =>
                  selectedPatientStatus === null ||
                  patient.status === selectedPatientStatus
              )
              .map((patient) => {
                const txPlan = txPlans[patient.hn];

                return (
                  <ListGroup.Item
                    key={patient.hn}
                    onClick={() => handlePatientUpdate(patient)}
                    className={`myDiv ${theme === "dark" ? "bg-dark text-white" : ""}`}
                  >
                    <Badge
                      bg={
                        patient.status === 4
                          ? "success"
                          : patient.status === -1
                          ? "danger"
                          : "warning"
                      }
                      pill
                    >
                      {patient.status === 4
                        ? "COMPLETED"
                        : patient.status === -1
                        ? "DISCHARGED"
                        : patient.status === 1
                        ? "REQUEST TX PLAN APPROVAL"
                        : txPlan && hasTxPlanStatusOne(txPlan)
                        ? "REQUEST TX APPROVAL"
                        : patient.status === 3
                        ? "REQUEST COMPLETE CASE APPROVAL"
                        : "INCOMPLETE"}
                    </Badge>
                    <Row>
                      <Col sm={3}>
                        {patient.hn} {patient.name}
                        <br />
                        Tel: {patient.tel}
                        <br />
                      </Col>
                      <Col className="text-center" md={2}>
                        {formatDate(patient.acceptedDate)} <br />
                      </Col>
                      <Col className="text-center" md={2}>
                        {formatDate(patient.planApprovedDate)}
                        <br />
                      </Col>
                      <Col className="text-center" md={2}>
                        {formatDate(patient.completedDate)}
                        <br />
                      </Col>
                      <Col className="text-center" md={1}>
                        {patient.complexity}
                        <br />
                      </Col>
                      <Col className="text-center" md={2}>
                        {role === 'student' ? patient.note : getStudentName(patient.studentEmail)}
                        <br />
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })
          ) : (
            <div className="d-flex justify-content-center">
              <Alert variant="danger" className={alertClass}>
                {"No patient data found"}
              </Alert>
            </div>
          )}
        </ListGroup>
      </Container>
      {selectedPatient && (
        <ModalTxPlan
          show={showModal}
          handleClose={handleClose}
          patient={selectedPatient}
          updatePatients={updatePatients} // Pass the update function
        />
      )}
    </>
  );
}

// PatientCard.propTypes = {
//   patients: PropTypes.arrayOf(
//     PropTypes.shape({
//       hn: PropTypes.number,
//       name: PropTypes.string.isRequired,
//       tel: PropTypes.string,
//       acceptedDate: PropTypes.string,
//       planApprovedDate: PropTypes.string,
//       completedDate: PropTypes.string,
//       complexity: PropTypes.number,
//       status: PropTypes.number,
//       note: PropTypes.string,
//       studentEmail: PropTypes.string,
//     })
//   ),
//   updatePatients: PropTypes.func.isRequired,
// };

export default PatientCard;
