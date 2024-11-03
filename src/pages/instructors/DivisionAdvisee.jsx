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
import {
  getInstructorByEmail,
  getStudentByDivInstructorEmail,
} from "../../features/apiCalls";
import "../../App.css";
import ModalStudentByDiv from "./ModalStudentByDiv";
import LoadingComponent from "../../components/LoadingComponent";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import Cookies from "js-cookie";
import LoginByEmail from "../../components/LoginByEmail";

function DivisionAdvisee() {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const userEmail = user.email;

  const division = Cookies.get("division");

  const [instructor, setInstructor] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const instructorResult = await getInstructorByEmail(userEmail);
        if (!instructorResult.length) {
          throw new Error("Instructor not found");
        }
        const instructor = instructorResult[0];
        setInstructor(instructor);

        const studentResult = await getStudentByDivInstructorEmail(
          userEmail,
          instructor.division
        );
        if (studentResult.error) {
          throw new Error(studentResult.error);
        }
        setStudentData(
          studentResult.sort((a, b) => a.startClinicYear - b.startClinicYear)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    handleShow();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const containerClass = theme === "dark" ? "container-dark" : "";
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";
  const textClass = theme === "dark" ? "text-dark-mode" : "";

  return (
    <>
      {userEmail ? (
        <>
          <NavbarInstructor />
          <Container fluid="md" className={containerClass}>
            {loading ? (
              <LoadingComponent />
            ) : error ? (
              <Alert variant="danger" className={alertClass}>
                {error}
              </Alert>
            ) : (
              <>
                <div className="d-flex justify-content-center mb-4">
                  <h4 className={textClass}>
                    Division Advisee: {studentData.length} students
                  </h4>
                </div>
                <ListGroup>
                  {studentData.map((student, index) => {
                    const studentYear =
                      currentYear -
                      student.startClinicYear +
                      (currentMonth > 4 ? 1 : 0) +
                      4;
                    return (
                      <ListGroup.Item
                        key={index}
                        onClick={() => handleStudentSelect(student)}
                        className={`myDiv ${listGroupItemClass}`}
                      >
                        <Row>
                          <Col md={2}>
                            <Image
                              src={student.image}
                              roundedCircle
                              fluid
                              width="75"
                              height="75"
                              style={{ float: "left" }}
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
                            <h5 className={textClass}>
                              {student.studentId} {student.title}{" "}
                              {student.studentName}
                            </h5>
                            <p className={textClass}>
                              Email: <strong>{student.studentEmail}</strong>
                            </p>
                          </Col>
                          <Col>
                            <p className={textClass}>
                              Year: <strong>{studentYear}th</strong>
                            </p>
                            <p className={textClass}>
                              Bay:{" "}
                              <strong>
                                M{student.floor}
                                {student.bay}
                                {student.unitNumber}
                              </strong>
                            </p>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </>
            )}
          </Container>
          <ModalStudentByDiv
            show={show}
            handleClose={handleClose}
            student={selectedStudent}
            division={division}
          />
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default DivisionAdvisee;
