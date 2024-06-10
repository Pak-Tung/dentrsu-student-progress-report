import React, { useEffect, useState, useCallback } from "react";
import { getAllInstructors, getAllDivisions } from "../../features/apiCalls";
import "../../App.css";
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
  Spinner,
} from "react-bootstrap";
import ModalEditInstructor from "./ModalEditInstructor";
import NavbarRoot from "./NavbarRoot";

function EditInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAllInstructors();
      setInstructors(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    fetchData(); // Refetch data when modal is closed
  };

  const handleUpdateInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setShow(true);
  };

  const [selectedDivision, setSelectedDivision] = useState(null);

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

  // Extract unique division from instructor.division to populate type dropdown
  const divisionOptions = [
    { label: "All", value: null },
    ...Array.from(new Set(instructors.map((instructor) => instructor.division))).map((division) => ({
      label: fullNameDivision(division),
      value: division,
    })),
  ];

  return (
    <>
      <NavbarRoot />
      <Container fluid="md">
        <Row>
          <Col className="text-center">
            <h1 className="mt-3">Edit Instructors</h1>
          </Col>
        </Row>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            <div
              className="justify-content-center"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: 20,
              }}
            >
              {/* Dropdown to select display group according to division */}
              <DropdownButton
                id="division-dropdown"
                title={
                  selectedDivision !== null
                    ? divisionOptions.find(
                        (option) => option.value === selectedDivision
                      )?.label
                    : "Select Division"
                }
                variant="dark"
                className="me-2"
              >
                {divisionOptions.map((option) => (
                  <Dropdown.Item
                    key={option.value}
                    active={selectedDivision === option.value}
                    onClick={() => setSelectedDivision(option.value)}
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
            <ListGroup>
              {instructors
                .filter(
                  (instructor) =>
                    selectedDivision === null ||
                    instructor.division === selectedDivision
                )
                .map((instructor) => (
                  <div>
                    <ListGroup.Item
                      key={instructor.id}
                      onClick={() => handleUpdateInstructor(instructor)}
                      className="myDiv"
                    >
                      <Row>
                        <Col>
                          <strong>ID:</strong> {instructor.id} <br />
                          <strong>Name:</strong> {instructor.title}{" "}
                          {instructor.instructorName}
                        </Col>
                        <Col>
                          <strong>Division:</strong> {fullNameDivision(instructor.division)}
                          <br />
                          <strong>Email:</strong> {instructor.instructorEmail}
                        </Col>
                        <Col>
                          <strong>Role:</strong> {instructor.permission} <br />
                          {instructor.teamleader === 1 && (
                            <>
                              <strong>Teamleader:</strong>{" "}
                              {instructor.teamleader === 1
                                ? "M" + instructor.floor + instructor.bay
                                : "N/A"}{" "}
                              <br />
                            </>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </div>
                ))}
            </ListGroup>
            {selectedInstructor && (
              <ModalEditInstructor
                show={show}
                handleClose={handleClose}
                instructor={selectedInstructor}
              />
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default EditInstructors;
