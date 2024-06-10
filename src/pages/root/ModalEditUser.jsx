// import { React, useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   InputGroup,
//   Form,
//   Modal,
// } from "react-bootstrap";
// import { updateUserById } from "../../features/apiCalls";

// function ModalEditUser({ show, handleClose, user }) {
//   console.log("user", user);
//   const [validated, setValidated] = useState(false);

//   const [formData, setFormData] = useState({
//     id: "",
//     email: "",
//     role: "",
//   });

//   useEffect(() => {
//     setFormData({
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     });
//   }, [user]);

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
//       const response = await updateUserById(user.id, formData);
//       console.log("responseAPI", response);
//       if (response.data.affectedRows === 1) {
//         alert("Edit User successfully!");
//         handleClose();
//       }
//     } catch (error) {
//       console.error("Edit User failed!", error);
//     }
//   };

//   return (
//     <>
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit User</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form noValidate validated={validated} onSubmit={handleSubmit}>
//             <Container>
//               <Row>
//                 <Col>
//                   <h5>Edit User</h5>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="id">User ID</InputGroup.Text>
//                     <Form.Control
//                       type="number"
//                       name="id"
//                       placeholder="User ID"
//                       value={formData.id}
//                       readOnly
//                     />
//                   </InputGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="email">Email</InputGroup.Text>
//                     <Form.Control
//                       type="email"
//                       name="email"
//                       placeholder="Enter email"
//                       onChange={handleInput}
//                       value={formData.email}
//                       required
//                       readOnly
//                     />
//                   </InputGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <Form.Select
//                     aria-label="Role"
//                     onChange={handleInput}
//                     name="role"
//                   >
//                     <option value={formData.role}>{formData.role}</option>
//                     <option value="root">root</option>
//                     <option value="admin">admin</option>
//                     <option value="instructor">instructor</option>
//                     <option value="student">student</option>
//                   </Form.Select>
//                   <InputGroup className="mb-3">
//                     <InputGroup.Text id="role">Role</InputGroup.Text>
//                     <Form.Control
//                       type="text"
//                       name="role"
//                       placeholder="Enter role"
//                       onChange={handleInput}
//                       value={formData.role}
//                       required
//                     />
//                   </InputGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <Button variant="outline-dark" type="submit">
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

// export default ModalEditUser;

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  Modal,
} from "react-bootstrap";
import { updateUserById } from "../../features/apiCalls";

function ModalEditUser({ show, handleClose, user }) {
  console.log("user", user);
  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user]);

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
      const response = await updateUserById(user.id, formData);
      console.log("user.id", user.id);
      console.log("formData", formData);
      console.log("responseAPI", response);
      if (response.data.affectedRows === 1) {
        alert("Edit User successfully!");
        handleClose();
      }
    } catch (error) {
      console.error("Edit User failed!", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Container>
            <Row>
              <Col>
                <h5>Edit User</h5>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="id">User ID</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="id"
                    placeholder="User ID"
                    value={formData.id}
                    readOnly
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="email">Email</InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    onChange={handleInput}
                    value={formData.email}
                    required
                    readOnly
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="role">Role</InputGroup.Text>
                  <Form.Select
                    aria-label="Role"
                    onChange={handleInput}
                    name="role"
                    value={formData.role}
                  >
                    <option value="root">root</option>
                    <option value="admin">admin</option>
                    <option value="instructor">instructor</option>
                    <option value="student">student</option>
                  </Form.Select>
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
  );
}

export default ModalEditUser;
