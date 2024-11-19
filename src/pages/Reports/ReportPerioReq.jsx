import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Badge, ListGroup } from "react-bootstrap";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import { calPerioReq } from "./calPerioReq";

function ReportPerioReqTest(perioR) {
  //console.log("perioR", perioR);
  const { theme } = useContext(ThemeContext);
  const [show, setShow] = useState(false);
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";

  const [calRqm, setCalRqm] = useState([]);
  const [totalReq, setTotalReq] = useState({
    RSU: {
      Case_G: 0,
      Case_P: 0,
      Complexities: 0,
      OHI_1st_Exam: 0,
      OHI_2n_Exam: 0,
      SRP_1st_Exam: 0,
    },
    CDA: {
      //Case_G: 0,
      Case_P: 0,
      CDA_Cases: 0,
      SRP_2nd_Exam: 0,
    },
  });

  const [minReq, setMinReq] = useState({
    RSU: {
      Case_G: 4,
      Case_P: 1,
      Complexities: 7,
      OHI_1st_Exam: 1,
      OHI_2n_Exam: 1,
      SRP_1st_Exam: 1,
    },
    CDA: {
      //Case_G: 0,
      Case_P: 1,
      CDA_Cases: 9,
      SRP_2nd_Exam: 1,
    },
  });

  useEffect(() => {
    if (perioR.rqm && perioR.rqm.length > 0) {
      try {
        const fetchData = async () => {
          const data = await calPerioReq(perioR.rqm, minReq);
          setTotalReq(data.totalReq);
          setCalRqm(data.rqm);
        };
        fetchData();
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
  }, [perioR]);

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
              Periodontic Requirement
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
            // if (
            //   value === 0 &&
            //   (key === "Case_G" ||
            //     key === "Case_P" ||
            //     key === "Complexities" ||
            //     key === "OHI_1st_Exam" ||
            //     key === "SRP_1st_Exam")
            // )
            //   return null;
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
            <Col xs={12} md={4} className="text-center">
              Total/(Minimum)
            </Col>
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
              <Col>Recall Status</Col>
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

export default ReportPerioReqTest;
