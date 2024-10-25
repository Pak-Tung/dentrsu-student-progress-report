import React, { useEffect, useState, useContext, useMemo } from "react";
import { Container, Row, Col, Badge, ListGroup, Alert } from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { calEndoReq } from "./calEndoReq";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData.default,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

function ReportEndoReq(endoR) {
  const { theme } = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [calRqm, setCalRqm] = useState([]);
  const [totalReq, setTotalReq] = useState({
    RSU: {
      RCT_Anterior_or_Premolar: 0,
      RCT_Molar: 0,
      Emergency_RCT: 0,
      Talk_case: 0,
      Recall_6_months: 0,
      Exam_RCT: 0,
    },
    CDA: {
      RCT_Anterior_or_Premolar: 0,
      Exam_RCT: 0,
    }
  });

  const [minReq, setMinReq] = useState({
    RSU: {
      RCT_Anterior_or_Premolar: 1,
      RCT_Molar: 1,
      Emergency_RCT: 1,
      Talk_case: 1,
      Recall_6_months: 1,
      Exam_RCT: 1,
    },
    CDA: {
      RCT_Anterior_or_Premolar: 1,
      Exam_RCT: 1,
    }
  });

  useEffect(() => {
    if (endoR.rqm && endoR.rqm.length > 0) {
      try {
        const fetchData = async () => {
          const data = await calEndoReq(endoR.rqm, minReq);
          setTotalReq(data.totalReq);
          setCalRqm(data.rqm);
        };
        fetchData();
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
  }, [endoR]);

  const getApprovalStatus = (rq) => {
    let status = "Approved";
    if (rq === 1){
      status = "Approved";
    }else if (rq === -1){
      status = "Revise";
    }else if (rq === 0){
      status = "Pending";
    }
    return status;
  }
    
  return (
    <>
      <ListGroup>
        <ListGroup.Item variant="dark">
          <Row>
            <Col xs={12} md={8}>Endodontic Requirement</Col>
            <Col xs={12} md={4} className="text-center">Requirement</Col>
          </Row>
        </ListGroup.Item>

        <ListGroup.Item key={"title_RSU"} className={listGroupItemClass}>
          <Row>
            <Col xs={12} md={8}>RSU Requirement</Col>
            <Col xs={12} md={4} className="text-center">Total/(Minimum)</Col>
          </Row>
          {Object.entries(totalReq.RSU).map(([key, value]) => {
            return (
              <Row key={key}>
                <Col xs={12} md={8}>
                  <h4>
                    <Badge bg={value >= minReq.RSU[key] ? "success" : "danger"}>
                      {key.replace(/_/g, " ")}
                    </Badge>
                  </h4>
                </Col>
                <Col xs={12} md={4} className="text-center">
                  {value} / ({minReq.RSU[key]})
                </Col>
              </Row>
            );
          })}
        </ListGroup.Item>
      </ListGroup>
      <ListGroup.Item key={"title_CDA"} className={listGroupItemClass}>
        <Row>
          <Col xs={12} md={8}>CDA Requirement</Col>
          <Col xs={12} md={4} className="text-center"></Col>
        </Row>
        {Object.entries(totalReq.CDA).map(([key, value]) => {
          return (
            <Row key={key}>
              <Col xs={12} md={8}>
                <h4>
                  <Badge bg={value >= minReq.CDA[key] ? "success" : "danger"}>
                    {key.replace(/_/g, " ")}
                  </Badge>
                </h4>
              </Col>
              <Col xs={12} md={4} className="text-center">
                {value} / ({minReq.CDA[key]})
              </Col>
            </Row>
          );
        })}
      </ListGroup.Item>

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
            <Col>Area</Col>
            <Col>RSU</Col>
            <Col>CDA</Col>
            <Col>RSU Status</Col>
            <Col>CDA Status</Col>
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
              <Col>
                {rq.req_DC} {rq.unit_DC}
              </Col>
              <Col>{rq.extraRSU}</Col>
              <Col>{rq.extraCDA}</Col>
              <Col>{getApprovalStatus(parseInt(rq.isApproved))}</Col>
            </Row>
          </ListGroup.Item>
        ))}
    </>
  )
}

export default ReportEndoReq