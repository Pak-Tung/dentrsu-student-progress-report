import React, { useState, useEffect } from "react";
import {
  getStudentByEmail,
  getCompcaseReqByStudentEmail,
} from "../../features/apiCalls";
import Cookies from "js-cookie";
import GoogleLogin from "../../components/GoogleLogin";
import Navbar from "../../components/Navbar";
import { Container, Row, Col, ListGroup, Badge } from "react-bootstrap";

function CompOverview() {
  // Initialize user data from cookies
  Cookies.get("user") === undefined
    ? Cookies.set("user", JSON.stringify({}))
    : console.log("User email", Cookies.get("user"));
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  // State hooks for managing data
  const [student, setStudent] = useState([]);

  // Fetch student data based on email
  useEffect(() => {
    const fetchStudentData = async () => {
      const result = await getStudentByEmail(userEmail);
      const { error } = result;
      const data = result[0];
      if (error) {
        console.log(error);
      } else {
        if (data) {
          setStudent(data);
        } else {
          console.log("Data is undefined");
        }
      }
    };
    fetchStudentData();
  }, [userEmail]);

  const [compReq, setCompReq] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getCompcaseReqByStudentEmail(userEmail);
      const { error } = result;
      console.log("result", result);
      if (error) {
        console.log(error);
      } else {
        setCompReq(result);
      }
    };
    fetchData();
  }, [userEmail]);

  // Filter and sort compReq by complexity in ascending order
  const sortedCompReq = compReq
    .filter((req) => req.isApproved === 1)
    .sort((a, b) => {
      if (a.complexity < b.complexity) {
        return -1;
      }
      if (a.complexity > b.complexity) {
        return 1;
      }
      return 0;
    });

  return (
    <>
      {userEmail !== undefined ? (
        <>
          <Navbar />
          <br />
          <Container fluid="md">
            <Row className="justify-content-center">
              <Col md={6} className="text-center">
                <h2>Complete Case Status</h2>
              </Col>
            </Row>
            {sortedCompReq.length > 0 ? (
              <ListGroup>
                {sortedCompReq.map((req) => (
                  <div key={req.id}>
                    <ListGroup.Item>
                      <Badge bg="success" pill>
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
                  </div>
                ))}
              </ListGroup>
            ) : (
              <div className="d-flex justify-content-center mb-4">
                <p>No Approved Complete Case to Display</p>
              </div>
            )}
            <br />
          </Container>
        </>
      ) : (
        <GoogleLogin />
      )}
    </>
  );
}

export default CompOverview;
