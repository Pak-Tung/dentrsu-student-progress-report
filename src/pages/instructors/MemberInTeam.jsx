import React, { useState, useEffect, useContext } from "react";
import NavbarInstructor from "../../components/NavbarInstructor";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Badge,
  Image,
  Alert,
} from "react-bootstrap";
import { getStudentByTeamleaderEmail } from "../../features/apiCalls";
import "../../App.css";
import ModalStudent from "./ModalStudent";
import LoadingComponent from "../../components/LoadingComponent";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import Cookies from "js-cookie";
import LoginByEmail from "../../components/LoginByEmail";

function MemberInTeam(email) {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const userEmail = user.email;

  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = Cookies.get("role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (role) {
      const fetchData = async () => {
        try {
          const emailToUse =
            role === "instructor" ? userEmail : email.instructorEmail;
          const result = await getStudentByTeamleaderEmail(emailToUse);

          if (Array.isArray(result)) {
            setStudentData(result);
            if (result.length === 0) {
              setError("No students found");
            }
          } else {
            setStudentData([]);
            setError("No students found");
          }
        } catch (err) {
          setError("Failed to fetch students");
          setStudentData([]); // Ensure studentData is an array even on error
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [userEmail, role]);

  const sortedStudentData = [...studentData].sort((a, b) => {
    return a.startClinicYear - b.startClinicYear;
  });

  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    handleShow();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const calculateStudentYear = (startClinicYear) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
    return currentYear - startClinicYear + (currentMonth > 4 ? 5 : 4);
  };

  const containerClass = theme === "dark" ? "container-dark" : "";
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  return (
    <>
      {(email || userEmail) ? (
        <>
          {role === "instructor" || role === "root" || role === "admin" ? (
            <NavbarInstructor />
          ) : null}
          <Container fluid="md" className={containerClass}>
            {loading ? (
              <LoadingComponent />
            ) : error ? (
              <Alert variant="danger" className={alertClass}>
                {error}
              </Alert>
            ) : (
              <>
                {role === "instructor" ? (
                  <div className="d-flex justify-content-center mb-4">
                    <h4>Team Members: ({studentData.length} students) </h4>
                  </div>
                ) : null}
                <ListGroup>
                  {sortedStudentData.map((student, index) => (
                    <ListGroup.Item
                      key={index}
                      onClick={() => handleStudentSelect(student)}
                      className={`myDiv ${listGroupItemClass}`}
                    >
                      <Row>
                        <Col md={2}>
                          <Image
                            src={
                              student.image
                                ? student.image
                                : "/images/student_jpg.jpg"
                            }
                            roundedCircle
                            fluid
                            width="75"
                            height="75"
                          />
                        </Col>
                        <Col md={6}>
                          <Badge
                            bg={
                              student.status === "Complete"
                                ? "success"
                                : "danger"
                            }
                          >
                            {student.status}
                          </Badge>
                          <h5>
                            {student.studentId} {student.title}{" "}
                            {student.studentName}
                          </h5>
                          <p>
                            Email: <strong>{student.studentEmail}</strong>
                          </p>
                        </Col>
                        <Col>
                          <p>
                            Student Year:
                            <strong>
                              {calculateStudentYear(student.startClinicYear)}th
                            </strong>
                          </p>
                          <p>
                            Bay:{" "}
                            <strong>
                              {" "}
                              M{student.floor}
                              {student.bay}
                              {student.unitNumber}
                            </strong>
                          </p>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}
          </Container>
          <ModalStudent
            show={show}
            handleClose={handleClose}
            student={selectedStudent}
          />
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default MemberInTeam;
