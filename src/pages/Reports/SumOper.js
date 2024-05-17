import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  getOperReqByStudentEmail,
  getReqByDivision,
} from "../../features/apiCalls";
import { Container, Row, Col, Badge, ListGroup } from "react-bootstrap";

function SumOper() {
  const division = "oper";

  if (Cookies.get("user") === undefined) {
    Cookies.set("user", JSON.stringify({}));
  } else {
    console.log("User email", Cookies.get("user"));
  }

  const user = JSON.parse(Cookies.get("user"));
  console.log("User in Profile", user);
  const userEmail = user.email;
  console.log("UserEmail", userEmail);

  const [rqm, setRqm] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getOperReqByStudentEmail(userEmail);
      const { error } = result;
      console.log("result", result);
      if (error) {
        console.log(error);
      } else {
        setRqm(result);
      }
    };
    fetchData();
  }, [userEmail]);

  // Summing req_RSU and req_DC for each rqm.type
  const aggregatedData = rqm.reduce((acc, cur) => {
    const { type, req_RSU, req_DC } = cur;
    if (!acc[type]) {
      acc[type] = { req_RSU: 0, req_DC: 0 };
    }
    acc[type].req_RSU += parseFloat(req_RSU);
    acc[type].req_DC += parseFloat(req_DC);
    return acc;
  }, {});

  const [minReq, setMinReq] = useState([]);

  useEffect(() => {
    const fetchMinReqData = async () => {
      const result = await getReqByDivision(division);
      const { error } = result;
      console.log("result", result);
      if (error) {
        console.log(error);
      } else {
        setMinReq(result);
      }
    };
    fetchMinReqData();
  }, [division]);

  const displayMinValue = (type, field) => {
    const min = minReq.find((req) => req.type === type);
    if (min && min[field] > 0) {
      return min[field];
    } else {
      return null;
    }
  };

  const getBadgeBg = (req_RSU, req_DC, min_RSU, min_DC) => {
    if (min_RSU !== null && min_DC !== null) {
      return req_RSU >= min_RSU && req_DC >= min_DC ? "success" : "danger";
    } else if (min_DC == null) {
      return req_RSU >= min_RSU ? "success" : "danger";
    } else if (min_RSU == null) {
      return req_DC >= min_DC ? "success" : "danger";
    }
    return "danger";
  };

  const getOrderedTypes = () => {
    return minReq.map((req) => req.type);
  };

  return (
    <Container fluid="md">
      <ListGroup>
        <ListGroup.Item active>Operative Requirement</ListGroup.Item>
        {getOrderedTypes().map((type) => {
          const { req_RSU, req_DC } = aggregatedData[type] || {
            req_RSU: 0,
            req_DC: 0,
          };
          const min_RSU = displayMinValue(type, "req_RSU");
          const min_DC = displayMinValue(type, "req_DC");
          return (
            <ListGroup.Item key={type}>
              <Row>
                <Col>
                  <h4>
                    <Badge bg={getBadgeBg(req_RSU, req_DC, min_RSU, min_DC)}>
                      {type}
                    </Badge>
                  </h4>
                </Col>
                <Col>Minimum RSU = {min_RSU !== null ? min_RSU : "N/A"}</Col>
                <Col>Minimum Council = {min_DC !== null ? min_DC : "N/A"}</Col>
              </Row>
              <Row>
                <Col></Col>
                <Col>RSU = {req_RSU}</Col>
                <Col>Council = {req_DC}</Col>
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  );
}

export default SumOper;
