import { React, useState, useCallback, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { updateMinReqById } from "../../features/apiCalls";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  Modal,
} from "react-bootstrap";

function ModalEditDivReq({ show, handleClose, divReq }) {
    console.log(divReq);
  const [division, setDivision] = useState(() => {
    const savedDivision = localStorage.getItem("division");
    return savedDivision ? JSON.parse(savedDivision) : "";
  });

  const [formData, setFormData] = useState({
    id: divReq.id,
    division: divReq.division,
    type: divReq.type,
    req_RSU: divReq.req_RSU,
    unit_RSU: divReq.unit_RSU,
    req_DC: divReq.req_DC,
    unit_DC: divReq.unit_DC,
  });

  useEffect(() => {
    setFormData({
      id: divReq.id,
      division: divReq.division,
      type: divReq.type,
      req_RSU: divReq.req_RSU,
      unit_RSU: divReq.unit_RSU,
      req_DC: divReq.req_DC,
      unit_DC: divReq.unit_DC,
    });
  }, [divReq]);


  const [validated, setValidated] = useState(false);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);
    try {
      const result = await updateMinReqById(formData.id, formData);
      console.log(result);
      if (result.affectedRows === 1) {
        alert("Successfully updated");
        handleClose();
      }
    } catch (err) {
      alert("Failed to update. Please try again later.");
    }
  };

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

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit {fullNameDivision(division)} Requirement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Container>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="id">Req ID</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="id"
                      value={formData.id}
                      readOnly
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="division">Division</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="division"
                      value={formData.division}
                      readOnly
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="type">Type</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="type"
                      placeholder="type"
                      value={formData.type}
                      onChange={handleInput}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="req_RSU">
                      RSU Requirement
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="req_RSU"
                      placeholder="Enter RSU Requirement"
                      value={formData.req_RSU}
                      onChange={handleInput}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="unit_RSU">
                      RSU Requirement Unit
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="unit_RSU"
                      placeholder="Enter RSU Requirement Unit"
                      value={formData.unit_RSU}
                      onChange={handleInput}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="req_DC">
                      DC Requirement
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="req_DC"
                      placeholder="Enter DC Requirement"
                      value={formData.req_DC}
                      onChange={handleInput}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="unit_DC">
                      DC Requirement Unit
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="unit_DC"
                      placeholder="Enter DC Requirement Unit"
                      value={formData.unit_DC}
                      onChange={handleInput}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="outline-dark" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Container>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalEditDivReq;
