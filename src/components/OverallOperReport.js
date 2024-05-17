import React, { useEffect, useState } from "react";
import { getOperReqByStudentEmail } from "../features/apiCalls";
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
} from "react-bootstrap";
import ModalOper from "./ModalOper";

function OverallOperReport(division) {
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [operReq, setOperReq] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getOperReqByStudentEmail(userEmail);
      const { error } = result;
      console.log("result", result);
      if (error) {
        console.log(error);
      } else {
        setOperReq(result);
      }
    };
    fetchData();
  }, [userEmail]);

  const approvalStatusOptions = [
    { label: "All", value: null },
    { label: "Approved", value: 1 },
    { label: "Revisions Required", value: -1 },
    { label: "Pending", value: 0 },
  ];

  // Extract unique types from operReq to populate type dropdown
  const typeOptions = [
    { label: "All", value: null },
    ...Array.from(new Set(operReq.map((req) => req.type))).map((type) => ({
      label: type,
      value: type,
    })),
  ];

  // State to hold the selected approval status
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState(null);

  // State to hold the selected type
  const [selectedType, setSelectedType] = useState(null);

  // State to hold the selected operative requirement for updating
  const [selectedOperReq, setSelectedOperReq] = useState(null);

  // Function to handle updating operative requirement
  const handleUpdateOperReq = async (req) => {
    setSelectedOperReq(req);
    if (req.isApproved === 1) {
      handleShowSm();
      //alert("Operative Requirement is already approved. Cannot update.");
    } else {
      handleShow();
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [smShow, setSmShow] = useState(false);

  const handleShowSm = () => setSmShow(true);

  return (
    <>
      <Container fluid="md">
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
            variant="dark"
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
            variant="dark"
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
          {operReq
            .filter(
              (req) =>
                (selectedApprovalStatus === null ||
                  req.isApproved === selectedApprovalStatus) &&
                (selectedType === null || req.type === selectedType)
            )
            .map((req) => (
              <div key={req.id}>
                <ListGroup.Item
                  onClick={() => handleUpdateOperReq(req)}
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
                      ? "REVISIONS REQUIRED"
                      : "PENDING"}
                  </Badge>
                  <Row>
                    <Col>
                      <strong>ID:</strong> {req.id} <br />
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
                  </Row>
                </ListGroup.Item>
              </div>
            ))}
        </ListGroup>
      </Container>
      <ModalOper
        show={show}
        handleClose={handleClose}
        operReq={selectedOperReq}
      />

      <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal-update-forbidden">
            Update Forbidden!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Requirement is already approved. Cannot update.</Modal.Body>
      </Modal>
    </>
  );
}

export default OverallOperReport;