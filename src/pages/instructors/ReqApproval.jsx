import React, { useState, useEffect, useCallback, useContext } from "react";
import "../../App.css";
import NavbarInstructor from "../../components/NavbarInstructor";
import Cookies from "js-cookie";
import {
  getInstructorByEmail,
  getDivReqByInstructorEmail,
  getStudentByEmail,
} from "../../features/apiCalls";
import { Container, Row, Col, ListGroup, Badge, Alert } from "react-bootstrap";
import ModalReqApproval from "./ModalReqApproval";
import LoadingComponent from "../../components/LoadingComponent";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import LoginByEmail from "../../components/LoginByEmail";

function ReqApproval() {
  const { theme } = useContext(ThemeContext);
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

  const containerClass = theme === "dark" ? "container-dark" : "";
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";
  const textClass = theme === "dark" ? "text-dark-mode" : "";
  const badgeClass = theme === "dark" ? "badge-dark" : "";

  return (
    <>
      {userEmail ? (
        <>
          <NavbarInstructor />
          <Container fluid="md" className={containerClass}>
            <h2 className={textClass}>Requirement Approval Request</h2>
            {state.loading ? (
              <LoadingComponent />
            ) : state.error ? (
              <div className="d-flex justify-content-center">
                <Alert variant="danger" className={alertClass}>
                  {state.error}
                </Alert>
              </div>
            ) : state.pendingReqs.length === 0 ? (
              <div className="d-flex justify-content-center">
                <p className={textClass}>
                  No requirement request for approval.
                </p>
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
                      className={`myDiv ${listGroupItemClass}`}
                    >
                      <Badge
                        bg={
                          pendingReq.isApproved === 1
                            ? "success"
                            : pendingReq.isApproved === -1
                            ? "danger"
                            : "warning"
                        }
                        className={badgeClass}
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
                          <strong className={textClass}>db-ID:</strong>{" "}
                          {pendingReq.id} <br />
                          <strong className={textClass}>Student:</strong>{" "}
                          {state.studentData[pendingReq.studentEmail]} <br />
                        </Col>
                        <Col>
                          <strong className={textClass}>Book No.</strong>{" "}
                          {pendingReq.bookNo} <br />
                          <strong className={textClass}>Page No.</strong>{" "}
                          {pendingReq.pageNo}
                        </Col>
                        <Col>
                          <strong className={textClass}>Type:</strong>{" "}
                          {pendingReq.type} <br />
                          <strong className={textClass}>Area:</strong>{" "}
                          {pendingReq.area}
                        </Col>
                        <Col>
                          <strong className={textClass}>RSU:</strong>{" "}
                          {pendingReq.req_RSU} <br />
                          <strong className={textClass}>DC:</strong>{" "}
                          {pendingReq.req_DC}
                        </Col>
                        <Col>
                          <strong className={textClass}>HN:</strong>{" "}
                          {pendingReq.HN} <br />
                          <strong className={textClass}>Name:</strong>{" "}
                          {pendingReq.patientName}
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
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default ReqApproval;
