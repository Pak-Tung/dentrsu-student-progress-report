import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Badge, ListGroup } from "react-bootstrap";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { calDiagReq } from "./calDiagReq";
import { allMinDivReq } from "./allMinDivReq";
import { allTotalDivReq } from "./allTotalDivReq";

function ReportDiagReq(divisionR) {
  const { theme } = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";

  const [calRqm, setCalRqm] = useState([]);
  const [totalReq, setTotalReq] = useState(allTotalDivReq().diag);
  const minReq = allMinDivReq().diag;

  useEffect(() => {
    if (divisionR && divisionR.rqm && divisionR.rqm.length > 0) {
      try {
        const fetchData = async () => {
          const data = await calDiagReq(divisionR.rqm, minReq);
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
  }, [divisionR]);

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
            <Col xs={12} md={8}>
              Oral Diagnosis & Occlusion Requirement
            </Col>
            <Col xs={12} md={4} className="text-center">
              Requirement
            </Col>
          </Row>
        </ListGroup.Item>

        <ListGroup.Item key={"title_RSU"} className={listGroupItemClass}>
          <Row>
            <Col xs={12} md={8}>
              <strong>RSU Requirement</strong>
            </Col>
            <Col xs={12} md={4} className="text-center">
              Total/(Minimum)
            </Col>
          </Row>
          {Object.entries(totalReq.RSU).map(([key, value]) => {
            return (
              <Row key={key} className="mb-2">
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
              <strong>CDA Requirement</strong>
            </Col>
            <Col xs={12} md={4} className="text-center"></Col>
          </Row>
          {Object.entries(totalReq.CDA).map(([key, value]) => {
            return (
              <Row key={key} className="mb-2">
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
                ? "Click to hide patient details..."
                : "Click for more patient details..."}
            </Col>
          </Row>
        </ListGroup.Item>

        {show && (
          <>
            <ListGroup.Item
              key={"ptTitle"}
              className={listGroupItemClass}
              variant="primary"
            >
              <Row>
                <Col xs={6} md={3}>
                  Patient Name
                </Col>
                <Col xs={6} md={2}>
                  Type of Work
                </Col>
                <Col xs={6} md={3}>
                  Description
                </Col>
                <Col xs={3} md={1}>
                  RSU
                </Col>
                <Col xs={3} md={1}>
                  CDA
                </Col>
                <Col xs={3} md={1}>
                  RSU Status
                </Col>
                <Col xs={3} md={1}>
                  CDA Status
                </Col>
                <Col xs={3} md={1}>
                  Approval Status
                </Col>
              </Row>
            </ListGroup.Item>

            {calRqm.map((rq) => (
              <ListGroup.Item key={rq.id} className={listGroupItemClass}>
                <Row>
                  <Col xs={6} md={3}>
                    {rq.HN} {rq.patientName}
                  </Col>
                  <Col xs={6} md={2}>
                    {rq.type}
                  </Col>
                  <Col xs={6} md={3}>
                    {rq.area}
                  </Col>
                  <Col xs={3} md={1}>
                    {rq.req_RSU} {rq.unit_RSU}
                  </Col>
                  <Col xs={3} md={1}>
                    {rq.req_DC} {rq.unit_DC}
                  </Col>
                  <Col xs={3} md={1}>
                    {rq.extraRSU}
                  </Col>
                  <Col xs={3} md={1}>
                    {rq.extraCDA}
                  </Col>
                  <Col xs={3} md={1}>
                    {getApprovalStatus(parseInt(rq.isApproved))}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </>
        )}
      </ListGroup>
    </>
  );
}

export default ReportDiagReq;
