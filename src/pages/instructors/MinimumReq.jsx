import React, { useState, useEffect, useCallback, useContext } from "react";
import NavbarInstructor from "../../components/NavbarInstructor";
import { Container, Row, Col, ListGroup, Alert } from "react-bootstrap";
import { getAllReqByDivision } from "../../features/apiCalls";
import LoadingComponent from "../../components/LoadingComponent";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import Cookies from "js-cookie";
import LoginByEmail from "../../components/LoginByEmail";

function MinimumReq() {
  const { theme } = useContext(ThemeContext);
  const division = Cookies.get("division");
  const email = Cookies.get("email");

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

  const containerClass = theme === "dark" ? "container-dark" : "";
  const listGroupItemClass = theme === "dark" ? "list-group-item-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";
  const textClass = theme === "dark" ? "text-dark-mode" : "";

  return (
    <>
      {email ? (
        <>
          <NavbarInstructor />
          <Container fluid="md" className={containerClass}>
            {loading ? (
              <LoadingComponent />
            ) : error ? (
              <Alert variant="danger" className={alertClass}>
                {error}
              </Alert>
            ) : (
              <>
                <div className="d-flex justify-content-center mb-4">
                  <h4 className={textClass}>
                    Minimum Requirement of {fullNameDivision(division)} Division
                  </h4>
                </div>
                <ListGroup>
                  <ListGroup.Item className={listGroupItemClass}>
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
                    <ListGroup.Item key={req.id} className={listGroupItemClass}>
                      <Row>
                        <Col md={4}>{req.type}</Col>
                        <Col md={2}>
                          {req.req_RSU < 0.001 ? "" : req.req_RSU}
                        </Col>
                        <Col md={2}>{req.unit_RSU}</Col>
                        <Col md={2}>{req.req_DC < 0.001 ? "" : req.req_DC}</Col>
                        <Col md={2}>{req.unit_DC}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}
          </Container>
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default MinimumReq;
