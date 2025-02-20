import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Badge, ListGroup } from "react-bootstrap";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { calOperReg } from "./calOperReg";
import { allMinDivReq } from "./allMinDivReq";
import { allTotalDivReq } from "./allTotalDivReq";

function ReportOperReq(operR) {
  const { theme } = useContext(ThemeContext);

  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";

  const [totalReq, setTotalReq] = useState(allTotalDivReq().oper);
  const minReq = allMinDivReq().oper;

  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [calRqm, setCalRqm] = useState([]); // Initialize as an empty array to prevent runtime error

  useEffect(() => {
    if (operR.rqm && operR.rqm.length > 0) {
      // Only run if rqm is not empty or meets a condition
      const fetchData = async () => {
        try {
          const req = await calOperReg(operR.rqm, minReq);
          setCalRqm((prevCalRqm) => req.rqm || prevCalRqm);
          setTotalReq((prevTotalReq) => req.totalReq || prevTotalReq);
        } catch (error) {
          console.error("ReportOperReq: fetchData: ", error);
          setError(error);
        }
      };
      fetchData();
    }
  }, [operR.rqm]);

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
            <Col xs={12} md={8}>
              Operative Requirement
            </Col>
            <Col xs={12} md={4} className="text-center">
              Requirement
            </Col>
          </Row>
        </ListGroup.Item>
        <ListGroup.Item key={"title_RSU"} className={listGroupItemClass}>
          <Row>
            <Col xs={12} md={8}>
              RSU Requirement
            </Col>
            <Col xs={12} md={4} className="text-center">
              Total/(Minimum)
            </Col>
          </Row>
          {Object.entries(totalReq.RSU).map(([key, value]) => {
            if (
              key === "Polishing" ||
              key === "Sealant" ||
              key === "Diastema_closure" ||
              key === "PRR" ||
              key === "Caries_control" ||
              key === "Emergency_tx" ||
              key === "Inlay" ||
              key === "Onlay" ||
              key === "Veneer" ||
              key === "Class_VI"
            )
              return null;
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

        <ListGroup.Item key={"title_CDA"} className={listGroupItemClass}>
          <Row>
            <Col xs={12} md={8}>
              CDA Requirement
            </Col>
            <Col xs={12} md={4} className="text-center"></Col>
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
            <Row className="mb-3">
              <Col md={4}>Patient Name</Col>
              <Col md={1}>Type of Work</Col>
              <Col md={1}>Area</Col>
              <Col md={1}>RSU</Col>
              <Col md={1}>CDA</Col>
              <Col md={1}>RSU Status</Col>
              <Col md={1}>CDA Status</Col>
              <Col md={1}>Approval Status</Col>
            </Row>
          </ListGroup.Item>
        )}

        {show &&
          calRqm.map((rq) => (
            <ListGroup.Item key={rq.id} className={listGroupItemClass}>
              <Row className="mb-3">
                <Col md={4}>
                  {rq.HN} {rq.patientName}
                </Col>
                <Col md={1}>{rq.type}</Col>
                <Col md={1}>{rq.area}</Col>
                <Col md={1}>
                  {rq.req_RSU} {rq.unit_RSU}
                </Col>
                <Col md={1}>
                  {rq.req_DC} {rq.unit_DC}
                </Col>
                <Col md={1}>{rq.extra}</Col>
                <Col md={1}>{rq.extraCDA}</Col>
                <Col md={1}>{getApprovalStatus(parseInt(rq.isApproved))}</Col>
              </Row>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </>
  );
}

export default ReportOperReq;
