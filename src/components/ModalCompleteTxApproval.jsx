import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, Form, InputGroup, Container, Row, Col } from "react-bootstrap";
import { ThemeContext } from "../ThemeContext";
import Cookies from "js-cookie";
import { getAllDivisions, getInstructorsByDivision, updateTreatmentById, getAllStudents } from "../features/apiCalls";


function ModalCompleteTxApproval({ show, handleClose, treatment, onUpdate2 }) {
  const [user, setUser] = useState(() => {
    const cookieUser = Cookies.get("user");
    return cookieUser ? JSON.parse(cookieUser) : {};
  });

  const userEmail = user.email;

  const [divisions, setDivisions] = useState([]);
  const [error, setError] = useState(null);

  const [newTx, setNewTx] = useState({
    id: "",
    txid: "",
    phase: "",
    area: "",
    description: "",
    hn: "",
    note: "",
    division: "",
    startDate: "",
    completeDate: "",
    operatorEmail: "",
    approvedInstructor: "",
    status: 1,
  });

  useEffect(() => {
    if (treatment) {
      setNewTx({
        id: treatment.id || "",
        txid: treatment.txid || "",
        phase: treatment.phase || "",
        area: treatment.area || "",
        description: treatment.description || "",
        hn: treatment.hn || "",
        note: treatment.note || "",
        division: treatment.division || "",
        startDate: treatment.startDate || "",
        completeDate: treatment.completeDate || "",
        operatorEmail: userEmail || "",
        approvedInstructor: treatment.approvedInstructor || "",
        status: 1,
      });
    }
  }, [treatment]);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const result = await getAllDivisions();
        if (result.error) {
          setError(result.error);
        } else {
          setDivisions(result);
        }
      } catch (error) {
        setError("Error fetching divisions: " + error.message);
      }
    };
    fetchDivisions();
  }, []);

  const handleDivisionChange = (e) => {
    const selectedValue = e.target.value;
    setNewTx((prevTx) => ({
      ...prevTx,
      division: selectedValue,
    }));
  };

  const [divisionInstructors, setDivisionInstructors] = useState([]);

  useEffect(() => {
    if (newTx.division) {
      const fetchInstructors = async () => {
        try {
          const result = await getInstructorsByDivision(newTx.division);
          if (result.error) {
            setError(result.error);
          } else {
            setDivisionInstructors(result);
          }
        } catch (error) {
          setError("Error fetching instructors: " + error.message);
        }
      };
      fetchInstructors();
    }
  }, [newTx.division]);

  const handleInstructorChange = (e) => {
    const selectedValue = e.target.value;
    setNewTx((prevTx) => ({
      ...prevTx,
      approvedInstructor: selectedValue,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setNewTx((prevTx) => ({
      ...prevTx,
      [name]: value,
    }));
  };

  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await getAllStudents();
        //console.log(result);
        if (result.error) {
          setError(result.error);
        } else {
           // Sort students by name in ascending order
           const sortedStudents = result.data.result.sort((a, b) => a.studentName.localeCompare(b.studentName));
           setStudents(sortedStudents);
        }
      } catch (error) {
        setError("Error fetching students: " + error.message);
      }
    };
    fetchStudents();
  }, []);

  const handleStudentChange = (e) => {
    const selectedValue = e.target.value;
    setNewTx((prevTx) => ({
      ...prevTx,
      operatorEmail: selectedValue,
    }));
  };





  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle approval logic here
    //console.log("Treatment approval submitted:", newTx);

    try {
      const result = await updateTreatmentById(treatment.id, newTx);
      if (result.error) {
        setError(result.error);
      } else {
        console.log("Treatment approval updated:", result);
        onUpdate2({
          ...newTx,
          status: 1,
          approvedInstructor: newTx.approvedInstructor,
          startDate: newTx.startDate,
          completeDate: newTx.completeDate,
        });
      }
    } catch (error) {
      setError("Error updating treatment approval: " + error.message);
    }

    handleClose(); // Close the modal after approval
  };





  return (
    <Modal show={show} onHide={handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>Complete Treatment Approval</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Area</Form.Label>
            <Form.Control
              type="text"
              name="area"
              value={newTx.area}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={newTx.description}
              disabled
            />
          </Form.Group>
        
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Start date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              onChange={handleDateChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Completed date</Form.Label>
            <Form.Control
              type="date"
              name="completeDate"
              onChange={handleDateChange}
              required
            />
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
              <Form.Label column md={3}>
                Select Operator
              </Form.Label>
              <Col md={9}>
                <Form.Select
                  name="operatorEmail"
                  value={newTx.operatorEmail}
                  onChange={handleStudentChange}
                  required
                >
                  <option value="" disabled>
                    Select Operator
                  </option>
                  {students.map((student) => (
                    <option key={student.studentId} value={student.studentEmail}>
                      {student.studentName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

          <Form.Group as={Row} className="mb-3">
              <Form.Label column md={3}>
                Select Division
              </Form.Label>
              <Col md={9}>
                <Form.Select
                  name="division"
                  value={newTx.division}
                  onChange={handleDivisionChange}
                  required
                >
                  <option value="" disabled>
                    Select Division
                  </option>
                  {divisions.map((division) => (
                    <option key={division.id} value={division.shortName}>
                      {division.fullName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={3}>
                Select Instructor
              </Form.Label>
              <Col md={9}>
                <Form.Select
                  name="approvedInstructor"
                  value={newTx.approvedInstructor}
                  onChange={handleInstructorChange}
                  required
                >
                  <option value="" disabled>
                    Select Instructor
                  </option>
                  {divisionInstructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.instructorEmail}>
                      {instructor.instructorName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>




          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCompleteTxApproval;
