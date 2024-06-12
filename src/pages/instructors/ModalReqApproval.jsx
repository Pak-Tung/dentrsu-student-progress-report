import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, Form, InputGroup, Container, Row, Col } from "react-bootstrap";
import Cookies from "js-cookie";
import { getReqByDivision, updateDivReqById } from "../../features/apiCalls";

function ModalReqApproval({
  show,
  handleClose,
  divisionReq,
  division,
  studentName,
}) {
  //console.log("divisionInRA", division);
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [options, setOptions] = useState([]);
  const [unitRSU, setUnitRSU] = useState("unit_RSU");
  const [unitDC, setUnitDC] = useState("unit_DC");

  useEffect(() => {
    const fetchData = async () => {
      const response = await getReqByDivision(division);
      const { error } = response;
      //console.log("resultMRA", response);
      if (error) {
        console.log(error);
      } else {
        setOptions(response);
      }
    };
    fetchData();
  }, [division]);

  const [selectedOption, setSelectedOption] = useState("");

  const [formData, setFormData] = useState({
    studentEmail: userEmail,
    bookNo: "",
    pageNo: "",
    type: "",
    area: "",
    req_RSU: 0,
    req_DC: 0,
    HN: "",
    patientName: "",
    isApproved: 0,
    instructorEmail: "",
    approvedDate: "",
    id: 0,
    unit_RSU: "",
    unit_DC: "",
    note: "",
  });

  useEffect(() => {
    if (divisionReq) {
      //console.log("divisionReq", divisionReq);
      setFormData({
        studentEmail: userEmail,
        bookNo: divisionReq.bookNo || "",
        pageNo: divisionReq.pageNo || "",
        type: divisionReq.type || "",
        area: divisionReq.area || "",
        req_RSU: divisionReq.req_RSU || 0,
        req_DC: divisionReq.req_DC || 0,
        HN: divisionReq.HN || "",
        patientName: divisionReq.patientName || "",
        isApproved: 0,
        instructorEmail: divisionReq.instructorEmail || "",
        approvedDate: addSevenHoursToISOString(new Date().toISOString()),
        id: divisionReq.id || 0,
        unit_RSU: divisionReq.unit_RSU || "",
        unit_DC: divisionReq.unit_DC || "",
        note: divisionReq.note || "",
      });
      setSelectedOption(divisionReq.type);

      setUnitRSU(divisionReq.req_RSU > 0 ? divisionReq.unit_RSU : "");
      setUnitDC(divisionReq.req_DC > 0 ? divisionReq.unit_DC : "");
    }
  }, [divisionReq, userEmail]);

  const addSevenHoursToISOString = useCallback((dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);
    return date.toISOString().slice(0, 19).replace("T", " ");
  }, []);

  const handleChange = (event) => {
    const selected = event.target.value;
    setSelectedOption(selected);
    //console.log("options", options);

    const item = options.find((d) => d.type === selected);

    if (item && item.req_RSU > 0) {
      setUnitRSU(item.unit_RSU);
    } else {
      setUnitRSU("");
    }

    if (item && item.req_DC > 0) {
      setUnitDC(item.unit_DC);
    } else {
      setUnitDC("");
    }

    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleApprove = async (event) => {
    event.preventDefault();
    try {
      const updatedFormData = { ...formData, isApproved: 1 };
      //console.log("form data", JSON.stringify(updatedFormData));
      const response = await updateDivReqById(
        divisionReq.id,
        updatedFormData,
        division
      );
      //console.log("responseAPI", response);
      if (response.affectedRows === 1) {
        alert("Form approved successfully!");
        //window.location.reload();
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleRevision = async (event) => {
    event.preventDefault();
    try {
      const updatedFormData = { ...formData, isApproved: -1 };
      //console.log("form data", JSON.stringify(updatedFormData));
      const response = await updateDivReqById(
        divisionReq.id,
        updatedFormData,
        division
      );
      //console.log("responseAPI", response);
      if (response.affectedRows === 1) {
        alert("Form sent back for revision!");
        //window.location.reload();
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Requirement Approval</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {divisionReq && (
          <Form>
            <Container fluid>
              <Row className="justify-content-center">
                <Col>
                  <div className="d-flex justify-content-center">
                     <h3>Student: {studentName}</h3>
                  </div>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="bookNo">Book No:</InputGroup.Text>
                    <Form.Control
                      placeholder="Requirement Book No."
                      aria-label="bookNo"
                      aria-describedby="bookNo"
                      name="bookNo"
                      value={formData.bookNo}
                      onInput={handleInput}
                      disabled
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="pageNo">Page No:</InputGroup.Text>
                    <Form.Control
                      placeholder="Requirement Page No."
                      aria-label="pageNo"
                      aria-describedby="pageNo"
                      name="pageNo"
                      value={formData.pageNo}
                      onInput={handleInput}
                      disabled
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col>
                  <Form.Group controlId="Form.SelectCustom" className="mb-3">
                    <Form.Select
                      name="type"
                      value={selectedOption}
                      onChange={handleChange}
                      disabled
                    >
                      {options.map((option) => (
                        <option key={option.id} value={option.type}>
                          {option.type}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="area">Area/Teeth</InputGroup.Text>
                    <Form.Control
                      placeholder="Tooth/Sextant/Quadrant/Full Mouth/Case"
                      aria-label="area"
                      aria-describedby="area"
                      name="area"
                      value={formData.area}
                      required
                      onInput={handleInput}
                      disabled
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="requirement-rsu">
                      Requirement (RSU)
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="0"
                      aria-label="requirement-rsu"
                      aria-describedby="requirement-rsu"
                      disabled
                      name="req_RSU"
                      value={formData.req_RSU}
                      onInput={handleInput}
                      required
                    />
                    <InputGroup.Text id="unit-rsu">{unitRSU}</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="requirement-dc">
                      Requirement (DC)
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="0"
                      aria-label="requirement-dc"
                      aria-describedby="requirement-dc"
                      disabled
                      name="req_DC"
                      value={formData.req_DC}
                      onInput={handleInput}
                      required
                    />
                    <InputGroup.Text id="unit-rsu">{unitDC}</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col md={4}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="HN" style={{ fontSize: "11pt" }}>
                      HN
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="0000000"
                      aria-label="HN"
                      aria-describedby="HN"
                      name="HN"
                      value={formData.HN}
                      onInput={handleInput}
                      disabled
                    />
                  </InputGroup>
                </Col>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      id="patientName"
                      style={{ fontSize: "11pt" }}
                    >
                      Pt Name
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Name of Patient"
                      aria-label="patientName"
                      aria-describedby="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onInput={handleInput}
                      disabled
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="d-grid gap-2">
                    <Button
                      style={{
                        backgroundColor: "#339933",
                        borderColor: "#339933",
                      }}
                      size="lg"
                      onClick={handleApprove}
                    >
                      Approve
                    </Button>
                  </div>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <InputGroup.Text id="note-label">
                      Revision required
                    </InputGroup.Text>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Message to Student"
                      aria-label="note"
                      aria-describedby="note"
                      name="note"
                      value={formData.note || ""}
                      onInput={handleInput}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <div className="d-grid gap-2">
                  <Button
                    style={{
                      backgroundColor: "#6600cc",
                      borderColor: "#6600cc",
                    }}
                    size="lg"
                    onClick={handleRevision}
                  >
                    Sent Back for Revision
                  </Button>
                </div>
              </Row>
            </Container>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalReqApproval;
