import React, { useEffect, useState, useCallback } from "react";
import { getCompcaseReqByStudentEmail } from "../../features/apiCalls";
import Cookies from "js-cookie";
import { Container, Row, Col, ListGroup, Badge, Modal, Alert } from "react-bootstrap";
import Navbar from "../../components/Navbar";
import ModalUpdateComp from "./ModalUpdateComp";
import "../../pages/CustomStyles.css";
import "../../App.css";
import LoginByEmail from "../../components/LoginByEmail";
import * as loadingData from "../../components/loading.json";
import * as successData from "../../components/success.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function CompStatus() {
  const [loadingStudent, setLoadingStudent] = useState(true);
  
  const [error, setError] = useState(null);
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
      setError("Error fetching data:", error);
    }finally {
      setLoadingStudent(false);
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
            {loadingStudent ? (
            <FadeIn>
              <div>
                <Container>
                  <Row className="d-flex justify-content-center">
                    <Lottie options={defaultOptions} height={140} width={140} />
                  </Row>
                </Container>
              </div>
            </FadeIn>
          ) : error ? (
            <div className="d-flex justify-content-center">
              <Alert variant="danger">{error}</Alert>
            </div>
          ) : (
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
          )}
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
