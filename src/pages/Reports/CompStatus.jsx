import React, { useEffect, useState, useCallback } from "react";
import { getCompcaseReqByStudentEmail } from "../../features/apiCalls";
import Cookies from "js-cookie";
import { Container, Row, Col, ListGroup, Badge, Modal } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import ModalUpdateComp from "./ModalUpdateComp";
import "../../pages/CustomStyles.css";
import "../../App.css";
import LoginByEmail from "../../components/LoginByEmail";

function CompStatus() {
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [compReq, setCompReq] = useState([]);
  const [selectedCompReq, setSelectedCompReq] = useState(null);
  const [show, setShow] = useState(false);
  const [smShow, setSmShow] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const result = await getCompcaseReqByStudentEmail(userEmail);
      setCompReq(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleUpdateCompReq = (req) => {
    setSelectedCompReq(req);
    if (req.isApproved === 1) {
      setSmShow(true);
    } else {
      setShow(true);
    }
  };

  const handleClose = () => {
    fetchData();
    setShow(false);
  };

  const sortedCompReq = [...compReq].sort((a, b) => a.complexity - b.complexity);

  return (
    <>
      {userEmail ? (
        <>
          <Navbar />
          <Container fluid="md">
            <Row className="justify-content-center">
              <Col md={6} className="text-center">
                <h2>Complete Case Status</h2>
              </Col>
            </Row>
            <ListGroup>
              {sortedCompReq.map((req) => (
                <ListGroup.Item
                  key={req.id}
                  onClick={() => handleUpdateCompReq(req)}
                  className="myDiv"
                >
                  <Badge
                    bg={
                      req.isApproved === 1
                        ? "success"
                        : req.isApproved === -1
                        ? "danger"
                        : "warning"
                    }
                    pill
                  >
                    {req.isApproved === 1
                      ? "APPROVED"
                      : req.isApproved === -1
                      ? "REVISIONS"
                      : "PENDING"}
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
          </Container>
          <ModalUpdateComp show={show} handleClose={handleClose} compReq={selectedCompReq} />
          <Modal size="sm" show={smShow} onHide={() => setSmShow(false)} aria-labelledby="example-modal-sizes-title-sm">
            <Modal.Header closeButton>
              <Modal.Title id="modal-update-forbidden">Update Forbidden!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Requirement is already approved. Cannot update.</Modal.Body>
          </Modal>
        </>
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default CompStatus;
