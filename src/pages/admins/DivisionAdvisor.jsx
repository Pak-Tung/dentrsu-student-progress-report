import React, { useState, useEffect, useCallback } from "react";
import NavbarAdmin from "./NavbarAdmin";
import { Container, Row, Col, ListGroup, Spinner } from "react-bootstrap";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import { getInstructorsByDivision } from "../../features/apiCalls";
import ModalManageAdvisor from "./ModalManageAdvisor";

function DivisionAdvisor() {
  const [division, setDivision] = useState(() => {
    const savedDivision = localStorage.getItem("division");
    return savedDivision ? JSON.parse(savedDivision) : "";
  });

  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getInstructorsByDivision(division);
        setInstructors(result);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [division]);

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

  const handleInstructorSelect = (instructor) => {
    setSelectedInstructor(instructor);
    handleShow();
  };

  const handleClose = () => {
    setShow(false);
    
  }
  const handleShow = () => setShow(true);

  return (
    <>
      <NavbarAdmin />
      <Container fluid="md">
        <Row>
          <Col className="d-flex justify-content-center mb-4">
            <h4 className="mb-4">{fullNameDivision(division)} Advisor</h4>
          </Col>
        </Row>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <ListGroup>
            {instructors.map((instructor, index) => (
              <ListGroup.Item
                key={index}
                onClick={() => handleInstructorSelect(instructor)}
                className="myDiv"
              >
                <Row>
                  <Col md={3}></Col>
                  <Col md={4}>
                    <h5>
                      {index + 1}. {instructor.title} {instructor.instructorName}
                    </h5>
                  </Col>
                  <Col md={2}>
                    <p>
                      Teamleader: {"  "}
                      <strong>
                        M{instructor.floor}
                        {instructor.bay}
                      </strong>
                    </p>
                  </Col>
                  <Col md={3}></Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>
      {selectedInstructor && (
        <ModalManageAdvisor
          show={show}
          handleClose={handleClose}
          instructor={selectedInstructor}
        />
      )}
    </>
  );
}

export default DivisionAdvisor;
