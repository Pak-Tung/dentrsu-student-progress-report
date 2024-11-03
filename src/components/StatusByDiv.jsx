import React, { useEffect, useState, useCallback, useContext } from "react";
import { getDivReqByStudentEmail } from "../features/apiCalls";
import "../App.css";
import Cookies from "js-cookie";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Badge,
  Dropdown,
  DropdownButton,
  Modal,
  Alert,
} from "react-bootstrap";
import ModalUpdateReq from "./ModalUpdateReq";
import LoadingComponent from "./LoadingComponent";
import { ThemeContext } from "../ThemeContext";


function StatusByDiv(division) {
  const { theme } = useContext(ThemeContext);
  
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [divisionReq, setDivisionReq] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await getDivReqByStudentEmail(userEmail, division.division);
      const { error } = result;
      //console.log("result", result);
      if (error) {
        setError(error);
      } else {
        setDivisionReq(result);
      }
    } catch (error) {
      setError("Failed to fetch division requirements:", error);
    }finally {
      setLoadingStudent(false);
    }
  }, [userEmail, division.division]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const approvalStatusOptions = [
    { label: "All", value: null },
    { label: "Approved", value: 1 },
    { label: "Revisions Required", value: -1 },
    { label: "Pending", value: 0 },
  ];

  // Extract unique types from divisionReq to populate type dropdown
  const typeOptions = [
    { label: "All", value: null },
    ...Array.from(new Set(divisionReq.map((req) => req.type))).map((type) => ({
      label: type,
      value: type,
    })),
  ];

  // State to hold the selected approval status
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState(null);

  // State to hold the selected type
  const [selectedType, setSelectedType] = useState(null);

  // State to hold the selected operative requirement for updating
  const [selectedDivisionReq, setSelectedDivisionReq] = useState(null);

  // Function to handle updating operative requirement
  const handleUpdateDivisionReq = async (req) => {
    setSelectedDivisionReq(req);
    if (req.isApproved === 1) {
      handleShowSm();
      //alert("Operative Requirement is already approved. Cannot update.");
    } else {
      handleShow();
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => {
    fetchData();
    setShow(false);
  }

  const handleShow = () => setShow(true);

  const [smShow, setSmShow] = useState(false);

  const handleShowSm = () => setSmShow(true);

  return (
    <>
      <Container fluid="md" className={`status-by-div-container ${theme}`}>
        <div
          className="justify-content-center"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: 20,
          }}
        >
          {/* Dropdown to select display group according to approval status */}
          <DropdownButton
            id="approval-status-dropdown"
            title={
              selectedApprovalStatus !== null
                ? approvalStatusOptions.find(
                    (option) => option.value === selectedApprovalStatus
                  ).label
                : "Select Approval Status"
            }
            variant={theme === 'dark' ? 'secondary' : 'dark'}
            className="me-2"
          >
            {approvalStatusOptions.map((option) => (
              <Dropdown.Item
                key={option.value}
                active={selectedApprovalStatus === option.value}
                onClick={() => setSelectedApprovalStatus(option.value)}
              >
                {option.label}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          {/* Dropdown to select display group according to type */}
          <DropdownButton
            id="type-dropdown"
            title={
              selectedType !== null
                ? typeOptions.find((option) => option.value === selectedType)
                    .label
                : "Select Type"
            }
            variant={theme === 'dark' ? 'secondary' : 'dark'}
          >
            {typeOptions.map((option) => (
              <Dropdown.Item
                key={option.value}
                active={selectedType === option.value}
                onClick={() => setSelectedType(option.value)}
              >
                {option.label}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
        <ListGroup>
          {loadingStudent ? (
            <LoadingComponent />
          ) : error ? (
            <div className="d-flex justify-content-center">
              <Alert variant="danger">{error}</Alert>
            </div>
          ) : divisionReq
            .filter(
              (req) =>
                (selectedApprovalStatus === null ||
                  req.isApproved === selectedApprovalStatus) &&
                (selectedType === null || req.type === selectedType)
            )
            .map((req) => (
              <div key={req.id}>
                <ListGroup.Item
                  onClick={() => handleUpdateDivisionReq(req)}
                  className={`myDiv ${theme === 'dark' ? 'bg-dark text-white' : ''}`}
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
                      <strong>db-ID:</strong> {req.id} <br />
                      <strong>Type:</strong> {req.type}
                    </Col>
                    <Col>
                      <strong>Description:</strong> {req.area}
                    </Col>
                    <Col>
                      <strong>RSU:</strong> {req.req_RSU} {req.unit_RSU} <br />
                      <strong>CDA:</strong> {req.req_DC} {req.unit_DC}
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
      </Container>
      <ModalUpdateReq
        show={show}
        handleClose={handleClose}
        divisionReq={selectedDivisionReq}
        division = {division.division}
      />

      <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton className={theme === "dark" ? "bg-dark text-white" : ""}>
          <Modal.Title id="modal-update-forbidden">
            Update Forbidden!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === "dark" ? "bg-dark text-white" : ""}>Requirement is already approved. Cannot update.</Modal.Body>
      </Modal>
    </>
  );
}

export default StatusByDiv;
