// import { React, useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { updateStudent, getAllInstructors } from "../../features/apiCalls";
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   InputGroup,
//   Form,
//   Modal,
// } from "react-bootstrap";

// function ModalEditStudent({ show, handleClose, student }) {
//   const [validated, setValidated] = useState(false);

//   const [optionsInstructors, setOptionsInstructors] = useState([]);
//   const [selectedInstructor, setSelectedInstructor] = useState("");

//   useEffect(() => {
//     const fetchInstructors = async () => {
//       try {
//         const response = await getAllInstructors();
//         console.log("responseInstructors", response);
//         setOptionsInstructors(response);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     fetchInstructors();
//   }, []);

//   const [formData, setFormData] = useState({
//     studentEmail: "",
//     studentId: "",
//     title: "",
//     studentName: "",
//     startClinicYear: "",
//     floor: "",
//     bay: "",
//     unitNumber: "",
//     status: "",
//     teamLeaderId: "",
//     teamleaderEmail: "",
//   });

//   useEffect(() => {
//     if (student) {
//       setFormData({
//         studentEmail: student.studentEmail || "",
//         studentId: student.studentId || "",
//         title: student.title || "",
//         studentName: student.studentName || "",
//         startClinicYear: student.startClinicYear || "",
//         floor: student.floor || "",
//         bay: student.bay || "",
//         unitNumber: student.unitNumber || "",
//         status: student.status || "",
//         teamLeaderId: student.teamLeaderId || "",
//         teamleaderEmail: student.teamleaderEmail || "",
//       });
//       setSelectedInstructor(student.teamleaderEmail || "");
//     }
//   }, [student]);

//   const handleInput = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.stopPropagation();
//     }
//     setValidated(true);
//     try {
//       const response = await updateStudent(formData.studentId, formData);
//       console.log("formData.id", formData.id);
//       console.log("responseAPI", response);
//       handleClose();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleChangeInstructor = (event) => {
//     setSelectedInstructor(event.target.value);

//     const instructor = optionsInstructors.find(
//       (instructor) => instructor.instructorEmail === event.target.value
//     );
//     setFormData((prevState) => ({
//       ...prevState,
//       teamleaderEmail: instructor.instructorEmail,
//       teamLeaderId: instructor.id,
//     }));
//   };

//   return (
//     <>
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Student</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form noValidate validated={validated} onSubmit={handleSubmit}>
//             <Container>
//               <Row>
//                 <Col>
//                   <h5>Edit Student</h5>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="instructorEmail">
//                       Email
//                     </InputGroup.Text>
//                     <Form.Control
//                       type="email"
//                       name="studentEmail"
//                       placeholder="Enter email"
//                       onInput={handleInput}
//                       required
//                       value={formData.studentEmail}
//                       readOnly
//                     />
//                   </InputGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="studentId">Student ID</InputGroup.Text>
//                     <Form.Control
//                       type="number"
//                       name="studentId"
//                       placeholder="Enter Student ID"
//                       onInput={handleInput}
//                       required
//                       value={formData.studentId}
//                       readOnly
//                     />
//                   </InputGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="title">Title</InputGroup.Text>
//                     <Form.Control
//                       type="text"
//                       name="title"
//                       placeholder="Enter title"
//                       onInput={handleInput}
//                       required
//                       value={formData.title}
//                     />
//                   </InputGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="studentName">
//                       Student Name
//                     </InputGroup.Text>
//                     <Form.Control
//                       type="text"
//                       name="studentName"
//                       placeholder="Enter student name"
//                       onInput={handleInput}
//                       required
//                       value={formData.studentName}
//                     />
//                   </InputGroup>
//                 </Col>
//               </Row>

//               <Row>
//                 <Col>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="startClinicYear">
//                       Start Clinic Year
//                     </InputGroup.Text>
//                     <Form.Control
//                       type="number"
//                       name="startClinicYear"
//                       placeholder="Enter Start Clinic Year"
//                       onInput={handleInput}
//                       value={formData.startClinicYear}
//                     />
//                   </InputGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col md={12}>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="floor">Floor</InputGroup.Text>
//                     <Form.Control
//                       type="number"
//                       name="floor"
//                       placeholder="Enter floor"
//                       onInput={handleInput}
//                       value={formData.floor}
//                     />
//                   </InputGroup>
//                 </Col>
//                 <Col md={12}>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="bay">Bay</InputGroup.Text>
//                     <Form.Control
//                       type="text"
//                       name="bay"
//                       placeholder="Enter bay"
//                       onInput={handleInput}
//                       value={formData.bay}
//                     />
//                   </InputGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="unitNumber">
//                       Unit Number
//                     </InputGroup.Text>
//                     <Form.Control
//                       type="number"
//                       name="unitNumber"
//                       placeholder="Enter Unit Number"
//                       onInput={handleInput}
//                       required
//                       value={formData.unitNumber}
//                     />
//                   </InputGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="status">Status</InputGroup.Text>
//                     <Form.Control
//                       type="text"
//                       name="status"
//                       placeholder="Enter status (Complete or Incomplete)"
//                       onInput={handleInput}
//                       required
//                       value={formData.status}
//                     />
//                   </InputGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <InputGroup>
//                     <InputGroup.Text id="teamleader">
//                       Team Leader
//                     </InputGroup.Text>
//                     <Form.Select
//                       name="instructorEmail"
//                       value={selectedInstructor}
//                       onChange={handleChangeInstructor}
//                       required
//                     >
//                       <option value="" disabled>
//                         Select Team Leader
//                       </option>
//                       {optionsInstructors.map((option) => (
//                         <option key={option.id} value={option.instructorEmail}>
//                           {option.instructorName}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </InputGroup>
//                 </Col>
//               </Row>
//               <br />
//               <Row>
//                 <Col>
//                   <Button variant="dark" type="submit">
//                     Submit
//                   </Button>
//                 </Col>
//               </Row>
//             </Container>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

