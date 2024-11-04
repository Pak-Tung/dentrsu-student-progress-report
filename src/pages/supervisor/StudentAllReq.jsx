import React, { useState, useEffect, useContext } from "react";
import { getStudentById, getAllDivisions } from "../../features/apiCalls";
import NavbarSupervisor from "./NavbarSupervisor";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import "../../Navbar.css";
import LoadingComponent from "../../components/LoadingComponent";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import SumByDivAndStudentEmail from "../Reports/SumByDivAndStudentEmail";
import ChartReports from "../Reports/ChartReports";
import LoginByEmail from "../../components/LoginByEmail";
import Cookies from "js-cookie";

function StudentAllReq() {
  const { theme } = useContext(ThemeContext);
  const themeClass = theme === "dark" ? "form-control-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const email = Cookies.get("email");
  const [student, setStudent] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDivisionName, setSelectedDivisionName] =
    useState("Select Division");
  const [studentId, setStudentId] = useState("");
  // Add this state for toggling ChartReports visibility
  const [showChartReports, setShowChartReports] = useState(true);

  useEffect(() => {
    const fetchDivisionsData = async () => {
      try {
        const result = await getAllDivisions();
        setDivisions(result);
      } catch (error) {
        console.error("Error fetching divisions: ", error);
        setError("Failed to fetch divisions. Please try again later.");
      }
    };
    fetchDivisionsData();
  }, []);

  const handleSelectDivision = (division) => {
    setSelectedDivision(division);
    const selectedDiv = divisions.find((div) => div.shortName === division);
    setSelectedDivisionName(
      selectedDiv ? selectedDiv.fullName : "All Divisions"
    );
  };

  const handleSearchStudent = async () => {
    if (!studentId) return;
    setLoadingStudent(true);
    setSuccess(false);
    setError(null);
    try {
      const result = await getStudentById(studentId);
      if (result && result.data && result.data.length > 0) {
        setStudent(result.data[0]);
        setSuccess(true);
      } else {
        setError(
          "Student not found. Please check the Student ID and try again."
        );
        setStudent(null);
      }
    } catch (error) {
      console.error("Error fetching student: ", error);
      setError(
        "An error occurred while fetching the student. Please try again later."
      );
      setStudent(null);
    } finally {
      setLoadingStudent(false);
    }
  };

  const renderDivisionComponent = () => {
    if (!selectedDivision) return null;
    const divNames = [
      "oper",
      "endo",
      "perio",
      "prosth",
      "diag",
      "radio",
      "sur",
      "pedo",
      "ortho",
    ];
    if (!student) return null;

    if (selectedDivision === "all") {
      return (
        <Container fluid="md">
          {divNames.map((divName) => (
            <React.Fragment key={divName}>
              <Row className="d-flex justify-content-center">
                <SumByDivAndStudentEmail
                  division={divName}
                  studentEmail={student.studentEmail}
                />
              </Row>
              <br />
            </React.Fragment>
          ))}
        </Container>
      );
    } else {
      return (
        <Container fluid="md">
          <Row className="d-flex justify-content-center">
            <SumByDivAndStudentEmail
              division={selectedDivision}
              studentEmail={student.studentEmail}
            />
          </Row>
        </Container>
      );
    }
  };

  return (
    <>
      {email ? (
        <>
          <NavbarSupervisor />
          <Container fluid="md">
            <Row className="d-flex justify-content-center mt-5">
              <h4>
                Search by Student ID :{" "}
                {success && student
                  ? `${student.studentId} ${student.studentName}`
                  : ""}
              </h4>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className={themeClass}
                />
              </Col>
              <Col md={2} className="mb-3">
                <Button
                  variant={theme === "dark" ? "outline-light" : "outline-dark"}
                  onClick={handleSearchStudent}
                  disabled={!studentId || loadingStudent}
                >
                  {loadingStudent ? "Searching..." : "Search"}
                </Button>
              </Col>
            </Row>
          </Container>

          {loadingStudent ? (
            <LoadingComponent />
          ) : error ? (
            <div className="d-flex justify-content-center">
              <Alert variant="danger" className={alertClass}>
                {error}
              </Alert>
            </div>
          ) : (
            success &&
            student && (
              <Container
                fluid="md"
                className={theme === "dark" ? "container-dark" : ""}
              >
                {/* Toggle Button */}
                <Row className="d-flex justify-content-center mb-3">
                  <Button
                    variant={theme === "dark" ? "secondary" : "dark"}
                    onClick={() => setShowChartReports((prev) => !prev)}
                  >
                    {showChartReports
                      ? "Hide Charts"
                      : "Show Overall Requirement Charts"}
                  </Button>
                </Row>

                {/* Conditionally Render ChartReports */}
                {showChartReports && student?.studentEmail && (
                  <ChartReports studentEmail={student.studentEmail} />
                )}

                {!selectedDivision && (
                  <Row className="d-flex justify-content-center mb-3">
                    <Col xs={12} className="text-center">
                      <h5>Select division to display requirement by items</h5>
                    </Col>
                  </Row>
                )}
                <Row className="d-flex justify-content-center">
                  <Col>
                    <div className="d-flex justify-content-center">
                      <DropdownButton
                        variant={
                          theme === "dark" ? "outline-light" : "outline-dark"
                        }
                        id="dropdown-basic-button"
                        title={selectedDivisionName}
                        onSelect={handleSelectDivision}
                        className={theme === "dark" ? "text-dark-mode" : ""}
                      >
                        <Dropdown.Item eventKey="all">
                          All Divisions
                        </Dropdown.Item>
                        {divisions.map((division) => (
                          <Dropdown.Item
                            key={division.id}
                            eventKey={division.shortName}
                          >
                            {division.fullName}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    </div>
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
            )
          )}
        </>
      ) : (
        <>
          <LoginByEmail />
        </>
      )}
    </>
  );
}

export default StudentAllReq;
