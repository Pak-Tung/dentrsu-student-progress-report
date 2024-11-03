import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import NavbarInstructor from "../../components/NavbarInstructor";
import { Container, Row, Col, Alert, Dropdown } from "react-bootstrap";
import LoadingComponent from "../../components/LoadingComponent";
import LoginByEmail from "../../components/LoginByEmail";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { getPatientsByTeamleaderEmail, getStudentByTeamleaderEmail } from "../../features/apiCalls";
import PatientCard from "../../components/PatientCard";

function AllTeamleaderPatients() {
  const { theme } = useContext(ThemeContext);
  const [user] = useState(() => {
    const cookieUser = Cookies.get("user");
    return cookieUser ? JSON.parse(cookieUser) : {};
  });

  const userEmail = user.email;
  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [error, setError] = useState(null);
  const [filterStudent, setFilterStudent] = useState("All");
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const statusOptions = [
    { value: "-1", label: "Discharged" },
    { value: "0", label: "Charting" },
    { value: "1", label: "Pending Treatment Plan Approve" },
    { value: "2", label: "Treatment Plan Approved" },
    { value: "3", label: "Pending Completed Case Approve" },
    { value: "4", label: "Completed Case Approved" },
  ];
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userEmail) {
        try {
          setLoadingPatients(true);
          const result = await getStudentByTeamleaderEmail(userEmail);
          if (result.error) {
            setError(result.error);
            setAllStudents([]);
          } else if (Array.isArray(result)) {
            setAllStudents(result);
          } else {
            setAllStudents([]);
            setError("No student data found");
          }
        } catch (error) {
          setError(`Error fetching student data: ${error.message}`);
          setAllStudents([]);
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
          setLoadingPatients(true);
          const result = await getPatientsByTeamleaderEmail(userEmail);
          if (result.error) {
            setError(result.error);
            setPatients([]);
            setFilteredPatients([]);
          } else if (Array.isArray(result)) {
            setPatients(result);
            setFilteredPatients(result);

            const uniqueStudents = [
              ...new Set(result.map((patient) => patient.studentEmail)),
            ];
            setStudents(uniqueStudents);
          } else {
            setPatients([]);
            setFilteredPatients([]);
            setError("No patient data found");
          }
        } catch (error) {
          setError(`Error fetching patient data: ${error.message}`);
          setPatients([]);
          setFilteredPatients([]);
        } finally {
          setLoadingPatients(false);
        }
      }
    };

    fetchData();
  }, [userEmail]);

  const filterByStudent = (student) => {
    setFilterStudent(student);
    applyFilters(student, selectedStatuses);
  };

  const handleStatusChange = (statusValue) => {
    setSelectedStatuses((prevStatuses) =>
      prevStatuses.includes(statusValue)
        ? prevStatuses.filter((status) => status !== statusValue)
        : [...prevStatuses, statusValue]
    );
  };

  const getStudentName = (studentEmail) => {
    const student = allStudents.find(
      (student) => student.studentEmail === studentEmail
    );
    return student ? student.studentName : studentEmail;
  };

  const applyFilters = (student, statuses) => {
    let filtered = patients;

    if (statuses.length > 0) {
      filtered = filtered.filter((patient) =>
        statuses.includes(patient.status)
      );
    }

    if (student !== "All") {
      filtered = filtered.filter((patient) => patient.studentEmail === student);
    }

    setFilteredPatients(filtered);
  };

  useEffect(() => {
    applyFilters(filterStudent, selectedStatuses);
  }, [selectedStatuses]);

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
                <Dropdown>
                  <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                    Filter Status
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {statusOptions.map((status) => (
                      <Dropdown.Item
                        key={status.value}
                        onClick={() => handleStatusChange(status.value)}
                      >
                        {selectedStatuses.includes(status.value) ? (
                          <span>&#10003; </span>
                        ) : (
                          <span>&nbsp;&nbsp;&nbsp;</span>
                        )}
                        {status.label}
                      </Dropdown.Item>
                    ))}
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
            <LoadingComponent />
          ) : error ? (
            <div className="d-flex justify-content-center">
              <Alert variant="danger" className={alertClass}>
                {error}
              </Alert>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <PatientCard
                patients={filteredPatients}
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
