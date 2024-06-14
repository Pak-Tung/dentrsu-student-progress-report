import React, { useState, useEffect, useCallback } from "react";
import "../../App.css";
import NavbarInstructor from "../../components/NavbarInstructor";
import Cookies from "js-cookie";
import {
  getInstructorByEmail,
  getDivReqByInstructorEmail,
  getStudentByEmail,
} from "../../features/apiCalls";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Badge,
  Alert,
} from "react-bootstrap";
import ModalReqApproval from "./ModalReqApproval";
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

function ReqApproval() {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    try {
      return savedUser ? JSON.parse(savedUser) : {};
    } catch (e) {
      console.error("Failed to parse user cookie", e);
      return {};
    }
  });
  const userEmail = user.email;

  const [instructor, setInstructor] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const [state, setState] = useState({
    loading: true,
    error: null,
    pendingReqs: [],
    studentData: {},
  });

  const instructorDivision = instructor.division;

  const fetchInstructorData = useCallback(async () => {
    try {
      const result = await getInstructorByEmail(userEmail);
      if (result.error) {
        setState((prevState) => ({ ...prevState, error: result.error }));
      } else if (result[0]) {
        setInstructor(result[0]);
      } else {
        setState((prevState) => ({ ...prevState, error: "No data available" }));
      }
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: "Failed to fetch instructor data",
      }));
    }
  }, [userEmail]);

  const fetchRequests = useCallback(async () => {
    try {
      const result = await getDivReqByInstructorEmail(
        userEmail,
        instructorDivision
      );
      if (result.error) {
        setState((prevState) => ({ ...prevState, error: result.error }));
      } else {
        const pendingFilter = result.filter((req) => req.isApproved === 0);
        const studentDataPromises = pendingFilter.map(async (req) => {
          const studentResult = await getStudentByEmail(req.studentEmail);
          setSuccess(true);
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

        setState((prevState) => ({
          ...prevState,
          pendingReqs: pendingFilter,
          studentData: studentDataMap,
          loading: false,
        }));

        setLoading(false);
      }
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: "Failed to fetch requests",
        loading: false,
      }));
    }
  }, [userEmail, instructorDivision]);

  useEffect(() => {
    fetchInstructorData();
  }, [fetchInstructorData]);

  useEffect(() => {
    if (instructorDivision) {
      fetchRequests();
    }
  }, [instructorDivision, fetchRequests]);

  const handlePendingReq = useCallback((req, student) => {
    setSelectedDivisionReq(req);
    setSelectedStudent(student);
    setShow(true);
  }, []);

  const [selectedDivisionReq, setSelectedDivisionReq] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    fetchRequests();
  };

  return (
    <>
      <NavbarInstructor />
      <Container fluid="md">
        <h1>Requirement Approval</h1>
        {state.loading ? (
          <div className="d-flex justify-content-center">

            <FadeIn>
              <div>
                <Container>
                  <Row className="d-flex justify-content-center">
                    <Lottie
                      options={defaultOptions}
                      height={140}
                      width={140}
                    />
                  </Row>
                </Container>
              </div>
            </FadeIn>
          </div>
        ) : state.error ? (
          <div className="d-flex justify-content-center">
            <Alert variant="danger">{state.error}</Alert>
          </div>
        ) : state.pendingReqs.length === 0 ? (
          <div className="d-flex justify-content-center">
            <p>No requirement request for approval.</p>
          </div>
        ) : (
          <ListGroup>
            {state.pendingReqs.map((pendingReq) => (
              <div key={pendingReq.id}>
                <ListGroup.Item
                  onClick={() =>
                    handlePendingReq(
                      pendingReq,
                      state.studentData[pendingReq.studentEmail]
                    )
                  }
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
                      <strong>Student:</strong>{" "}
                      {state.studentData[pendingReq.studentEmail]} <br />
                    </Col>
                    <Col>
                      <strong>Book No.</strong> {pendingReq.bookNo} <br />
                      <strong>Page No.</strong> {pendingReq.pageNo}
                    </Col>
                    <Col>
                      <strong>Type:</strong> {pendingReq.type} <br />
                      <strong>Area:</strong> {pendingReq.area}
                    </Col>
                    <Col>
                      <strong>RSU:</strong> {pendingReq.req_RSU} <br />
                      <strong>DC:</strong> {pendingReq.req_DC}
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
      <ModalReqApproval
        show={show}
        handleClose={handleClose}
        divisionReq={selectedDivisionReq}
        division={instructorDivision}
        studentName={selectedStudent}
      />
    </>
  );
}

export default ReqApproval;
