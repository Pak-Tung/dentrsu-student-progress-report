import React, { useEffect, useState, useContext, useMemo } from "react";
import { Container, Row, Col, Badge, ListGroup, Alert } from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { calPedoReq } from "./calPedoReq";
import { getReqByDivision } from "../../features/apiCalls";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function ReportPedoReq(divisionR, { divisionName = "pedo" }) {
  const { theme } = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [calRqm, setCalRqm] = useState([]);
  const [minReq, setMinReq] = useState({
    RSU: {
      Comprehensive_examination_and_treatment_plan_in_new_patient: 2,
      Comprehensive_examination_and_treatment_plan_in_recall_patient: 3,
      Photographs_and_Radiographs: 1,
      Caries_risk_assessment_and_Management: 5,
      Sealant: 8,
      Filling: 6,
      Primary_molar_class_II_restoration: 2,
      Stainless_steel_crown_in_posterior_teeth: 1,
      Pulpectomy_Step_OC_and_LT_or_Pulpotomy: 1,
      Pulpectomy_Step_MI_and_FRC: 1,
      Extraction: 2,
      Miscellaneous_work: 1,
      Exam_Inferior_alveolar_nerve_block_injection: 1,
      Exam_Rubber_dam_application: 1,
    },
    CDA: {
      Comprehensive_examination_and_treatment_plan: 5,
      Caries_risk_assessment_and_Management: 5,
      Filling_or_PRR: 10,
      Pulpectomy_or_Pulpotomy: 1,
      Stainless_steel_crown: 1,
      Sealant: 5,
      Extraction: 2,
    },
  });
  const [totalReq, setTotalReq] = useState({
    RSU: {
      Comprehensive_examination_and_treatment_plan_in_new_patient: 0,
      Comprehensive_examination_and_treatment_plan_in_recall_patient: 0,
      Photographs_and_Radiographs: 0,
      Caries_risk_assessment_and_Management: 0,
      Sealant: 0,
      Filling: 0,
      Primary_molar_class_II_restoration: 0,
      Stainless_steel_crown_in_posterior_teeth: 0,
      Pulpectomy_Step_OC_and_LT_or_Pulpotomy: 0,
      Pulpectomy_Step_MI_and_FRC: 0,
      Extraction: 0,
      Miscellaneous_work: 0,
      Exam_Inferior_alveolar_nerve_block_injection: 0,
      Exam_Rubber_dam_application: 0,
    },
    CDA: {
      Comprehensive_examination_and_treatment_plan: 0,
      Caries_risk_assessment_and_Management: 0,
      Sealant: 0,
      Filling_or_PRR: 0,
      Stainless_steel_crown: 0,
      Pulpectomy_or_Pulpotomy: 0,
      Extraction: 0,
    },
  });

  useEffect(() => {
    if (divisionR.rqm && divisionR.rqm.length > 0) {
      try {
        const fetchData = async () => {
          const data = await calPedoReq(divisionR.rqm, minReq);
          //console.log("data", data);
          setTotalReq((prevTotalReq) => ({
            RSU: {
              ...prevTotalReq.RSU,
              ...data.totalReq.RSU,
            },
            CDA: {
              ...prevTotalReq.CDA,
              ...data.totalReq.CDA,
            },
          }));

          setCalRqm(data.rqm);
        };
        fetchData();
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
  }, [divisionR.rqm]);

  const getApprovalStatus = (rq) => {
    let status = "N/A";
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
            <Col xs={12} md={8}>Pediatric</Col>
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
          <Col xs={12} md={4} className="text-center">Total/(Minimum)</Col>
        </Row>
        {Object.entries(totalReq.CDA).map(([key, value]) => {
          //if (value === 0) return null;
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
            <Col>Description</Col>
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
  );
}

export default ReportPedoReq;
