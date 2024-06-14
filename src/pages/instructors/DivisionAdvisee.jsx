import React, { useState, useEffect } from "react";
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
import * as loadingData from "../../components/loading.json";
import * as successData from "../../components/success.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const defaultOptions2 = {
  loop: true,
  autoplay: true,
  animationData: successData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function DivisionAdvisee() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const userEmail = user.email;

  const division = localStorage.getItem("division");

  const [instructor, setInstructor] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch instructor data
        const instructorResult = await getInstructorByEmail(userEmail);
        if (!instructorResult.length) {
          throw new Error("Instructor not found");
        }
        const instructor = instructorResult[0];
        setInstructor(instructor);

        // Fetch student data only if instructor data is successfully retrieved
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
    //console.log("student", student);
    setSelectedStudent(student);
    handleShow();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <NavbarInstructor />
      <Container fluid="md">
        {loading ? (
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
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <div className="d-flex justify-content-center mb-4">
              <h4>Division Advisee: {studentData.length} students</h4>
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
                    className="myDiv"
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
                            student.status === "Complete" ? "success" : "danger"
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
                        {/* <p>
                          <strong>Start Clinic Year:</strong>{" "}
                          {student.startClinicYear}
                        </p> */}
                        <p>
                          Year: <strong>{studentYear}th</strong>
                        </p>
                        <p>
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
  );
}

export default DivisionAdvisee;
