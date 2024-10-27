import React, { useState, useEffect, useCallback } from "react";
import NavbarAdmin from "./NavbarAdmin";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getInstructorsByDivision } from "../../features/apiCalls";
import ModalManageAdvisor from "./ModalManageAdvisor";
import * as loadingData from "../../components/loading.json";
import * as successData from "../../components/success.json";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import Cookies from "js-cookie";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function DivisionAdvisor() {
  const [division, setDivision] = useState(() => {
    const savedDivision = Cookies.get("division");
    return savedDivision ? savedDivision : "";
  });

  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getInstructorsByDivision(division);
        setInstructors(result);
      } catch (err) {
        console.error("Failed to fetch instructors:", err);
        setError("Failed to fetch instructors. Please try again later.");
      } finally {
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
  };

  const handleShow = () => setShow(true);

  return (
    <>
      <NavbarAdmin />
      <Container fluid>
        <Row className="justify-content-center mb-4">
          <Col className="text-center">
            <h4 className="mb-4">{fullNameDivision(division)} Advisor</h4>
          </Col>
        </Row>
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
          <Row className="justify-content-center">
            <Alert variant="danger">{error}</Alert>
          </Row>
        ) : (
          <ListGroup>
            {instructors.map((instructor, index) => (
              <ListGroup.Item
                key={index}
                onClick={() => handleInstructorSelect(instructor)}
                className="myDiv"
              >
                <Row>
                  <Col md={2}></Col>
                  <Col md={4}>
                    <h5>
                      {index + 1}. {instructor.title}{" "}
                      {instructor.instructorName}
                    </h5>
                  </Col>
                  <Col md={4}>
                    <p>
                      Teamleader:{" "}
                      <strong>
                        M{instructor.floor}
                        {instructor.bay}
                      </strong>
                    </p>
                  </Col>
                  <Col md={2}></Col>
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
