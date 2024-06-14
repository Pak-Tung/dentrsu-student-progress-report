import React, { useState, useEffect, useCallback } from "react";
import "../../App.css";
import NavbarInstructor from "../../components/NavbarInstructor";
import Cookies from "js-cookie";
import {
  getInstructorByEmail,
  getCompReqByInstructorEmail,
  getStudentByEmail,
} from "../../features/apiCalls";
import {
  Container,
  Row, Col, ListGroup, Badge, Alert,
} from "react-bootstrap";
import ModalCompReqApproval from "./ModalCompReqApproval";
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

function CompApproval() {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const userEmail = user.email;

  const [instructor, setInstructor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingReqs, setPendingReqs] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [selectedReq, setSelectedReq] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [show, setShow] = useState(false);

  const fetchInstructorData = useCallback(async () => {
    try {
      const result = await getInstructorByEmail(userEmail);
      if (result.error) {
        setError(result.error);
      } else if (result[0]) {
        setInstructor(result[0]);
      } else {
        setError("No data available");
      }
    } catch (err) {
      setError("Failed to fetch instructor data");
    }
  }, [userEmail]);

  const fetchRequests = useCallback(async () => {
    try {
      const result = await getCompReqByInstructorEmail(userEmail);
      if (result.error) {
        setError(result.error);
      } else {
        const pendingFilter = result.filter((req) => req.isApproved === 0);
        setPendingReqs(pendingFilter);

        const studentDataPromises = pendingFilter.map(async (req) => {
          const studentResult = await getStudentByEmail(req.studentEmail);
          return {
            studentEmail: req.studentEmail,
            studentName: studentResult[0]?.studentName || "Unknown",
          };
        });

        const studentDataArray = await Promise.all(studentDataPromises);
        const studentDataMap = studentDataArray.reduce((acc, curr) => {
          acc[curr.studentEmail] = curr.studentName;
          return acc;
        }, {});

        setStudentData(studentDataMap);
      }
    } catch (err) {
      setError("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchInstructorData();
  }, [fetchInstructorData]);

  useEffect(() => {
    if (userEmail) {
      fetchRequests();
    }
  }, [userEmail, fetchRequests]);

  const handlePendingReq = (req, student) => {
    setSelectedReq(req);
    setSelectedStudent(student);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    fetchRequests();
  };

  return (
    <>
      <NavbarInstructor />
      <Container fluid="md">
        <h1>Complete Case Approval</h1>

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
        ) : pendingReqs.length === 0 ? (
          <div className="d-flex justify-content-center">
            <p>No complete case request for approval.</p>
          </div>
        ) : (
          <ListGroup>
            {pendingReqs.map((pendingReq) => (
              <div key={pendingReq.id}>
                <ListGroup.Item
                  onClick={() => handlePendingReq(pendingReq, studentData[pendingReq.studentEmail])}
                  className="myDiv"
                >
                  <Badge
                    bg={
                      pendingReq.isApproved === 1
                        ? "success"
                        : pendingReq.isApproved === -1
                        ? "danger"
                        : "warning"
                    }
                    pill
                  >
                    {pendingReq.isApproved === 1
                      ? "APPROVED"
                      : pendingReq.isApproved === -1
                      ? "REVISIONS REQUIRED"
                      : "PENDING"}
                  </Badge>
                  <Row>
                    <Col>
                      <strong>db-ID:</strong> {pendingReq.id} <br />
                      <strong>Student:</strong> {studentData[pendingReq.studentEmail]} <br />
                    </Col>
                    <Col>
                      <strong>Complexity:</strong> {pendingReq.complexity} <br />
                      <strong>Note:</strong> {pendingReq.note2}
                    </Col>
                    <Col>
                      <strong>HN:</strong> {pendingReq.HN} <br />
                      <strong>Name:</strong> {pendingReq.patientName}
                    </Col>
                  </Row>
                </ListGroup.Item>
              </div>
            ))}
          </ListGroup>
        )}
      </Container>
      <ModalCompReqApproval
        show={show}
        handleClose={handleClose}
        compReq={selectedReq}
        studentName={selectedStudent}
      />
    </>
  );
}

export default CompApproval;
