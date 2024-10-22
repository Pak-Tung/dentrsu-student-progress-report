import React, { useEffect, useState, useContext, useMemo } from "react";
import { Container, Row, Col, Badge, ListGroup, Alert } from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { calProsthReq } from "./calProsthReq";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function ReportProsthReq(divisionR) {
  const { theme } = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [calRqm, setCalRqm] = useState([]);
  const [totalReq, setTotalReq] = useState({
    RSU: {
      CD_Upper: 0,
      CD_Lower: 0,
      MRPD: 0,
      ARPD: 0,
      Crown: 0,
      Post_Core_Crown: 0,
      Bridge_3_units: 0,
      Exam_design_RPD: 0,
      Exam_crown_preparation: 0,
    },
    CDA: {
      CD_Upper: 0,
      CD_Lower: 0,
      MRPD: 0,
      ARPD: 0,
      Crown: 0,
      Post_Core_Crown: 0,
      Bridge_3_units: 0,
    },
  });

  const [minReq, setMinReq] = useState({
    RSU: {
      CD_Upper: 1,
      CD_Lower: 1,
      MRPD: 1,
      ARPD: 2,
      Crown: 2,
      Post_Core_Crown: 1,
      Bridge_3_units: 1,
      Exam_design_RPD: 1,
      Exam_crown_preparation: 1,
    },
    CDA: {
      CD_Upper: 1,
      CD_Lower: 1,
      MRPD: 1,
      ARPD: 2,
      Crown: 2,
      Post_Core_Crown: 1,
      Bridge_3_units: 1,
    },
  });

  useEffect(() => {
    if (divisionR.rqm && divisionR.rqm.length > 0) {
      try {
        const fetchData = async () => {
          const data = await calProsthReq(divisionR.rqm, minReq);
          setTotalReq(data.totalReq);
          setCalRqm(data.rqm);
        };
        fetchData();
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
  }, [divisionR.rqm]);

  const getApprovalStatus = (rq) => {
    let status = "Approved";
    if (rq === 1) {
      status = "Approved";
    } else if (rq === -1) {
      status = "Revise";
    } else if (rq === 0) {
      status = "Pending";
    }
    return status;
  };

  return (
    <>
      <ListGroup>
        <ListGroup.Item variant="dark">
          <Row>
            <Col>Prosthodontic Requirement</Col>
            <Col className="text-center">Requirement</Col>
          </Row>
        </ListGroup.Item>

        <ListGroup.Item key={"title_RSU"} className={listGroupItemClass}>
          {Object.entries(totalReq.RSU).map(([key, value]) => {
            if(key === "Bridge_3_units"){return null;}
            return (
              <Row key={key}>
                <Col>
                  <h4>
                    <Badge bg={value >= minReq.RSU[key] ? "success" : "danger"}>
                      {key.replace(/_/g, " ")}
                    </Badge>
                  </h4>
                </Col>
                <Col className="text-center">
                  {value} / ({minReq.RSU[key]})
                </Col>
              </Row>
            );
          })}
        </ListGroup.Item>
      </ListGroup>

      <ListGroup.Item
        key="patientDetail"
        onClick={() => setShow((prevShow) => !prevShow)}
        style={{ cursor: "pointer" }}
        className={`myDiv ${listGroupItemClass}`}
      >
        <Row>
          <Col>
            {show
              ? "click to hide patient detail..."
              : "click for more patient detail..."}
          </Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
        </Row>
      </ListGroup.Item>

      {show && (
        <ListGroup.Item
          key={"ptTitle"}
          className={listGroupItemClass}
          variant="primary"
        >
          <Row>
            <Col>Patient Name</Col>
            <Col>Type of work</Col>
            <Col>Description</Col>
            <Col>R</Col>
            <Col>Status</Col>
            <Col>Approve status</Col>
          </Row>
        </ListGroup.Item>
      )}

      {show &&
        calRqm.map((rq) => (
          <ListGroup.Item key={rq.id} className={listGroupItemClass}>
            <Row>
              <Col>
                {rq.HN} {rq.patientName}
              </Col>
              <Col>{rq.type}</Col>
              <Col>{rq.area}</Col>
              <Col>
                {rq.req_RSU} {rq.unit_RSU}
              </Col>
              <Col>{rq.extraRSU}</Col>
              
              <Col>{getApprovalStatus(parseInt(rq.isApproved))}</Col>
            </Row>
          </ListGroup.Item>
        ))}
    </>
  );
}

export default ReportProsthReq;
