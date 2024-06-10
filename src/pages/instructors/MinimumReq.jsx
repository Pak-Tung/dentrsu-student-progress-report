import React, { useState, useEffect, useCallback } from "react";
import NavbarInstructor from "../../components/NavbarInstructor";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { getAllReqByDivision } from "../../features/apiCalls";

function MinimumReq() {
  const division = localStorage.getItem("division");

  const fullNameDivision = useCallback((division) => {
    const divisionMap = {
      oper: "Operative",
      endo: "Endodontic",
      perio: "Periodontic",
      prosth: "Prosthodontic",
      diag: "Diagnostic",
      radio: "Radiology",
      sur: "Oral Surgery",
      pedo: "Pediatric Dentistry",
      ortho: "Orthodontic",
    };
    return divisionMap[division] || "";
  }, []);

  const [reqData, setReqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllReqByDivision(division);
        setReqData(result);
      } catch (err) {
        setError("Failed to fetch minimum requirement data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [division]);

  const sortedReqData = reqData.sort((a, b) => a.id - b.id);

  return (
    <>
      <NavbarInstructor />
      <Container fluid="md">
        <div className="d-flex justify-content-center mb-4">
          <h4>Minimum Requirement of {fullNameDivision(division)} Division</h4>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <ListGroup>
            <ListGroup.Item>
              <Row>
                <Col md={4}>
                  <strong>Type</strong>
                </Col>
                <Col md={2}>
                  <strong>Minimum RSU Requirement</strong>
                </Col>
                <Col md={2}>
                  <strong>Unit</strong>
                </Col>
                <Col md={2}>
                  <strong>Minimum DC Requirement</strong>
                </Col>
                <Col md={2}>
                  <strong>Unit</strong>
                </Col>
              </Row>
            </ListGroup.Item>
            {sortedReqData.map((req) => (
              <ListGroup.Item key={req.id}>
                <Row>
                  <Col md={4}>{req.type}</Col>
                  <Col md={2}>{req.req_RSU < 0.001 ? "" : req.req_RSU}</Col>
                  <Col md={2}>{req.unit_RSU}</Col>
                  <Col md={2}>{req.req_DC < 0.001 ? "" : req.req_DC}</Col>
                  <Col md={2}>{req.unit_DC}</Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>
    </>
  );
}

export default MinimumReq;
