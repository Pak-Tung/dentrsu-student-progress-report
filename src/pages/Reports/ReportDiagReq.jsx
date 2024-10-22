import React, { useEffect, useState, useContext, useMemo } from "react";
import { Container, Row, Col, Badge, ListGroup, Alert } from "react-bootstrap";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { calDiagReq } from "./calDiagReq";
import { getReqByDivision } from "../../features/apiCalls";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function ReportDiagReq(divisionR) {
  //console.log("divisionR", divisionR);
  const { theme } = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  const [calRqm, setCalRqm] = useState([]);
  const [minReq, setMinReq] = useState({
    RSU: {
      Complete_case_examination: 20,
      Assistant: 2,
      CPC_or_Journal_club: 1,
      Complete_splint: 1,
      Recall_cases_splint: 2,
    },
    CDA: {
      Complete_case_examination: 10,
      Chief_complaint_examination: 25,
      Biopsy_Blood_chemistry_or_soft_tissue_lesion_interpretation: 1,
      TMDs_case_examination: 1,
    },
  });
  const [totalReq, setTotalReq] = useState({
    RSU: {
      Complete_case_examination: 0,
      Assistant: 0,
      CPC_or_Journal_club: 0,
      Complete_splint: 0,
      Recall_cases_splint: 0,
    },
    CDA: {
      Complete_case_examination: 0,
      Chief_complaint_examination: 0,
      Biopsy_Blood_chemistry_or_soft_tissue_lesion_interpretation: 0,
      TMDs_case_examination: 0,
    },
  });

  useEffect(() => {
    if (divisionR.rqm && divisionR.rqm.length > 0) {
      try {
        const fetchData = async () => {
          const data = await calDiagReq(divisionR.rqm, minReq);
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
            <Col>Oral diagnosis && Occlusion Requirement</Col>
            <Col className="text-center">Requirement</Col>
          </Row>
        </ListGroup.Item>

        <ListGroup.Item key={"title_RSU"} className={listGroupItemClass}>
          <Row>
            <Col>|---RSU Requirement----------</Col>
            <Col className="text-center">---RSU---</Col>
          </Row>
          {Object.entries(totalReq.RSU).map(([key, value]) => {
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
      <ListGroup.Item key={"title_CDA"} className={listGroupItemClass}>
        <Row>
          <Col>|---CDA Requirement----------</Col>
          <Col className="text-center">---CDA---</Col>
        </Row>
        {Object.entries(totalReq.CDA).map(([key, value]) => {
          //if (value === 0) return null;
          return (
            <Row key={key}>
              <Col>
                <h4>
                  <Badge bg={value >= minReq.CDA[key] ? "success" : "danger"}>
                    {key.replace(/_/g, " ")}
                  </Badge>
                </h4>
              </Col>
              <Col className="text-center">
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

export default ReportDiagReq;
