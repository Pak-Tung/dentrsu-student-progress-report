import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import NavbarInstructor from "../../components/NavbarInstructor";
import {
  getAllStudents,
  getTreatmentsByApprovedInstructorEmail,
  updateTreatmentStatusById,
} from "../../features/apiCalls";
import { Container, Row, Col, ListGroup, Alert, Button } from "react-bootstrap";

import { ThemeContext } from "../../ThemeContext";
import "../../App.css";
import { formatDateFormISO } from "../../utilities/dateUtils";

function TreatmentApproval() {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email;
  const [role, setRole] = useState("");
  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedRole = JSON.parse(localStorage.getItem("role"));
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const result = await getTreatmentsByApprovedInstructorEmail(userEmail);
        if (result.error) {
          console.error(result.error);
        } else {
          setTreatments(result);
        }
      } catch (error) {
        console.error("Error fetching treatments: " + error.message);
      }
    };
    fetchTreatments();
  }, [userEmail]);

  const [students, setStudents] = useState([]);

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
  }, [treatments]);

  const getStudentName = (email) => {
    const student = students.find((student) => student.studentEmail === email);
    return student ? student.studentName : email;
  };

  const handleTreatmentApproval = async (treatment) => {
    console.log("Treatment approved: ", treatment);
    treatment.status = 2; // Set treatment status to 'approved'
    const isConfirmed = window.confirm(
      "Are you sure you want to approve this treatment?"
    );
    if (!isConfirmed) return;

    try {
      const result = await updateTreatmentStatusById(treatment.id, treatment);
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        const updatedTreatments = treatments.map((tx) => {
          if (tx.id === treatment.id) {
            return { ...tx, status: 2 }; // Update the status of the approved treatment
          }
          return tx;
        });
        setTreatments(updatedTreatments);
      }
    } catch (error) {
      alert(`An unexpected error occurred: ${error.message}`);
    }
  };

  return (
    <>
      <NavbarInstructor />
      <div className="text-center">
        <h1>Treatment Approval</h1>
      </div>
      <Container fluid="md" className={`status-by-div-container ${theme}`}>
        <Row className="text-center">
          <Col xs={2}>
            <strong>Patient</strong>
          </Col>
          <Col xs={1}>
            <strong>Area</strong>
          </Col>
          <Col xs={4}>
            <strong>Description</strong>
          </Col>
          <Col xs={1}>
            <strong>Start</strong>
          </Col>
          <Col xs={1}>
            <strong>Completed</strong>
          </Col>
          <Col xs={2} className="text-center">
            <strong>Operator</strong>
          </Col>
          <Col xs={1} className="text-center"></Col>
        </Row>

        <ListGroup>
          {treatments.length > 0 ? (
            treatments
              .filter((treatment) => treatment.status === 1) // Filter treatments awaiting approval
              .map((treatment) => {
                return (
                  <ListGroup.Item key={treatment.id}>
                    <Row>
                      <Col xs={2}>
                        {treatment.hn}{" "}{treatment.patientName}
                    </Col>
                      <Col className="text-center" xs={1}>
                        {treatment.area} <br />
                      </Col>
                      <Col xs={4}>
                        {treatment.description}
                        <br />
                      </Col>
                      <Col className="text-center" xs={1}>
                        {formatDateFormISO(treatment.startDate)}
                        <br />
                      </Col>
                      <Col className="text-center" xs={1}>
                        {formatDateFormISO(treatment.completeDate)}
                      </Col>
                      <Col className="text-center" xs={2}>
                        {getStudentName(treatment.operatorEmail)}
                        <br />
                      </Col>
                      <Col className="text-center" xs={1}>
                        {role !== "student" && (
                          <button
                            onClick={() => handleTreatmentApproval(treatment)}
                            style={{
                              marginBottom: 0,
                              marginTop: 0,
                              paddingBottom: 0,
                              paddingTop: 0,
                              paddingLeft: 15,
                              paddingRight: 15,
                              backgroundColor: "green",
                              color: "white",
                              borderRadius: 5,
                              border: "none",
                            }}
                          >
                            Approve
                          </button>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })
          ) : (
            <div className="d-flex justify-content-center">
              <Alert variant="danger" className={alertClass}>
                {"No Requests found"}
              </Alert>
            </div>
          )}
        </ListGroup>
      </Container>
    </>
  );
}

export default TreatmentApproval;