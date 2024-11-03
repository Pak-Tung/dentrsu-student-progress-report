import React, { useEffect, useState, useContext } from "react";
import {
  getDivReqByStudentEmail,
  getReqByDivision,
} from "../../features/apiCalls";
import { Container, Row, Col, Badge, ListGroup, Alert } from "react-bootstrap";
import LoadingComponent from "../../components/LoadingComponent";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import ReportPerioReq from "./ReportPerioReq";
import ReportOperReq from "./ReportOperReq";
import ReportEndoReq from "./ReportEndoReq";
import ReportProsthReq from "./ReportProsthReq";
import ReportDiagReq from "./ReportDiagReq";
import ReportRadioReq from "./ReportRadioReq";
import ReportSurReq from "./ReportSurReq";
import ReportOrthoReq from "./ReportOrthoReq";
import ReportPedoReq from "./ReportPedoReq";

function SumByDivAndStudentEmail({ division, studentEmail }) {
  const { theme } = useContext(ThemeContext);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [error, setError] = useState(null);

  const [rqm, setRqm] = useState([]);
  const [divTitle, setDivTitle] = useState("");
  const [minReq, setMinReq] = useState([]);

  // Set division title based on the division code
  useEffect(() => {
    const divisionTitles = {
      oper: "Operative",
      endo: "Endodontic",
      perio: "Periodontic",
      prosth: "Prosthodontic",
      diag: "Oral Diagnosis",
      radio: "Oral Radiology",
      sur: "Oral Surgery",
      pedo: "Pediatric Dentistry",
      ortho: "Orthodontic",
    };
    setDivTitle(divisionTitles[division] || "Unknown Division");
  }, [division]);

  // Fetch requirement data by student email and division
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDivReqByStudentEmail(studentEmail, division);
        setRqm(result);
      } catch (error) {
        setError("Error fetching data:", error);
      } finally {
        setLoadingStudent(false);
      }
    };
    fetchData();
  }, [studentEmail, division]);

  // Fetch minimum requirements data by division
  useEffect(() => {
    const fetchMinReqData = async () => {
      const result = await getReqByDivision(division);
      const { error } = result;
      if (error) {
        console.error(error);
      } else {
        setMinReq(result);
      }
    };
    fetchMinReqData();
  }, [division]);

  // Aggregate the requirement data for approved items
  const aggregatedData = rqm.reduce((acc, cur) => {
    if (cur.isApproved === 1) {
      const { type, req_RSU, req_DC } = cur;
      if (!acc[type]) {
        acc[type] = { req_RSU: 0, req_DC: 0 };
      }
      acc[type].req_RSU += parseFloat(req_RSU);
      acc[type].req_DC += parseFloat(req_DC);
    }
    return acc;
  }, {});

  // Display minimum requirement value
  const displayMinValue = (type, field) => {
    const min = minReq.find((req) => req.type === type);
    return min && min[field] > 0 ? min[field] : null;
  };

  // Get badge background color based on requirements
  const getBadgeBg = (req_RSU, req_DC, min_RSU, min_DC) => {
    if (min_RSU !== null && min_DC !== null) {
      return req_RSU >= min_RSU && req_DC >= min_DC ? "success" : "danger";
    } else if (min_DC === null) {
      return req_RSU >= min_RSU ? "success" : "danger";
    } else if (min_RSU === null) {
      return req_DC >= min_DC ? "success" : "danger";
    }
    return "danger";
  };

  // Get ordered types based on minimum requirements
  const getOrderedTypes = () => {
    return minReq.map((req) => req.type);
  };

  const containerClass = theme === "dark" ? "container-dark" : "";
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const listGroupItemActiveClass =
    theme === "dark" ? "list-group-item-active-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";
  const badgeClass = theme === "dark" ? "badge-dark" : "";

  return (
    <>
      <Container fluid className={containerClass}>
        <ListGroup>
          {division !== "perio" &&
            division !== "oper" &&
            division !== "prosth" &&
            division !== "endo" &&
            division !== "radio" &&
            division !== "sur" &&
            division !== "ortho" &&
            division !== "pedo" &&
            division !== "diag" && (
              <ListGroup.Item variant={theme === "dark" ? "secondary" : "dark"}>
                <Row>
                  <Col>{divTitle} Requirement</Col>
                  <Col className="text-center">RSU Requirement</Col>
                  <Col className="text-center">CDA Requirement</Col>
                </Row>
              </ListGroup.Item>
            )}

          {loadingStudent ? (
            <LoadingComponent />
          ) : error ? (
            <div className="d-flex justify-content-center">
              <Alert variant="danger" className={alertClass}>
                {error}
              </Alert>
            </div>
          ) : division === "oper" ? (
            <ReportOperReq rqm={rqm} />
          ) : division === "endo" ? (
            <ReportEndoReq rqm={rqm} />
          ) : division === "perio" ? (
            <ReportPerioReq rqm={rqm} />
          ) : division === "prosth" ? (
            <ReportProsthReq rqm={rqm} />
          ) : division === "diag" ? (
            <ReportDiagReq rqm={rqm} />
          ) : division === "radio" ? (
            <ReportRadioReq rqm={rqm} />
          ) : division === "ortho" ? (
            <ReportOrthoReq rqm={rqm} />
          ) : division === "pedo" ? (
            <ReportPedoReq rqm={rqm} />
          ) : division === "sur" ? (
            <ReportSurReq rqm={rqm} />
          ) : (
            getOrderedTypes().map((type) => {
              const { req_RSU, req_DC } = aggregatedData[type] || {
                req_RSU: 0,
                req_DC: 0,
              };
              const min_RSU = displayMinValue(type, "req_RSU");
              const min_DC = displayMinValue(type, "req_DC");
              return (
                <ListGroup.Item key={type} className={listGroupItemClass}>
                  <Row>
                    <Col>
                      <h4>
                        <Badge
                          bg={getBadgeBg(req_RSU, req_DC, min_RSU, min_DC)}
                        >
                          {type}
                        </Badge>
                      </h4>
                    </Col>
                    <Col className="text-center">
                      <b>{min_RSU !== null ? req_RSU : ""}</b>{" "}
                      {min_RSU !== null ? "of " + min_RSU : ""}
                    </Col>
                    <Col className="text-center">
                      <b>{min_DC !== null ? req_DC : ""}</b>{" "}
                      {min_DC !== null ? "of " + min_DC : ""}
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })
          )}
        </ListGroup>
      </Container>
    </>
  );
}

export default SumByDivAndStudentEmail;
