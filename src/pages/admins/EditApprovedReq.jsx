import React, { useState, useEffect, useMemo, useCallback } from "react";
import NavbarAdmin from "./NavbarAdmin";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Alert,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { getDivReqById, updateDivReqById } from "../../features/apiCalls";
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

function EditApprovedReq() {
  const [division, setDivision] = useState(() => {
    const savedDivision = localStorage.getItem("division");
    return savedDivision ? JSON.parse(savedDivision) : "";
  });

  const [idInput, setIdInput] = useState("");
  const [reqData, setReqData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDivReqById(idInput, division);
      setReqData(result);
    } catch (err) {
      setError(
        "Failed to fetch minimum requirement data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [division, idInput]);

  useEffect(() => {
    if (idInput) {
      fetchData();
    }
  }, [idInput, fetchData]);

  const handleInput = (event) => {
    setIdInput(event.target.value);
  };

  const retrieveReqById = (event) => {
    event.preventDefault();
    fetchData();
  };

  const sortedReqData = useMemo(() => {
    return Array.isArray(reqData)
      ? reqData.sort((a, b) => a.id - b.id)
      : [reqData];
  }, [reqData]);

  const handleSetStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const reqId = sortedReqData[0].id;
      const updatedReq = {
        ...sortedReqData[0],
        isApproved: 0,
      };
      await updateDivReqById(reqId, updatedReq, division);
      fetchData();
    } catch (err) {
      setError(
        "Failed to update the requirement status. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarAdmin />
      <Container className="mt-5">
        <div className="d-flex justify-content-center mb-4">
          <h2>Edit Approved Requirement</h2>
        </div>
        <Form onSubmit={retrieveReqById}>
          <Row className="d-flex justify-content-center mb-4">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text id="div-id">Requirement Id</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Requirement Id"
                  aria-label="id"
                  aria-describedby="id"
                  value={idInput}
                  onChange={handleInput}
                  required
                />
                <Button type="submit">Fetch</Button>
              </InputGroup>
            </Col>
          </Row>
        </Form>

        {loading ? (
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
        ) : reqData.length === 0 ? (
          <div className="text-center">No data available for the given ID.</div>
        ) : (
          <ListGroup>
            {sortedReqData.map((req) => (
              <div key={req.id}>
                <ListGroup.Item>
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
                      <strong>db-ID:</strong> {req.id} <br />
                      <strong>Type:</strong> {req.type}
                    </Col>
                    <Col>
                      <strong>Area:</strong> {req.area}
                    </Col>
                    <Col>
                      <strong>RSU:</strong> {req.req_RSU} <br />
                      <strong>DC:</strong> {req.req_DC}
                    </Col>
                    <Col>
                      <strong>HN:</strong> {req.HN} <br />
                      <strong>Name:</strong> {req.patientName}
                    </Col>
                    <Col>
                      <strong>Book No:</strong> {req.bookNo} <br />
                      <strong>Page No:</strong> {req.pageNo}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <br />
                <Row className="d-flex justify-content-center mb-4">
                  <Col className="d-flex justify-content-center mb-4">
                    <Button onClick={handleSetStatus}>
                      Set Approve Status to Pending
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </ListGroup>
        )}
      </Container>
    </>
  );
}

export default EditApprovedReq;
