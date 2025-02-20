import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Badge, ListGroup } from "react-bootstrap";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { calOrthoReq } from "./calOrthoReq";
import { allMinDivReq } from "./allMinDivReq";
import { allTotalDivReq } from "./allTotalDivReq";

function ReportOrthoReq(divisionR) {
  const { theme } = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";

  const [calRqm, setCalRqm] = useState([]);
  const [totalReq, setTotalReq] = useState(allTotalDivReq().ortho);
  const minReq = allMinDivReq().ortho;

  useEffect(() => {
    if (divisionR.rqm && divisionR.rqm.length > 0) {
      try {
        const fetchData = async () => {
          const data = await calOrthoReq(divisionR.rqm, minReq);
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
            <Col xs={12} md={8}>
              Orthodontic
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
      </ListGroup>
    </>
  );
}

export default ReportOrthoReq;
