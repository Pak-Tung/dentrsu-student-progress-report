import { React, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllDivisions } from "../../features/apiCalls";
import NavbarRoot from "./NavbarRoot";
import { Container, Row, Col, ListGroup, Button, Alert } from "react-bootstrap";
import LoadingComponent from "../../components/LoadingComponent";
import LoginByEmail from "../../components/LoginByEmail";
import Cookies from "js-cookie";

function AddDivision() {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = Cookies.get("email");
  useEffect(() => {
    const fetchDivisionsData = async () => {
      try {
        const result = await getAllDivisions();
        setDivisions(result);
      } catch (err) {
        console.error("Failed to fetch divisions", err);
        setError("Failed to fetch minimum requirement data");
      } finally {
        setLoading(false);
      }
    };
    fetchDivisionsData();
  }, []);

  return (
    <>
      {email ? (
        <>
          <NavbarRoot />
          <Container fluid="md">
            <div className="d-flex justify-content-center mb-4">
              <h4>All Divisions</h4>
            </div>
            {loading ? (
              <LoadingComponent />
            ) : error ? (
              <div className="d-flex justify-content-center">
                <Alert variant="danger">{error}</Alert>
              </div>
            ) : (
              <>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col md={2} className="text-center">
                        <strong>Division ID</strong>
                      </Col>
                      <Col md={6} className="text-center">
                        <strong>Division Name</strong>
                      </Col>
                      <Col md={4} className="text-center">
                        <strong>Division Short_Name</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {divisions.map((division) => (
                    <ListGroup.Item key={division.id}>
                      <Row>
                        <Col md={2} className="text-center">
                          {division.id}
                        </Col>
                        <Col md={6} className="text-center">
                          {division.fullName}
                        </Col>
                        <Col md={4} className="text-center">
                          {division.shortName}
                        </Col>
                        {/* <Col md={2}> <Button variant="outline-dark">Edit Division</Button></Col> */}
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <br />
                <Row className="d-flex justify-content-center">
                  <Col md={6} className="text-center">
                    <Button variant="outline-dark">Add Division</Button>
                  </Col>
                </Row>
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

export default AddDivision;
