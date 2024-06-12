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
  Row,
  Col,
  ListGroup,
  Badge,
} from "react-bootstrap";
import ModalCompReqApproval from "./ModalCompReqApproval";

function CompApproval() {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const userEmail = user.email;

  const [instructor, setInstructor] = useState(() => {
    const savedInstructor = Cookies.get("instructor");
    return savedInstructor ? savedInstructor : {};
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getInstructorByEmail(userEmail);
        const { error, data } = result;
        //console.log(result[0]);
        if (error) {
          setError(error);
        } else if (result[0]) {
          setInstructor(result[0]);
        } else {
          setError("No data available");
        }
      } catch (err) {
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userEmail]);

  const [pendingReqs, setPendingReqs] = useState([]);
  const [studentData, setStudentData] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const result = await getCompReqByInstructorEmail(userEmail);
      const { error, data } = result;
      //console.log(result);
      if (error) {
        setError(error);
      } else if (result) {
        //console.log("result", result);
        const pendingFilter = result.filter((req) => req.isApproved === 0);
        setPendingReqs(pendingFilter);

        // Fetch student data for each request
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
      } else {
        setError("No data available");
      }
    } catch (err) {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
    fetchData();
    }
  }, [userEmail, fetchData]);

  // State to hold the selected pending requirement for approval
  const [selectedReq, setSelectedReq] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Function to handle pending requirement
  const handlePendingReq = async (req, student) => {
    setSelectedReq(req);
    setSelectedStudent(student);
    //console.log("Selected Req", req);
    //console.log("Selected Student", student);
    handleShow();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => {
    fetchData();
    setShow(false);
  }

  const handleShow = () => setShow(true);

  return (
    <>
      <NavbarInstructor />
      <Container fluid="md">
        <h1>Complete Case Approval</h1>
        {pendingReqs.length === 0 ? (
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
                      <strong>Complexity:</strong> {pendingReq.complexity}{" "}
                      <br />
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
