import React, { useState, useEffect, useCallback, useContext } from "react";
import { Container, Row, Col, ListGroup, Badge } from "react-bootstrap";
import { getCompcaseReqByStudentEmail } from "../features/apiCalls";
import { ThemeContext } from "../ThemeContext";
import "../DarkMode.css";

function StackedCompCases({ student = { studentName: "John Doe", studentEmail: "pakit.tu@rsu.ac.th" } }) {
  const { theme } = useContext(ThemeContext);
  const [compReq, setCompReq] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const result = await getCompcaseReqByStudentEmail(student.studentEmail);
      if (result.error) {
        console.error(result.error);
      } else {
        setCompReq(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [student.studentEmail]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedCompReq = compReq
    .filter((req) => req.isApproved === 1)
    .sort((a, b) => a.complexity - b.complexity);

  const containerClass = theme === "dark" ? "container-dark" : "";
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const badgeClass = theme === "dark" ? "badge-dark" : "success";

  return (
    <Container fluid="md" className={containerClass}>
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <h2>Complete Case Status</h2>
        </Col>
      </Row>
      {sortedCompReq.length > 0 ? (
        <ListGroup>
          {sortedCompReq.map((req) => (
            <ListGroup.Item key={req.id} className={listGroupItemClass}>
              <Badge bg={badgeClass} pill>
                APPROVED
              </Badge>
              <Row>
                <Col>
                  <strong>Case:</strong> {req.complexity}
                  <br />
                </Col>
                <Col>
                  <strong>HN:</strong> {req.HN} <br />
                  <strong>Name:</strong> {req.patientName}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div className="d-flex justify-content-center mb-4">
          <p>No Approved Complete Case to Display</p>
        </div>
      )}
      <br />
    </Container>
  );
}

export default StackedCompCases;
