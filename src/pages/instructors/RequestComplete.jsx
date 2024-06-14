import React, { useState, useEffect } from "react";
import "../../App.css";
import NavbarInstructor from "../../components/NavbarInstructor";
import Cookies from "js-cookie";
import {
  getStudentByTeamleaderEmail,
  updateStatusByStudentEmail,
  updateRequestByStudentEmail,
} from "../../features/apiCalls";
import { Container, Row, Col, ListGroup, Badge, Button, Alert } from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
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

function RequestComplete() {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const userEmail = user.email;

  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getStudentByTeamleaderEmail(userEmail);
        if (result.error) {
          setError(result.error);
        } else {
          setStudentData(result);
        }
      } catch (error) {
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  const requestStudent = studentData.filter((student) => student.request === 1);

  const calculateStudentYear = (startClinicYear) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
    return currentYear - startClinicYear + (currentMonth > 4 ? 5 : 4);
  };

  const handleStudent = async (studentEmail) => {
    const confirmation = window.confirm(
      "Are you sure you want to approve this student's request?"
    );
    if (confirmation) {
      const status = { status: "Complete" };
      try {
        const result = await updateStatusByStudentEmail(studentEmail, status);
        if (result.error) {
          console.error(result.error);
        } else {
          const res = await updateRequestByStudentEmail(studentEmail, {
            request: 0,
          });
          if (res.error) {
            console.error(res.error);
          } else {
            setStudentData((prevData) =>
              prevData.map((student) =>
                student.studentEmail === studentEmail
                  ? { ...student, request: 0, status: "Complete" }
                  : student
              )
            );
          }
        }
      } catch (error) {
        console.error("Failed to update student status", error);
      }
    }
  };

  return (
    <>
      <NavbarInstructor />
      <Container fluid="md">
        <h1>Requesting Complete Status</h1>
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
          <div className="d-flex justify-content-center">
            <Alert variant="danger">{error}</Alert>
          </div>
        ) : requestStudent.length === 0 ? (
          <div className="d-flex justify-content-center">
            <p>No student request for complete status approval.</p>
          </div>
        ) : (
          <ListGroup>
            {requestStudent.map((student) => (
              <div key={student.studentId}>
                <ListGroup.Item>
                  <Badge bg="danger" pill>
                    Requesting Complete Status
                  </Badge>
                  <Row>
                    <Col>
                      <strong>db-ID:</strong> {student.studentId} <br />
                      <strong>Student:</strong> {student.studentName} <br />
                    </Col>
                    <Col>
                      <strong>Email:</strong> {student.studentEmail} <br />
                      <strong>Bay:</strong> {"M" + student.floor}
                      {student.bay}
                      {student.unitNumber}
                    </Col>
                    <Col>
                      <strong>Year:</strong>{" "}
                      {calculateStudentYear(student.startClinicYear)} <br />
                    </Col>
                    <Col className="d-flex justify-content-center">
                      <Button
                        variant="success"
                        onClick={() => handleStudent(student.studentEmail)}
                      >
                        Approve
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </div>
            ))}
          </ListGroup>
        )}
      </Container>
    </>
  );
}

export default RequestComplete;
