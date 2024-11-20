import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Badge, ListGroup } from "react-bootstrap";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { calProsthReq } from "./calProsthReq";
import { allMinDivReq } from "./allMinDivReq";
import { allTotalDivReq } from "./allTotalDivReq";

function ReportProsthReq(divisionR) {
  const { theme } = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";

  const [calRqm, setCalRqm] = useState([]);
  const [totalReq, setTotalReq] = useState(allTotalDivReq().prosth);
  const minReq = allMinDivReq().prosth;

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
            <Col xs={12} md={8}>
              Prosthodontic Requirement
            </Col>
            <Col xs={12} md={4} className="text-center">
              Requirement
            </Col>
          </Row>
        </ListGroup.Item>

        <ListGroup.Item key={"title_RSU"} className={listGroupItemClass}>
          {Object.entries(totalReq.RSU).map(([key, value]) => {
            if (key === "Bridge_3_units") {
              return null;
            }
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
      </ListGroup>
    </>
  );
}

export default ReportProsthReq;
