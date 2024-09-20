import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { Container, Row, Col, ListGroup, Alert, Button } from "react-bootstrap";
import ModalTreatmentUpdate from "./ModalTreatmentUpdate";
import { ThemeContext } from "../ThemeContext";
import "../App.css";
import ButtonTreatmentApproval from "./ButtonTreatmentApproval";
import { getAllInstructors, getPatientByHn } from "../features/apiCalls";

// Convert MySQL date string to JavaScript Date object and format it as DD/MM/YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};


function TxPlanCard({ treatments = [], updateTreatment, updateNewTreatment }) {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email;
  const [role, setRole] = useState("");
  useEffect(() => {
    const savedRole = JSON.parse(localStorage.getItem("role"));
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const [showAll, setShowAll] = useState(true);

  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const phaseOrder = [
    "Systemic",
    "Acute",
    "Disease control",
    "Definitive",
    "Maintenance",
  ];

  const filteredTreatments = showAll
    ? treatments
    : treatments.filter((treatment) => treatment.status !== -1);

  const sortedTreatments = filteredTreatments.sort((a, b) => {
    const phaseAIndex = phaseOrder.indexOf(a.phase);
    const phaseBIndex = phaseOrder.indexOf(b.phase);

    if (phaseAIndex !== phaseBIndex) {
      return phaseAIndex - phaseBIndex;
    }

    return a.txid - b.txid;
  });

  const displayedPhases = new Set();

  const handleUpdateTreatment = (treatment) => {
    setSelectedTreatment(treatment);
    setShowModal(true);
  };

  const handleTreatmentUpdate = (updatedTreatment) => {
    updateTreatment(updatedTreatment);
    setShowModal(false);
  };

  const handleNewTreatmentUpdate = (updatedNewTreatment) => {
    updateNewTreatment(updatedNewTreatment);
    setShowModal(false);
  };

  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    getAllInstructors().then((data) => {
      setInstructors(data);
    });
  }, []);

  const getInstructorName = (email) => {
    const instructor = instructors.find(
      (instructor) => instructor.instructorEmail === email
    );
    return instructor ? instructor.instructorName : email;
  };

  const [patient, setPatient] = useState({});

  useEffect(() => {
    const fetchPatient = async () => {
      if (treatments[0] && treatments[0].hn) {
        const response = await getPatientByHn(treatments[0].hn);
        setPatient(response[0]);
      }
    };

    fetchPatient();
  }, [treatments[0]?.hn]);


  // Check if patient status is -1
  const isPatientDisabled = patient.status === -1;
  //console.log("isPatientDisabled", isPatientDisabled);

  return (
    <>
      <Container fluid="md" className={`status-by-div-container ${theme}`}>
        <Row className="text-center">
          <Col md={2}>
            <strong>Phase</strong>
          </Col>
          <Col md={1}>
            <strong>No</strong>
          </Col>
          <Col md={1}>
            <strong>Area</strong>
          </Col>
          <Col
            md={3}
            onClick={() => setShowAll((prevShowAll) => !prevShowAll)}
            className={`myDiv ${theme === "dark" ? "bg-dark text-white" : ""}`}
          >
            <strong>Description</strong>
          </Col>
          <Col md={1}>
            <strong>Start</strong>
          </Col>
          <Col md={2}>
            <strong>Completed</strong>
          </Col>
          <Col md={2}>
            <strong>Authorized by</strong>
          </Col>
        </Row>
        <ListGroup>
          {sortedTreatments.length > 0 ? (
            sortedTreatments.map((treatment) => {
              const isPhaseDisplayed = displayedPhases.has(treatment.phase);
              if (!isPhaseDisplayed && treatment.status !== -1) {
                displayedPhases.add(treatment.phase);
              }

              const isStrikeThrough = treatment.status === -1;
              const isClickable = role === "student" && (!isStrikeThrough && !isPatientDisabled);

              return (
                <ListGroup.Item
                  key={treatment.id}
                  onClick={
                    isClickable
                      ? () => handleUpdateTreatment(treatment)
                      : undefined
                  }
                  className={`myDiv ${
                    theme === "dark" ? "bg-dark text-white" : ""
                  }`}
                  style={
                    isStrikeThrough
                      ? { textDecoration: "line-through", opacity: 0.5 }
                      : {}
                  }
                >
                  <Row>
                    <Col
                      md={2}
                      style={isStrikeThrough ? { textDecoration: "none" } : {}}
                    >
                      {!isPhaseDisplayed ? treatment.phase : ""}
                    </Col>
                    <Col className="text-center" md={1}>
                      {treatment.txid}
                    </Col>
                    <Col className="text-center" md={1}>
                      {treatment.area}
                    </Col>
                    <Col md={3}>{treatment.description}</Col>
                    <Col className="text-center" md={1}>
                      {formatDate(treatment.startDate)}
                    </Col>
                    <Col className="text-center" md={2}>
                      {formatDate(treatment.completeDate)}
                    </Col>

                    <Col className="text-center" md={2}>
                      {treatment.status === 2 ? (
                        getInstructorName(treatment.approvedInstructor)
                      ) : treatment.status === 1 ? (
                        role === "student" ? (
                          "Pending Approval"
                        ) : role === "instructor" &&
                          treatment.approvedInstructor === userEmail ? (
                          <ButtonTreatmentApproval
                            treatment={treatment}
                            updateTreatment={handleTreatmentUpdate}
                          />
                        ) : (
                          "-"
                        )
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })
          ) : (
            <div className="d-flex justify-content-center">
              <Alert variant="danger" className={alertClass}>
                {"No treatments found"}
              </Alert>
            </div>
          )}
        </ListGroup>
      </Container>
      {selectedTreatment && (
        <ModalTreatmentUpdate
          show={showModal}
          handleClose={handleClose}
          treatment={selectedTreatment}
          onUpdate={handleTreatmentUpdate}
          onUpdateNewTx={handleNewTreatmentUpdate}
        />
      )}
    </>
  );
}

TxPlanCard.propTypes = {
  treatments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      phase: PropTypes.string.isRequired,
      txid: PropTypes.number.isRequired,
      area: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      startDate: PropTypes.string,
      completeDate: PropTypes.string,
      approvedInstructor: PropTypes.string,
      status: PropTypes.number,
    })
  ).isRequired,
  updateTreatment: PropTypes.func.isRequired,
  updateNewTreatment: PropTypes.func.isRequired,
};

export default TxPlanCard;