// export default ModalEditStudent;

import { React, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { updateStudent, getAllInstructors } from "../../features/apiCalls";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  Modal,
  Alert,
} from "react-bootstrap";

function ModalEditStudent({ show, handleClose, student }) {
  // State hooks
  const [validated, setValidated] = useState(false);
  const [optionsInstructors, setOptionsInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [formData, setFormData] = useState({
    studentEmail: "",
    studentId: "",
    title: "",
    studentName: "",
    startClinicYear: "",
    floor: "",
    bay: "",
    unitNumber: "",
    status: "",
    teamLeaderId: "",
    teamleaderEmail: "",
  });
  const [error, setError] = useState("");

  // Fetch instructors on component mount
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await getAllInstructors();
        setOptionsInstructors(response);
      } catch (err) {
        console.error("Failed to fetch instructors:", err);
      }
    };
    fetchInstructors();
  }, []);

  // Set form data when student prop changes
  useEffect(() => {
    if (student) {
      setFormData({
        studentEmail: student.studentEmail || "",
        studentId: student.studentId || "",
        title: student.title || "",
        studentName: student.studentName || "",
        startClinicYear: student.startClinicYear || "",
        floor: student.floor || "",
        bay: student.bay || "",
        unitNumber: student.unitNumber || "",
        status: student.status || "",
        teamLeaderId: student.teamLeaderId || "",
        teamleaderEmail: student.teamleaderEmail || "",
      });
      setSelectedInstructor(student.teamleaderEmail || "");
    }
  }, [student]);

  // Handle form input changes
  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setValidated(true);
      try {
        await updateStudent(formData.studentId, formData);
        handleClose();
      } catch (err) {
        console.error("Failed to update student:", err);
        setError("An error occurred while updating the student.");
      }
    }
  };

  // Handle instructor selection change
  const handleChangeInstructor = (event) => {
    const selectedEmail = event.target.value;
    setSelectedInstructor(selectedEmail);

    const instructor = optionsInstructors.find(
      (instructor) => instructor.instructorEmail === selectedEmail
    );

    if (instructor) {
      setFormData((prevState) => ({
        ...prevState,
        teamleaderEmail: instructor.instructorEmail,
        teamLeaderId: instructor.id,
      }));
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Container>
            <Row>
              <Col>
                <h5>Edit Student</h5>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="studentEmail">Email</InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="studentEmail"
                    placeholder="Enter email"
                    onInput={handleInput}
                    required
                    value={formData.studentEmail}
                    readOnly
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="studentId">Student ID</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="studentId"
                    placeholder="Enter Student ID"
                    onInput={handleInput}
                    required
                    value={formData.studentId}
                    readOnly
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="title">Title</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    onInput={handleInput}
                    required
                    value={formData.title}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="studentName">Student Name</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="studentName"
                    placeholder="Enter student name"
                    onInput={handleInput}
                    required
                    value={formData.studentName}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="startClinicYear">Start Clinic Year</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="startClinicYear"
                    placeholder="Enter Start Clinic Year"
                    onInput={handleInput}
                    value={formData.startClinicYear}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="floor">Floor</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="floor"
                    placeholder="Enter floor"
                    onInput={handleInput}
                    value={formData.floor}
                  />
                </InputGroup>
              </Col>
              <Col md={12}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="bay">Bay</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="bay"
                    placeholder="Enter bay"
                    onInput={handleInput}
                    value={formData.bay}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="unitNumber">Unit Number</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="unitNumber"
                    placeholder="Enter Unit Number"
                    onInput={handleInput}
                    required
                    value={formData.unitNumber}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="status">Status</InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="status"
                    placeholder="Enter status (Complete or Incomplete)"
                    onInput={handleInput}
                    required
                    value={formData.status}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="teamleader">Team Leader</InputGroup.Text>
                  <Form.Select
                    name="instructorEmail"
                    value={selectedInstructor}
                    onChange={handleChangeInstructor}
                    required
                  >
                    <option value="" disabled>
                      Select Team Leader
                    </option>
                    {optionsInstructors.map((option) => (
                      <option key={option.id} value={option.instructorEmail}>
                        {option.instructorName}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
            <br />
            <Row>
              <Col>
                <Button variant="dark" type="submit">
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
  );
}

export default ModalEditStudent;

