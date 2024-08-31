import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Alert,
  Button,
} from "react-bootstrap";
import ModalTreatmentUpdate from "./ModalTreatmentUpdate";
import { ThemeContext } from "../ThemeContext";
import "../App.css";
import ButtonTreatmentApproval from "./ButtonTreatmentApproval";

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

  const [showAll, setShowAll] = useState(true); // State to toggle between showing all treatments or only active treatments

  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  // Define the order for phases
  const phaseOrder = [
    "Systemic",
    "Acute",
    "Disease control",
    "Definitive",
    "Maintenance",
  ];

  // Filter treatments based on showAll state
  const filteredTreatments = showAll
    ? treatments
    : treatments.filter((treatment) => treatment.status !== -1);

  // Sort treatments by phase order and txid
  const sortedTreatments = filteredTreatments.sort((a, b) => {
    // Sort by phase order
    const phaseAIndex = phaseOrder.indexOf(a.phase);
    const phaseBIndex = phaseOrder.indexOf(b.phase);

    if (phaseAIndex !== phaseBIndex) {
      return phaseAIndex - phaseBIndex;
    }

    // If phases are the same, sort by txid
    return a.txid - b.txid;
  });

  // To keep track of phases that have already been displayed
  const displayedPhases = new Set();

  const handleUpdateTreatment = (treatment) => {
    setSelectedTreatment(treatment);
    setShowModal(true); // Show the update form
  };

  const handleTreatmentUpdate = (updatedTreatment) => {
    updateTreatment(updatedTreatment); // Call the update function passed as prop
    setShowModal(false);
  };

  const handleNewTreatmentUpdate = (updatedNewTreatment) => {
    updateNewTreatment(updatedNewTreatment); // Call the update function passed as prop
    setShowModal(false);
  };

  return (
    <>
      <Container fluid="md" className={`status-by-div-container ${theme}`}>
        {/* <Button
          variant="outline-primary"
          onClick={() => setShowAll((prevShowAll) => !prevShowAll)}
          className="mb-3"
        >
          {showAll ? "Show Active Treatments Only" : "Show All Treatments"}
        </Button> */}

        <Row className="text-center">
          <Col xs={2}>
            <strong>Phase</strong>
          </Col>
          <Col xs={1}>
            <strong>No</strong>
          </Col>
          <Col xs={2}>
            <strong>Area</strong>
          </Col>
          <Col xs={3}
            onClick={() => setShowAll((prevShowAll) => !prevShowAll)}
            className={`myDiv ${
              theme === "dark" ? "bg-dark text-white" : ""
            }`}
          >
            <strong>Description</strong>
          </Col>
          <Col xs={1}>
            <strong>Start</strong>
          </Col>
          <Col xs={1}>
            <strong>Completed</strong>
          </Col>
          <Col xs={2}>
            <strong>Authorized by</strong>
          </Col>
        </Row>
        <ListGroup>
          {sortedTreatments.length > 0 ? (
            sortedTreatments.map((treatment) => {
              const isPhaseDisplayed = displayedPhases.has(treatment.phase);
              if (!isPhaseDisplayed) {
                displayedPhases.add(treatment.phase); // Add phase to the set
              }

              const isStrikeThrough = treatment.status === -1;

              return (
                <ListGroup.Item
                  key={treatment.id}
                  onClick={
                    role === "student"
                      ? () => {
                          if (!isStrikeThrough) {
                            handleUpdateTreatment(treatment);
                          }
                        }
                      : undefined
                  }
                  className={`myDiv ${
                    theme === "dark" ? "bg-dark text-white" : ""
                  }`}
                  style={isStrikeThrough ? { textDecoration: "line-through", opacity: 0.5 } : {}}
                >
                  <Row>
                    <Col xs={2}>{!isPhaseDisplayed ? treatment.phase : ""}</Col>
                    <Col className="text-center" xs={1}>
                      {treatment.txid}
                    </Col>
                    <Col className="text-center" xs={2}>
                      {treatment.area}
                    </Col>
                    <Col xs={3}>{treatment.description}</Col>
                    <Col className="text-center" xs={1}>
                      {formatDate(treatment.startDate)}
                    </Col>
                    <Col className="text-center" xs={1}>
                      {formatDate(treatment.completeDate)}
                    </Col>

                    <Col className="text-center" xs={2}>
                      {treatment.status === 2 ? (
                        treatment.approvedInstructor
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
          onUpdate={handleTreatmentUpdate} // Pass handler to modal
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