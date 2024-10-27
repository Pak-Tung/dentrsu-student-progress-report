import React, { useState, useEffect, useContext } from "react";
import {
  getStudentByEmail,
  getCompcaseReqByStudentEmail,
} from "../../features/apiCalls";
import { Container, Row, Col, ListGroup, Badge } from "react-bootstrap";
import LoginByEmail from "../../components/LoginByEmail";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";

function CompByStudentEmail({ studentEmail }) {
  const { theme } = useContext(ThemeContext);

  const [student, setStudent] = useState({});
  const [compReq, setCompReq] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch student data based on email
  useEffect(() => {
    const fetchStudentData = async () => {
      const result = await getStudentByEmail(studentEmail);
      const { error } = result;
      if (error) {
        console.log(error);
      } else {
        setStudent(result[0] || {});
      }
    };

    const fetchCompReqData = async () => {
      const result = await getCompcaseReqByStudentEmail(studentEmail);
      const { error } = result;
      if (error) {
        console.log(error);
      } else {
        setCompReq(result);
      }
    };

    if (studentEmail) {
      fetchStudentData();
      fetchCompReqData();
      setIsLoading(false);
    }
  }, [studentEmail]);

  // Filter and sort compReq by complexity in ascending order
  const sortedCompReq = compReq
    .filter((req) => req.isApproved === 1)
    .sort((a, b) => a.complexity - b.complexity);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const containerClass = theme === "dark" ? "container-dark" : "";
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const badgeClass = theme === "dark" ? "badge-dark" : "";
  const textClass = theme === "dark" ? "text-dark" : "";

  return (
    <>
      {studentEmail ? (
        <Container fluid="md" className={containerClass}>
          <Row className="justify-content-center">
            <Col md={6} className="text-center">
              <h2 className={textClass}>Complete Case Status</h2>
            </Col>
          </Row>
          {sortedCompReq.length > 0 ? (
            <ListGroup>
              {sortedCompReq.map((req) => (
                <ListGroup.Item key={req.id} className={listGroupItemClass}>
                  <Badge bg="success" pill className={badgeClass}>
                    APPROVED
                  </Badge>
                  <Row>
                    <Col>
                      <strong className={textClass}>Case:</strong> {req.complexity}
                      <br />
                    </Col>
                    <Col>
                      <strong className={textClass}>HN:</strong> {req.HN} <br />
                      <strong className={textClass}>Name:</strong> {req.patientName}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="d-flex justify-content-center mb-4">
              <p className={textClass}>No Approved Complete Case to Display</p>
            </div>
          )}
          <br />
        </Container>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default CompByStudentEmail;
