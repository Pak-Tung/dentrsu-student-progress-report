import React, { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import {
  getDivReqByStudentEmail,
  getReqByDivision,
} from "../../features/apiCalls";
import { Container, Row, Col, Badge, ListGroup, Alert } from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
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

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function SumByDiv({ division }) {
  const { theme } = useContext(ThemeContext);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [error, setError] = useState(null);

  if (Cookies.get("user") === undefined) {
    Cookies.set("user", JSON.stringify({}));
  } else {
    //console.log("User email", Cookies.get("user"));
  }

  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [rqm, setRqm] = useState([]);
  const [divTitle, setDivTitle] = useState("");
  const [minReq, setMinReq] = useState([]);

  useEffect(() => {
    const divisionTitles = {
      oper: "Operative",
      endo: "Endodontic",
      perio: "Periodontic",
      prosth: "Prosthodontic",
      diag: "Oral Diagnosis",
      radio: "Oral Radiology",
      sur: "Oral Surgery",
      ortho: "Orthodontic",
      pedo: "Pediatric Dentistry",
    };
    setDivTitle(divisionTitles[division] || "Unknown Division");
  }, [division]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDivReqByStudentEmail(userEmail, division);
        setRqm(result);
      } catch (error) {
        setError("Error fetching data:", error);
      } finally {
        setLoadingStudent(false);
      }
    };
    fetchData();
  }, [userEmail, division]);

  useEffect(() => {
    const fetchMinReqData = async () => {
      try {
        const result = await getReqByDivision(division);
        setMinReq(result);
      } catch (error) {
        setError("Error fetching data:", error);
      } finally {
        setLoadingStudent(false);
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

  const displayMinValue = (type, field) => {
    const min = minReq.find((req) => req.type === type);
    return min && min[field] > 0 ? min[field] : null;
  };

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

  const getOrderedTypes = () => {
    return minReq.map((req) => req.type);
  };

  const containerClass = theme === "dark" ? "container-dark" : "";
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  return (
    <>
      <Container fluid="md" className={containerClass}>
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

export default SumByDiv;
