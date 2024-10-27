import React, { useEffect, useState, useMemo } from "react";
import { getAllStudents, getAllInstructors } from "../../features/apiCalls";
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
import ModalEditStudent from "./ModalEditStudent";
import NavbarRoot from "./NavbarRoot";
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

function EditStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedTeamleader, setSelectedTeamleader] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedBay, setSelectedBay] = useState(null);
  const [instructors, setInstructors] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsResult, instructorsResult] = await Promise.all([
        getAllStudents(),
        getAllInstructors(),
      ]);
      setStudents(studentsResult.data.result);
      setInstructors(instructorsResult);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setShow(false);
    fetchData(); // Refetch data when modal is closed
  };

  const handleUpdateStudent = (student) => {
    setSelectedStudent(student);
    setShow(true);
  };

  const calculateStudentYear = (startClinicYear) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed,
    return currentYear - startClinicYear + (currentMonth > 5 ? 5 : 4); //Semester starts in June, so if it's after May, the student is in the next year
  };

  const teamleaderOptions = useMemo(
    () => [
      { label: "All", value: null },
      ...Array.from(
        new Set(students.map((student) => student.teamleaderEmail))
      ).map((teamleaderEmail) => {
        const instructor = instructors.find(
          (inst) => inst.instructorEmail === teamleaderEmail
        );
        return {
          label: instructor ? instructor.instructorName : teamleaderEmail,
          value: teamleaderEmail,
        };
      }),
    ],
    [students, instructors]
  );

  const yearOptions = useMemo(
    () => [
      { label: "All", value: null },
      ...Array.from(
        new Set(
          students.map((student) =>
            calculateStudentYear(student.startClinicYear)
          )
        )
      )
      .sort((a, b) => a - b) // Sort in ascending order
      .map((year) => ({
        label: `${year}th Year`,
        value: year,
      })),
    ],
    [students]
  );

  const floorOptions = useMemo(
    () => [
      { label: "All", value: null },
      ...Array.from(new Set(students.map((student) => student.floor))).map(
        (floor) => ({
          label: `Floor ${floor}`,
          value: floor,
        })
      ),
    ],
    [students]
  );

  const bayOptions = useMemo(
    () => [
      { label: "All", value: null },
      ...Array.from(new Set(students.map((student) => student.bay)))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })) // Sort in natural ascending order
        .map((bay) => ({
          label: bay,
          value: bay,
        })),
    ],
    [students]
  );
  
  

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          (selectedTeamleader === null ||
            student.teamleaderEmail === selectedTeamleader) &&
          (selectedYear === null ||
            calculateStudentYear(student.startClinicYear) === selectedYear) &&
          (selectedFloor === null || student.floor === selectedFloor) &&
          (selectedBay === null || student.bay === selectedBay)
      ),
    [students, selectedTeamleader, selectedYear, selectedFloor, selectedBay]
  );

  const getInstructorName = (teamleaderEmail) => {
    const instructor = instructors.find(
      (inst) => inst.instructorEmail === teamleaderEmail
    );
    return instructor ? instructor.instructorName : "Not Found";
  };

  return (
    <>
      <NavbarRoot />
      <Container fluid="md">
        <Row>
          <Col className="text-center">
            <h1 className="mt-3">Edit Students</h1>
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
          <div className="d-flex justify-content-center">
            <Alert variant="danger">{error}</Alert>
          </div>
        ) : (
          <>
            <Row className="d-flex justify-content-center">
              <div
                className="justify-content-center"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  margin: 20,
                }}
              >
                <Col xs={12} sm={6} md={3} className="mb-2">
                  <DropdownButton
                    id="teamleader-dropdown"
                    title={
                      selectedTeamleader !== null
                        ? teamleaderOptions.find(
                            (option) => option.value === selectedTeamleader
                          )?.label
                        : "Select Team Leader"
                    }
                    variant="dark"
                    className="me-2"
                  >
                    {teamleaderOptions.map((option) => (
                      <Dropdown.Item
                        key={option.value}
                        active={selectedTeamleader === option.value}
                        onClick={() => setSelectedTeamleader(option.value)}
                      >
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
                <Col xs={12} sm={6} md={3} className="mb-2">
                  <DropdownButton
                    id="year-dropdown"
                    title={
                      selectedYear !== null
                        ? yearOptions.find(
                            (option) => option.value === selectedYear
                          )?.label
                        : "Select Year"
                    }
                    variant="dark"
                    className="me-2"
                  >
                    {yearOptions.map((option) => (
                      <Dropdown.Item
                        key={option.value}
                        active={selectedYear === option.value}
                        onClick={() => setSelectedYear(option.value)}
                      >
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
                <Col xs={12} sm={6} md={3} className="mb-2">
                  <DropdownButton
                    id="floor-dropdown"
                    title={
                      selectedFloor !== null
                        ? floorOptions.find(
                            (option) => option.value === selectedFloor
                          )?.label
                        : "Select Floor"
                    }
                    variant="dark"
                    className="me-2"
                  >
                    {floorOptions.map((option) => (
                      <Dropdown.Item
                        key={option.value}
                        active={selectedFloor === option.value}
                        onClick={() => setSelectedFloor(option.value)}
                      >
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
                <Col xs={12} sm={6} md={3} className="mb-2">
                  <DropdownButton
                    id="bay-dropdown"
                    title={
                      selectedBay !== null
                        ? bayOptions.find(
                            (option) => option.value === selectedBay
                          )?.label
                        : "Select Bay"
                    }
                    variant="dark"
                    className="me-2"
                  >
                    {bayOptions.map((option) => (
                      <Dropdown.Item
                        key={option.value}
                        active={selectedBay === option.value}
                        onClick={() => setSelectedBay(option.value)}
                      >
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
              </div>
            </Row>
            <ListGroup>
              {filteredStudents.map((student) => (
                <ListGroup.Item
                  key={student.studentId}
                  onClick={() => handleUpdateStudent(student)}
                  className="myDiv"
                >
                  <Row>
                    <Col xs={12} sm={6} md={3}>
                      <strong>ID:</strong> {student.studentId} <br />
                      <strong>Name:</strong> {student.title}{" "}
                      {student.studentName}
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <strong>Year:</strong>{" "}
                      {calculateStudentYear(student.startClinicYear)}th
                      <br />
                      <strong>Email:</strong> {student.studentEmail}
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <strong>Status:</strong> {student.status} <br />
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <strong>Team Leader:</strong>{" "}
                      {getInstructorName(student.teamleaderEmail)} <br />
                      <strong>Bay:</strong> {"M" + student.floor}
                      {student.bay}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            {selectedStudent && (
              <ModalEditStudent
                show={show}
                handleClose={handleClose}
                student={selectedStudent}
              />
            )}
          </>
        )}
      </Container>
      <br />
    </>
  );
}

export default EditStudents;
