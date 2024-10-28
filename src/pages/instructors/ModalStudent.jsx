import React, { useEffect, useState, useContext } from "react";
import {
  Modal,
  Button,
  Dropdown,
  DropdownButton,
  Container,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import {
  getReqByDivision,
  getAllDivisions,
} from "../../features/apiCalls";
import SumByDivAndStudentEmail from "../Reports/SumByDivAndStudentEmail";
import CompByStudentEmail from "../Reports/CompByStudentEmail";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import ChartReports from "../Reports/ChartReports";

function ModalStudent({ show, handleClose, student }) {
  const { theme } = useContext(ThemeContext);
  const [req, setReq] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDivisionName, setSelectedDivisionName] = useState("Select Division");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add this state for toggling ChartReports visibility
  const [showChartReports, setShowChartReports] = useState(true);

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

  const handleSelectDivision = (division) => {
    setSelectedDivision(division);
    setSelectedDivisionName(
      division === "completeCases"
        ? "Complete Cases"
        : divisions.find((div) => div.shortName === division)?.fullName ||
            "All Divisions"
    );
  };

  const renderDivisionComponent = () => {
    if (!selectedDivision) {
      return null;
    }
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

  const modalClass = theme === "dark" ? "modal-dark" : "";
  const modalHeaderFooterClass = theme === "dark" ? "modal-header-dark modal-footer-dark" : "";
  const dropdownClass = theme === "dark" ? "dropdown-dark" : "";
  const badgeClass = theme === "dark" ? "badge-dark" : "";

  return (
    <Modal show={show} onHide={handleClose} fullscreen={true} className={modalClass}>
      <Modal.Header closeButton className={modalHeaderFooterClass}>
        <Modal.Title className="text-center">
          {student ? `${student.studentId} ${student.title} ${student.studentName}` : "Student Details"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={modalClass}>
        <Container fluid>
          <Row className="justify-content-center">
            <Col>
              {student ? (
                <div className="d-flex justify-content-center">
                  <p>
                    Year:
                    <strong>{calculateStudentYear(student.startClinicYear)}th</strong>{" "}
                    {"   "}
                    Bay:
                    <strong>
                      M{student.floor}
                      {student.bay}
                      {student.unitNumber}
                    </strong>{" "}
                    <Badge
                      bg={student.status === "Complete" ? "success" : "danger"}
                      className={badgeClass}
                    >
                      {student.status === "Complete" ? "Complete" : "Incomplete"}
                    </Badge>
                  </p>
                </div>
              ) : (
                <p>No student selected</p>
              )}
            </Col>
          </Row>

          {/* Toggle Button */}
          <Row className="d-flex justify-content-center mb-3">
            <Button
              variant={theme === 'dark' ? 'secondary' : 'dark'}
              onClick={() => setShowChartReports((prev) => !prev)}
            >
              {showChartReports ? 'Hide Charts' : 'Show Overall Requirement Charts'}
            </Button>
          </Row>

          {/* Conditionally Render ChartReports */}
          {showChartReports && student?.studentEmail && (
            <ChartReports studentEmail={student.studentEmail} />
          )}

          {/* Rest of your component rendering */}
          <Row className="d-flex justify-content-center">
            <Col>
              <div className="d-flex justify-content-center">
                <DropdownButton
                  id="dropdown-basic-button"
                  title={selectedDivisionName}
                  onSelect={handleSelectDivision}
                  variant={theme === 'dark' ? "secondary" : "dark"}
                >
                  <Dropdown.Item eventKey="all">All Divisions</Dropdown.Item>
                  <Dropdown.Item eventKey="completeCases">Complete Cases</Dropdown.Item>
                  {divisions.map((division) => (
                    <Dropdown.Item key={division.id} eventKey={division.shortName}>
                      {division.fullName}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>
            </Col>
          </Row>
          <br />
          {!selectedDivision && (
            <Row className="d-flex justify-content-center mb-3">
              <Col xs={12} className="text-center">
                <h5>Select division to display requirement by items</h5>
              </Col>
            </Row>
          )}
          <Row className="d-flex justify-content-center">
            <div className="d-flex justify-content-center">
              {renderDivisionComponent()}
            </div>
          </Row>
          <br />
        </Container>
      </Modal.Body>
      <Modal.Footer className={modalHeaderFooterClass}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalStudent;
