import React, { useState, useEffect, useCallback, useContext } from "react";
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
import * as loadingData from "../../components/loading.json";
import * as successData from "../../components/success.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";

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

const CheckStatus = () => {
  const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email;
  const [student, setStudent] = useState({});
  const [completeReqsPercentage, setCompleteReqsPercentage] = useState({});
  const [compReq, setCompReq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (userEmail) {
        try {
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
        } catch (err) {
          console.error("Failed to fetch student data", err);
        }
      }
    };

    fetchStudentData();
  }, [userEmail]);

  useEffect(() => {
    const fetchCompleteReqsPercentage = async () => {
      if (student.studentEmail) {
        try {
          const result = await getCompleteReqsPercentageByDivision(student.studentEmail);
          setCompleteReqsPercentage(result);
        } catch (err) {
          console.error("Failed to fetch completion requirements percentage", err);
        }
      }
    };

    fetchCompleteReqsPercentage();
  }, [student.studentEmail]);

  const fetchCompcaseReq = useCallback(async () => {
    if (student.studentEmail) {
      try {
        const result = await getCompcaseReqByStudentEmail(student.studentEmail);
        if (result.error) {
          console.error(result.error);
        } else {
          setCompReq(result);
          setSuccess(true);
        }
      } catch (error) {
        console.error("Error fetching comp case requirements:", error);
      }
      setLoading(false);
    }
  }, [student.studentEmail]);

  useEffect(() => {
    fetchCompcaseReq();
  }, [fetchCompcaseReq]);

  const formatPercentage = (data) =>
    data
      ? ShortLabels.map((label) => Math.min(parseInt(data[label]) || 0, 100))
      : [];

  const percentageDC = formatPercentage(completeReqsPercentage.totalDivReq_DC);
  const percentageRSU = formatPercentage(completeReqsPercentage.totalDivReq_RSU);

  const checkAllDivReqCompleted = (data) => data.every((req) => req === 100);

  const checkAllDivReqCompletedDC = checkAllDivReqCompleted(percentageDC);
  const checkAllDivReqCompletedRSU = checkAllDivReqCompleted(percentageRSU);

  const approvedCompReqCount = compReq.filter((req) => req.isApproved === 1).length;
  const checkCompleteCases = approvedCompReqCount >= 5;

  const handleRequest = async () => {
    if (checkAllDivReqCompletedDC && checkAllDivReqCompletedRSU && checkCompleteCases) {
      try {
        const result = await updateRequestByStudentEmail(student.studentEmail, {
          request: 1,
        });
        if (result.error) {
          console.error(result.error);
        } else {
          console.log("Request Complete Status Updated");
        }
      } catch (error) {
        console.error("Error updating request status:", error);
      }
    } else {
      alert("Please complete all requirements before requesting complete status");
    }
  };

  return (
    <>
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
      ) : success ? (
        <>
          <Navbar />
          <Container className={theme === "dark" ? "container-dark" : ""}>
            <Row>
              <Col className="text-center" md={12}>
                <h2>
                  {student.title + " " + student.studentName + " "}{" "}
                  <Badge bg={student.status === "Complete" ? "success" : theme === "dark" ? "badge-dark" : "danger"}>
                    {student.status === "Complete" ? "Complete" : "Incomplete"}
                  </Badge>
                </h2>
                <hr />
              </Col>
            </Row>
            <Row className="d-flex justify-content-center mb-2">
              <Col className="text-center" md={6}>
                <h5>RSU Requirements</h5>
              </Col>
              <Col className="text-center" md={6}>
                <h5>CDA Requirements</h5>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center mb-2">
              <Col md={6} className={theme === "dark" ? "chart-dark" : ""}>
                <RadarChart label={LABELS} dataset={percentageRSU} />
              </Col>
              <Col md={6} className={theme === "dark" ? "chart-dark" : ""}>
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
              <Col md={8} className={theme === "dark" ? "chart-dark" : ""}>
                <StackedCompCases student={student} />
              </Col>
              <Col md={2}></Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center mb-2">
                <Button onClick={handleRequest} className={theme === "dark" ? "button-dark" : ""}>
                  Request Complete Status
                </Button>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <FadeIn>
          <div>
            <Container>
              <Row className="d-flex justify-content-center">
                <Lottie options={defaultOptions2} height={140} width={140} />
              </Row>
            </Container>
          </div>
        </FadeIn>
      )}
    </>
  );
};

export default CheckStatus;
