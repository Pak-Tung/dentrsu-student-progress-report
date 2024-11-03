import React, { useEffect, useState, useCallback } from "react";
import { getAllInstructors } from "../../features/apiCalls";
import "../../App.css";
import "../../Navbar.css";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Dropdown,
  DropdownButton,
  Alert,
} from "react-bootstrap";
import ModalEditInstructor from "./ModalEditInstructor";
import NavbarRoot from "./NavbarRoot";
import LoadingComponent from "../../components/LoadingComponent";
import LoginByEmail from "../../components/LoginByEmail";
import Cookies from "js-cookie";


function EditInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = Cookies.get("email");
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
      diag: "Oral Medicine & Occlusion",
      radio: "Radiology",
      sur: "Oral Surgery",
      pedo: "Pediatric Dentistry",
      ortho: "Orthodontic",
      ptBank: "Patient Bank",
      admin: "Admin",
      root: "Root",
    };
    return divisionMap[division] || "";
  }, []);

  // Extract unique division from instructor.division to populate type dropdown
  const divisionOptions = [
    { label: "All", value: null },
    ...Array.from(
      new Set(instructors.map((instructor) => instructor.division))
    ).map((division) => ({
      label: fullNameDivision(division),
      value: division,
    })),
  ];

  return (
    <>
      {email ? (
        <>
          <NavbarRoot />
          <Container fluid="md">
            <Row>
              <Col className="text-center">
                <h1 className="mt-3">Edit Instructors</h1>
              </Col>
            </Row>
            {loading ? (
              <LoadingComponent />
            ) : error ? (
              <div className="d-flex justify-content-center">
                <Alert variant="danger">{error}</Alert>
              </div>
            ) : (
              <>
                <Row className="d-flex justify-content-center">
                  <Col xs={12} sm={6} md={4} className="mb-2">
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
                  </Col>
                </Row>
                <ListGroup>
                  {instructors
                    .filter(
                      (instructor) =>
                        selectedDivision === null ||
                        instructor.division === selectedDivision
                    )
                    .map((instructor) => (
                      <ListGroup.Item
                        key={instructor.id}
                        onClick={() => handleUpdateInstructor(instructor)}
                        className="myDiv"
                      >
                        <Row>
                          <Col xs={12} sm={6} md={3}>
                            <strong>ID:</strong> {instructor.id} <br />
                            <strong>Name:</strong> {instructor.title}{" "}
                            {instructor.instructorName}
                          </Col>
                          <Col xs={12} sm={6} md={3}>
                            <strong>Division:</strong>{" "}
                            {fullNameDivision(instructor.division)}
                            <br />
                            <strong>Email:</strong> {instructor.instructorEmail}
                          </Col>
                          <Col xs={12} sm={6} md={3}>
                            <strong>Role:</strong> {instructor.permission}{" "}
                            <br />
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
                    ))}
                </ListGroup>
                <br />
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
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default EditInstructors;
