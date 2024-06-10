import React, { useState, useEffect } from "react";
import NavbarInstructor from "../../components/NavbarInstructor";
import { Container, Row, Col, ListGroup, Badge, Image } from "react-bootstrap";
import { getStudentByTeamleaderEmail } from "../../features/apiCalls";
import "../../App.css";
import ModalStudent from "./ModalStudent";

function MemberInTeam() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const userEmail = user.email;

  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getStudentByTeamleaderEmail(userEmail);
        console.log("result", result);
        setStudentData(result);
      } catch (err) {
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userEmail]);

  // Sort the student data
  const sortedStudentData = [...studentData].sort((a, b) => {
    return a.startClinicYear - b.startClinicYear;
  });

  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleStudentSelect = async (student) => {
    console.log("student", student);
    setSelectedStudent(student);
    handleShow();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const calculateStudentYear = (startClinicYear) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed
    return currentYear - startClinicYear + (currentMonth > 4 ? 5 : 4);
  };

  return (
    <>
      <NavbarInstructor />
      <Container fluid="md">
        <div className="d-flex justify-content-center mb-4">
          <h4>Member In Team: ({studentData.length} students) </h4>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ListGroup>
            {sortedStudentData.map((student, index) => (
              <ListGroup.Item
                key={index}
                onClick={() => handleStudentSelect(student)}
                className="myDiv"
              >
                <Row>
                  <Col md={2}>
                    <Image
                      src={student.image}
                      roundedCircle
                      fluid
                      width="75"
                      height="75"
                    />
                  </Col>
                  <Col md={6}>
                    <Badge
                      bg={student.status === "Complete" ? "success" : "danger"}
                    >
                      {student.status}
                    </Badge>
                    <h5>
                      {student.studentId} {student.title} {student.studentName}
                    </h5>
                    <p>
                      Email: <strong>{student.studentEmail}</strong>
                    </p>
                  </Col>
                  <Col>
                    <p>
                      Student Year:
                      <strong>
                        {calculateStudentYear(student.startClinicYear)}th
                      </strong>
                    </p>
                    <p>
                      Bay:{" "}
                      <strong>
                        {" "}
                        M{student.floor}
                        {student.bay}
                        {student.unitNumber}
                      </strong>
                    </p>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>
      <ModalStudent
        show={show}
        handleClose={handleClose}
        student={selectedStudent}
      />
    </>
  );
}

export default MemberInTeam;
