import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";
import RadarChart from "../../components/RadarChart";
import StackedCompCases from "../../components/StackedCompCases";
import { Container, Row, Col, Badge, Button } from "react-bootstrap";
import { getCompleteReqsPercentageByDivision } from "../../features/CalReq";
import Cookies from "js-cookie";
import {
  getStudentByEmail,
  updateRequestByStudentEmail,
  getCompcaseReqByStudentEmail,
} from "../../features/apiCalls";

const LABELS = [
  "Operative",
  "Periodontic",
  "Endodontic",
  "Prosthodontic",
  "Oral Diagnosis",
  "Oral Radiology",
  "Oral Surgery",
  "Orthodontic",
  "Pediatric Dentistry",
];

const ShortLabels = [
    "Oper",
    "Perio",
    "Endo",
    "Prosth",
    "Diag",
    "Radio",
    "Sur",
    "Ortho",
    "Pedo",
    ];


const CheckStatus = () => {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email;
  const [student, setStudent] = useState({});
  const [completeReqsPercentage, setCompleteReqsPercentage] = useState({});
  const [compReq, setCompReq] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      const result = await getStudentByEmail(userEmail);
      if (result.error) {
        console.error(result.error);
      } else {
        const data = result[0];
        if (data) {
          setStudent(data);
        } else {
          console.error("Data is undefined");
        }
      }
      setIsLoading(false);
    };
    if (userEmail) fetchStudentData();
  }, [userEmail]);

  useEffect(() => {
    const fetchCompleteReqsPercentage = async () => {
      if (student.studentEmail) {
        const result = await getCompleteReqsPercentageByDivision(student.studentEmail);
        setCompleteReqsPercentage(result);
      }
    };
    if (student.studentEmail) fetchCompleteReqsPercentage();
  }, [student.studentEmail]);

  const formatPercentage = (data) => 
    data
      ? ShortLabels.map((label) => Math.min(parseInt(data[label]) || 0, 100))
      : [];

  const percentageDC = formatPercentage(completeReqsPercentage.totalDivReq_DC);
  const percentageRSU = formatPercentage(completeReqsPercentage.totalDivReq_RSU);

  const checkAllDivReqCompleted = (data) => data.every((req) => req === 100);

  const checkAllDivReqCompletedDC = checkAllDivReqCompleted(percentageDC);
  const checkAllDivReqCompletedRSU = checkAllDivReqCompleted(percentageRSU);

  const fetchCompcaseReq = useCallback(async () => {
    if (student.studentEmail) {
      try {
        const result = await getCompcaseReqByStudentEmail(student.studentEmail);
        if (result.error) {
          console.error(result.error);
        } else {
          setCompReq(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [student.studentEmail]);

  useEffect(() => {
    fetchCompcaseReq();
  }, [fetchCompcaseReq]);

  const approvedCompReqCount = compReq.filter((req) => req.isApproved === 1).length;
  const checkCompleteCases = approvedCompReqCount >= 5;

  const handleRequest = async () => {
    if (checkAllDivReqCompletedDC && checkAllDivReqCompletedRSU && checkCompleteCases) {
      const result = await updateRequestByStudentEmail(student.studentEmail, { request: 1 });
      if (result.error) {
        console.error(result.error);
      } else {
        console.log("Request Complete Status Updated");
      }
    } else {
      alert("Please complete all requirements before requesting complete status");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Container>
        <Row>

          <Col className="text-center" md={12}>
            <h2>
              {student.title + " " + student.studentName + " "}{" "}
              <Badge bg={student.status === "Complete" ? "success" : "danger"}>
                {student.status === "Complete" ? "Complete" : "Incomplete"}
              </Badge>
            </h2>
            <hr />
          </Col>

        </Row>
        <Row className="d-flex justify-content-center mb-2">
          <Col className="text-center" md={6}>
            <h5>RSU Requirement</h5>
          </Col>
          <Col className="text-center" md={6}>
            <h5>DC Requirement</h5>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center mb-2">
          <Col md={6}>
            <RadarChart label={LABELS} dataset={percentageRSU} />
          </Col>
          <Col md={6}>
            <RadarChart label={LABELS} dataset={percentageDC} />
          </Col>
        </Row>
        <Row className="d-flex justify-content-center mb-2">
          <Col md={12}>
            <hr />
          </Col>
        </Row>
        <Row className="d-flex justify-content-center mb-2">
          <Col md={2}></Col>
          <Col md={8}>
            <StackedCompCases student={student} />
          </Col>
          <Col md={2}></Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center mb-2">
            <Button onClick={handleRequest}>Request Complete Status</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CheckStatus;
