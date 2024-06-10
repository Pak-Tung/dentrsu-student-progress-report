import React, { useState, useEffect } from "react";
import "../../App.css";
import NavbarInstructor from "../../components/NavbarInstructor";
import Cookies from "js-cookie";
import {
  getInstructorByEmail,
  getDivReqByInstructorEmail,
  getStudentByEmail
} from "../../features/apiCalls";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Badge,
} from "react-bootstrap";
import ModalReqApproval from "./ModalReqApproval";

function ReqApproval() {
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
        console.log(result[0]);
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

  const instructorDivision = instructor.division;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDivReqByInstructorEmail(
          userEmail,
          instructorDivision
        );
        const { error, data } = result;
        console.log(result);
        if (error) {
          setError(error);
        } else if (result) {
          console.log("result", result);
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
    };
    fetchData();
  }, [userEmail, instructorDivision]);

  console.log("Pending Reqs", pendingReqs);

  // State to hold the selected pending requirement for approval
  const [selectedDivisionReq, setSelectedDivisionReq] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Function to handle pending requirement
  const handlePendingReq = async (req, student) => {
    setSelectedDivisionReq(req);
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
        <h1>Requirement Approval</h1>
        {pendingReqs.length === 0 ? (
          <div className="d-flex justify-content-center">
            <p>No requirement request for approval.</p>
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
