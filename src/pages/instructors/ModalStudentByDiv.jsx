import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Container,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { getReqByDivision, getAllDivisions } from "../../features/apiCalls";
import SumByDivAndStudentEmail from "../Reports/SumByDivAndStudentEmail";
import CompByStudentEmail from "../Reports/CompByStudentEmail";

function ModalStudentByDiv({ show, handleClose, student, division }) {
  const [req, setReq] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(division || "all");
  const [selectedDivisionName, setSelectedDivisionName] =
    useState("Select Division");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReqData = async () => {
      try {
        const result = await getReqByDivision(selectedDivision);
        setReq(result);
      } catch (err) {
        setError("Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    if (selectedDivision) {
      fetchReqData();
    }
  }, [selectedDivision]);

  useEffect(() => {
    const fetchDivisionsData = async () => {
      try {
        const result = await getAllDivisions();
        setDivisions(result);
      } catch (err) {
        console.error("Failed to fetch divisions", err);
      }
    };

    fetchDivisionsData();
  }, []);

  useEffect(() => {
    const selectedDiv = divisions.find(
      (div) => div.shortName === selectedDivision
    );
    setSelectedDivisionName(
      selectedDivision === "completeCases"
        ? "Complete Cases"
        : selectedDiv
        ? selectedDiv.fullName
        : "All Divisions"
    );
  }, [selectedDivision, divisions]);


  const renderDivisionComponent = () => {
    const divisionComponents = {
      all: (
        <Container fluid="md">
          {[
            "oper",
            "endo",
            "perio",
            "prosth",
            "diag",
            "radio",
            "sur",
            "pedo",
            "ortho",
          ].map((divName) => (
            <React.Fragment key={divName}>
              <Row className="d-flex justify-content-center">
                {student?.studentEmail && (
                  <SumByDivAndStudentEmail
                    division={divName}
                    studentEmail={student.studentEmail}
                  />
                )}
              </Row>
              <br />
            </React.Fragment>
          ))}
        </Container>
      ),
      completeCases: (
        <Container fluid="md">
          <Row className="d-flex justify-content-center">
            {student?.studentEmail && (
              <CompByStudentEmail studentEmail={student.studentEmail} />
            )}
          </Row>
        </Container>
      ),
    };

    return (
      divisionComponents[selectedDivision] || (
        <Container fluid="md">
          <Row className="d-flex justify-content-center">
            {student?.studentEmail && (
              <SumByDivAndStudentEmail
                division={selectedDivision}
                studentEmail={student.studentEmail}
              />
            )}
          </Row>
        </Container>
      )
    );
  };

  const calculateStudentYear = (startClinicYear) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
    return currentYear - startClinicYear + (currentMonth > 4 ? 5 : 4);
  };

  return (
    <Modal show={show} onHide={handleClose} fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title>
          {student
            ? `${student.studentId} ${student.title} ${student.studentName}`
            : "Student Details"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row className="justify-content-center">
            <Col>
              {student ? (
                <div className="d-flex justify-content-center">
                  <p>
                    Year:
                    <strong>
                      {calculateStudentYear(student.startClinicYear)}th
                    </strong>{" "}
                    {"   "}
                    Bay:
                    <strong>
                      M{student.floor}
                      {student.bay}
                      {student.unitNumber}
                    </strong>
                    {"   "}
                    <Badge
                      bg={student.status === "Complete" ? "success" : "danger"}
                      // pill
                    >
                      {student.status === "Complete"
                        ? "Complete"
                        : "Incomplete"}
                    </Badge>
                  </p>
                </div>
              ) : (
                <p>No student selected</p>
              )}
            </Col>
          </Row>
          <br />
          <Row className="d-flex justify-content-center">
            <div className="d-flex justify-content-center">
              {renderDivisionComponent()}
            </div>
          </Row>
          <br />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalStudentByDiv;
