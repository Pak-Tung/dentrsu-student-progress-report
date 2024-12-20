import React, { useState, useEffect, useMemo, useCallback } from "react";
import NavbarAdmin from "./NavbarAdmin";
import { Container, Row, Col, ListGroup, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllReqByDivision } from "../../features/apiCalls";
import "../../App.css";
import ModalEditDivReq from "./ModalEditDivReq";
import LoadingComponent from "../../components/LoadingComponent";
import Cookies from "js-cookie";
import LoginByEmail from "../../components/LoginByEmail";

function EditApprovedReq() {
  const [division, setDivision] = useState(() => {
    const savedDivision = Cookies.get("division");
    return savedDivision ? savedDivision : "";
  });
  const email = Cookies.get("email");
  const [reqData, setReqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllReqByDivision(division);
        setReqData(result);
      } catch (err) {
        setError(
          "Failed to fetch minimum requirement data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [division]);

  const sortedReqData = useMemo(
    () => reqData.sort((a, b) => a.id - b.id),
    [reqData]
  );

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

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    window.location.reload();
  };
  const handleShow = () => setShow(true);

  const handleSelect = async (req) => {
    setSelectedReq(req);
    handleShow();
  };
  const [selectedReq, setSelectedReq] = useState(null);

  return (
    <>
      {email ? (
        <>
          <NavbarAdmin />
          <Container fluid="md">
            <div className="d-flex justify-content-center mb-4">
              <h4>
                Minimum Requirement of {fullNameDivision(division)} Division
              </h4>
            </div>
            {loading ? (
              <LoadingComponent />
            ) : error ? (
              <div className="d-flex justify-content-center">
                <Alert variant="danger">{error}</Alert>
              </div>
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
                      <strong>Minimum CDA Requirement</strong>
                    </Col>
                    <Col md={2}>
                      <strong>Unit</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {sortedReqData.map((req) => (
                  <ListGroup.Item
                    key={req.id}
                    className="myDiv"
                    onClick={() => handleSelect(req)}
                    style={{ cursor: "pointer" }}
                  >
                    <Row>
                      <Col md={4}>{req.type}</Col>
                      <Col md={2}>
                        {req.req_RSU === 0.0 ? "-" : req.req_RSU}
                      </Col>
                      <Col md={2}>{req.unit_RSU}</Col>
                      <Col md={2}>{req.req_DC === 0.0 ? "-" : req.req_DC}</Col>
                      <Col md={2}>{req.unit_DC}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Container>
          {selectedReq && ( // Conditionally render the modal
            <ModalEditDivReq
              show={show}
              handleClose={handleClose}
              divReq={selectedReq}
            />
          )}
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default EditApprovedReq;
