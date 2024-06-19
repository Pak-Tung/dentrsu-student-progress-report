import React, { useState, useEffect, useContext } from "react";
import {
  getStudentByEmail,
  getCompcaseReqByStudentEmail,
} from "../../features/apiCalls";
import Cookies from "js-cookie";
import Navbar from "../../components/Navbar";
import { Container, Row, Col, ListGroup, Badge, Alert } from "react-bootstrap";
import LoginByEmail from "../../components/LoginByEmail";
import * as loadingData from "../../components/loading.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function CompOverview() {
  const { theme } = useContext(ThemeContext);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [error, setError] = useState(null);

  Cookies.get("user") === undefined
    ? Cookies.set("user", JSON.stringify({}))
    : console.log("User email", Cookies.get("user"));
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [student, setStudent] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      const result = await getStudentByEmail(userEmail);
      const { error } = result;
      const data = result[0];
      if (error) {
        setError(error);
      } else {
        if (data) {
          setStudent(data);
        } else {
          setError("Data is undefined");
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
      if (error) {
        setError(error);
      } else {
        setCompReq(result);
        setLoadingStudent(false);
      }
    };
    fetchData();
  }, [userEmail]);

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

  const containerClass = theme === "dark" ? "container-dark" : "";
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  return (
    <>
      {userEmail !== undefined ? (
        <>
          <Navbar />
          <br />
          <Container fluid="md" className={containerClass}>
            <Row className="justify-content-center">
              <Col md={6} className="text-center">
                <h2>Complete Case Status</h2>
              </Col>
            </Row>
            {loadingStudent ? (
              <FadeIn>
                <div>
                  <Container>
                    <Row className="d-flex justify-content-center">
                      <Lottie
                        options={defaultOptions}
                        height={140}
                        width={140}
                      />
                    </Row>
                  </Container>
                </div>
              </FadeIn>
            ) : error ? (
              <div className="d-flex justify-content-center">
                <Alert variant="danger" className={alertClass}>{error}</Alert>
              </div>
            ) : sortedCompReq.length > 0 ? (
              <ListGroup>
                {sortedCompReq.map((req) => (
                  <div key={req.id}>
                    <ListGroup.Item className={listGroupItemClass}>
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
          </Container>
          <br />
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default CompOverview;
