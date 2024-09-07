import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import NavbarInstructor from "../../components/NavbarInstructor";
import { Container, Row, Col, Alert, Dropdown } from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import LoginByEmail from "../../components/LoginByEmail";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { getPatientsByTeamleaderEmail } from "../../features/apiCalls";
import PatientCard from "../../components/PatientCard";
import { getStudentByTeamleaderEmail } from "../../features/apiCalls";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function AllTeamleaderPatients() {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => {
    const cookieUser = Cookies.get("user");
    return cookieUser ? JSON.parse(cookieUser) : {};
  });

  const userEmail = user.email;
  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterStudent, setFilterStudent] = useState("All");
  const [students, setStudents] = useState([]);

  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userEmail) {
        try {
          const result = await getStudentByTeamleaderEmail(userEmail);
          setLoadingPatients(true);
          if (result.error) {
            setError(result.error);
          } else if (result) {
            setAllStudents(result);
          } else {
            setError("No student data found");
          }
        } catch (error) {
          setError("Error fetching student data:", error);
        } finally {
          setLoadingPatients(false);
        }
      }
    };

    fetchData();
  }, [userEmail]);

  useEffect(() => {
    const fetchData = async () => {
      if (userEmail) {
        try {
          const result = await getPatientsByTeamleaderEmail(userEmail);
          setLoadingPatients(true);
          if (result.error) {
            setError(result.error);
          } else if (result) {
            setPatients(result);
            setFilteredPatients(result); // Set the full list initially

            // Extract unique students
            const uniqueStudents = [
              ...new Set(result.map((patient) => patient.studentEmail)),
            ];
            setStudents(uniqueStudents);
          } else {
            setError("No patient data found");
          }
        } catch (error) {
          setError("Error fetching patient data:", error);
        } finally {
          setLoadingPatients(false);
        }
      }
    };

    fetchData();
  }, [userEmail]);

  const filterByStatus = (status) => {
    setFilterStatus(status);
    applyFilters(filterStudent, status);
  };

  const filterByStudent = (student) => {
    setFilterStudent(student);
    applyFilters(student, filterStatus);
  };

  const getStudentName = (studentEmail) => {
    const student = allStudents.find(
      (student) => student.studentEmail === studentEmail
    );
    return student ? student.studentName : studentEmail;
  };

  const getStatusName = (status) => {
    switch (status) {
      case -1:
        return "Discharged";
      case 0:
        return "Incomplete";
      case 1:
        return "Completed";
      case "All":
        return "All";
      default:
        return "Unknown";
    }
  };

  const applyFilters = (student, status) => {
    let filtered = patients;

    if (status !== "All") {
      filtered = filtered.filter((patient) => patient.status === status);
    }

    if (student !== "All") {
      filtered = filtered.filter((patient) => patient.studentEmail === student);
    }

    setFilteredPatients(filtered);
  };

  const countPatients = (student) => {
    if (student === "All") {
      return patients.length;
    } else {
      return patients.filter((patient) => patient.studentEmail === student)
        .length;
    }
  };

  return (
    <>
      {userEmail ? (
        <>
          <NavbarInstructor />
          <Container className={containerClass}>
            <Row className="justify-content-center">
              <Col md={6} className="text-center">
                <h2>All Patients</h2>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={3} className="text-center">
                <Dropdown className="mb-2">
                  <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                    Status: {getStatusName(filterStatus)}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => filterByStatus("All")}>
                      All
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => filterByStatus(-1)}>
                      Discharged
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => filterByStatus(0)}>
                      Incomplete
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => filterByStatus(1)}>
                      Completed
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col md={3} className="text-center">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                    Student: {getStudentName(filterStudent)} (
                    {countPatients(filterStudent)})
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => filterByStudent("All")}>
                      All ({countPatients("All")})
                    </Dropdown.Item>
                    {students.map((student) => (
                      <Dropdown.Item
                        key={student}
                        onClick={() => filterByStudent(student)}
                      >
                        {getStudentName(student)} ({countPatients(student)})
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Container>
          {loadingPatients ? (
            <FadeIn>
              <div>
                <Container>
                  <Row className="d-flex justify-content-center">
                    <Lottie options={defaultOptions} height={140} width={140} />
                  </Row>
                </Container>
              </div>
            </FadeIn>
          ) : error ? (
            <div className="d-flex justify-content-center">
              <Alert variant="danger" className={alertClass}>
                {error}
              </Alert>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <PatientCard
                patients={filteredPatients} // Display the filtered list
                updatePatients={setPatients}
              />
            </div>
          )}
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default AllTeamleaderPatients;
