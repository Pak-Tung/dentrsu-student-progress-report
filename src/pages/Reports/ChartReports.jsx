import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { getStudentByEmail } from "../../features/apiCalls";
import { Container, Row, Col, Badge, Button } from "react-bootstrap";
import Cookies from "js-cookie";
import "../../Navbar.css";
import LoadingComponent from "../../components/LoadingComponent";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import {
  getDivReqByStudentEmail,
  updateRequestByStudentEmail,
  getCompcaseReqByStudentEmail,
} from "../../features/apiCalls";
import { calOperReg } from "./calOperReg";
import { calPerioReq } from "./calPerioReq";
import { calEndoReq } from "./calEndoReq";
import { calProsthReq } from "./calProsthReq";
import { calDiagReq } from "./calDiagReq";
import { calRadioReq } from "./calRadioReq";
import { calSurReq } from "./calSurReq";
import { calOrthoReq } from "./calOrthoReq";
import { calPedoReq } from "./calPedoReq";
import RadarChart from "../../components/RadarChart";
import StackedCompCases from "../../components/StackedCompCases";
import { allMinDivReq } from "./allMinDivReq";

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

function ChartReports({ studentEmail }) {
  const role = Cookies.get("role");
  const { theme } = useContext(ThemeContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userEmail, setUserEmail] = useState(studentEmail);
  const [student, setStudent] = useState({});

  const [rqm, setRqm] = useState({});
  const [minReq, setMinReq] = useState(allMinDivReq);

  const [compReq, setCompReq] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchStudentData = async () => {
      if (userEmail) {
        try {
          const result = await getStudentByEmail(userEmail);
          if (result && !result.error) {
            const data = result[0];
            if (data) {
              setStudent(data);
            } else {
              console.error("Student data is undefined");
            }
          } else {
            console.error(result.error);
          }
        } catch (err) {
          console.error("Failed to fetch student data", err);
        }
      }
    };

    fetchStudentData();
  }, [userEmail]);

  const divisions = [
    "oper",
    "perio",
    "endo",
    "prosth",
    "diag",
    "radio",
    "sur",
    "ortho",
    "pedo",
  ];

  useEffect(() => {
    const fetchAllData = async () => {
      if (userEmail) {
        try {
          const rqmData = {};
          for (const division of divisions) {
            const rqmResult = await getDivReqByStudentEmail(
              userEmail,
              division
            );
            if (rqmResult && !rqmResult.error) {
              rqmData[division] = rqmResult;
            }
          }

          setRqm(rqmData);
        } catch (error) {
          setError("Error fetching data: " + error.message);
        } finally {
        }
      }
    };

    fetchAllData();
  }, [userEmail]);

  const [totalDivReq, setTotalDivReq] = useState({
    RSU: {},
    CDA: {},
  });

  useEffect(() => {
    if (Object.keys(rqm).length && Object.keys(minReq).length) {
      setTotalDivReq({
        RSU: {
          oper: calOperReg(rqm.oper, minReq.oper)?.totalReq?.RSU || 0,
          perio: calPerioReq(rqm.perio, minReq.perio)?.totalReq?.RSU || 0,
          endo: calEndoReq(rqm.endo, minReq.endo)?.totalReq?.RSU || 0,
          prosth: calProsthReq(rqm.prosth, minReq.prosth)?.totalReq?.RSU || 0,
          diag: calDiagReq(rqm.diag, minReq.diag)?.totalReq?.RSU || 0,
          radio: calRadioReq(rqm.radio, minReq.radio)?.totalReq?.RSU || 0,
          sur: calSurReq(rqm.sur, minReq.sur)?.totalReq?.RSU || 0,
          ortho: calOrthoReq(rqm.ortho, minReq.ortho)?.totalReq?.RSU || 0,
          pedo: calPedoReq(rqm.pedo, minReq.pedo)?.totalReq?.RSU || 0,
        },
        CDA: {
          oper: calOperReg(rqm.oper, minReq.oper)?.totalReq?.CDA || 0,
          perio: calPerioReq(rqm.perio, minReq.perio)?.totalReq?.CDA || 0,
          endo: calEndoReq(rqm.endo, minReq.endo)?.totalReq?.CDA || 0,
          prosth: calProsthReq(rqm.prosth, minReq.prosth)?.totalReq?.CDA || 0,
          diag: calDiagReq(rqm.diag, minReq.diag)?.totalReq?.CDA || 0,
          radio: calRadioReq(rqm.radio, minReq.radio)?.totalReq?.CDA || 0,
          sur: calSurReq(rqm.sur, minReq.sur)?.totalReq?.CDA || 0,
          ortho: calOrthoReq(rqm.ortho, minReq.ortho)?.totalReq?.CDA || 0,
          pedo: calPedoReq(rqm.pedo, minReq.pedo)?.totalReq?.CDA || 0,
        },
      });
    }
  }, [rqm, minReq]);

  // const [percentReq, setPercentReq] = useState({});

  const calculateTotalMinRequirements = (minReqs) => {
    const totalMinDivReq = {};

    for (const division in minReqs) {
      totalMinDivReq[division] = {
        RSU: minReqs[division]?.RSU
          ? Object.values(minReqs[division].RSU).reduce(
              (acc, val) => acc + val,
              0
            )
          : 0,
        CDA: minReqs[division]?.CDA
          ? Object.values(minReqs[division].CDA).reduce(
              (acc, val) => acc + val,
              0
            )
          : 0,
      };
    }

    return totalMinDivReq;
  };

  // Adjust totalDivReq so it doesn't exceed minReq
  const adjustedTotalDivReq = useMemo(() => {
    const adjusted = {};
    for (const school in totalDivReq) {
      adjusted[school] = {};
      const divisions = totalDivReq[school];
      for (const division in divisions) {
        adjusted[school][division] = {}; // Initialize the division object
        const requirements = divisions[division];
        for (const key in requirements) {
          const value = totalDivReq[school][division][key];
          const minRequirement = minReq[division]?.[school]?.[key];
          // if (division === "prosth") {
          //   console.log("value", value);
          //   console.log("minRequirement", minRequirement);
          // }
          if (minRequirement !== undefined && value > minRequirement) {
            adjusted[school][division][key] = minRequirement;
          } else {
            adjusted[school][division][key] = value;
          }
        }
      }
    }
    return adjusted;
  }, [totalDivReq, minReq]);

  function calculateTotalDivRequirements(totalDivReqs) {
    let totalReqs = {};

    for (const school in totalDivReqs) {
      const divisions = totalDivReqs[school];
      for (const division in divisions) {
        const requirements = divisions[division];
        let total = 0;
        for (const key in requirements) {
          total += requirements[key];
        }
        if (!totalReqs[division]) {
          totalReqs[division] = {};
        }
        totalReqs[division][school] = total;
      }
    }

    return totalReqs;
  }

  const calculatePercentRequirements = (totalReqs, minReqs) => {
    const percentReq = {};

    for (const division in totalReqs) {
      // if (division === "prosth") {
      //   console.log("totalReqs prosth", totalReqs[division]);
      //   console.log("minReqs prosth", minReqs[division]);
      // }
      percentReq[division] = {
        RSU:
          minReqs[division]?.RSU > 0
            ? Math.min(
                (totalReqs[division].RSU / minReqs[division].RSU) * 100,
                100.0
              )
            : 0,
        CDA:
          minReqs[division]?.CDA > 0
            ? Math.min(
                (totalReqs[division].CDA / minReqs[division].CDA) * 100,
                100.0
              )
            : 0,
      };
    }
    // console.log("percentReq", percentReq);
    return percentReq;
  };

  // Calculate percentage requirements
  const percentReq = useMemo(() => {
    if (Object.keys(adjustedTotalDivReq).length && Object.keys(minReq).length) {
      const totalMinReq = calculateTotalMinRequirements(minReq);
      const totalDivRequirements =
        calculateTotalDivRequirements(adjustedTotalDivReq);
      return calculatePercentRequirements(totalDivRequirements, totalMinReq);
    } else {
      return {};
    }
  }, [adjustedTotalDivReq, minReq]);

  const [percentReqState, setPercentReqState] = useState({});

  useEffect(() => {
    setPercentReqState(percentReq);
    setLoading(false);
  }, [percentReq]);

  function transformPercentToNestedArray(percent, shortLabels) {
    const codes = ["RSU", "CDA"]; // Define the codes in the desired order
    const percentageAll = [];

    codes.forEach((code) => {
      const values = [];
      shortLabels.forEach((category) => {
        if (percent[category] && percent[category][code] !== undefined) {
          // Ensure the value has two decimal places
          const value = parseFloat(percent[category][code].toFixed(2));
          values.push(value);
        } else {
          values.push(null); // Or use 0 or undefined
        }
      });
      percentageAll.push(values);
    });

    return percentageAll;
  }

  // Use the function to transform percent into percentageAll
  const percentageAll = transformPercentToNestedArray(percentReq, divisions);

  const percentageDC = percentageAll[1];
  const percentageRSU = percentageAll[0];

  const checkAllDivReqCompleted = (data) => data.every((req) => req === 100);

  const checkAllDivReqCompletedDC = checkAllDivReqCompleted(percentageDC);
  const checkAllDivReqCompletedRSU = checkAllDivReqCompleted(percentageRSU);

  const fetchCompcaseReq = useCallback(async () => {
    if (student?.studentEmail) {
      try {
        const result = await getCompcaseReqByStudentEmail(student.studentEmail);
        if (result && !result.error) {
          setCompReq(result);
        }
      } catch (error) {
        console.error("Error fetching comp case requirements:", error);
      } finally {
        setLoading(true);
      }
    }
  }, [student.studentEmail]);

  useEffect(() => {
    fetchCompcaseReq();
  }, [fetchCompcaseReq]);

  const approvedCompReqCount = compReq.filter(
    (req) => req.isApproved === 1
  ).length;
  const checkCompleteCases = approvedCompReqCount >= 5;

  const handleRequest = async () => {
    if (
      checkAllDivReqCompletedDC &&
      checkAllDivReqCompletedRSU &&
      checkCompleteCases
    ) {
      try {
        const result = await updateRequestByStudentEmail(student.studentEmail, {
          request: 1,
        });
        if (result && !result.error) {
          console.log("Request Complete Status Updated");
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error updating request status:", error);
      }
    } else {
      alert(
        "Please complete all requirements before requesting complete status"
      );
    }
  };

  return (
    <>
      {loading ? (
        <LoadingComponent />
      ) : (
        <Container className={theme === "dark" ? "container-dark" : ""}>
          {role === "student" && (
            <Row>
              <Col className="text-center" md={12}>
                <h2>
                  {student.title + " " + student.studentName + " "}
                  <Badge
                    bg={
                      student.status === "Complete"
                        ? "success"
                        : theme === "dark"
                        ? "badge-dark"
                        : "danger"
                    }
                  >
                    {student.status === "Complete" ? "Complete" : "Incomplete"}
                  </Badge>
                </h2>
                <hr />
              </Col>
            </Row>
          )}
          <Row className="d-flex justify-content-center mb-2">
            <Col className="text-center" md={12}>
              <h5>RSU Requirements</h5>
            </Col>
            <Col md={6} className={theme === "dark" ? "chart-dark" : ""}>
              <RadarChart label={LABELS} dataset={percentageRSU} />
            </Col>
          </Row>
          <Row className="d-flex justify-content-center mb-2">
            <Col md={12}>
              <hr />
            </Col>
          </Row>
          <Row className="d-flex justify-content-center mb-2">
            <Col className="text-center" md={12}>
              <h5>CDA Requirements</h5>
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
          {role === "student" && (
            <Row>
              <Col className="d-flex justify-content-center mb-2">
                <Button
                  onClick={handleRequest}
                  className={theme === "dark" ? "button-dark" : ""}
                >
                  Request Complete Status
                </Button>
              </Col>
            </Row>
          )}
        </Container>
      )}
    </>
  );
}

export default ChartReports;
