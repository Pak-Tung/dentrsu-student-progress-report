import { React, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAllUsers,
  insertUser,
  updateUserById,
} from "../../features/apiCalls";
import NavbarRoot from "./NavbarRoot";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  DropdownButton,
  Dropdown,
  InputGroup,
  Form,
} from "react-bootstrap";
import ModalAddNewStudent from "./ModalAddNewStudent";
import ModalAddNewInstructor from "./ModalAddNewInstructor";
import ModalEditUser from "./ModalEditUser";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });

  const [inputEmail, setInputEmail] = useState(
    "Only '@rsu.ac.th' email is allowed"
  );
  const [selectedUserRole, setSelectedUserRole] = useState("Select User Type");

  const userRoles = [
    { id: 1, role: "Admin" },
    { id: 2, role: "Instructor" },
    { id: 3, role: "Student" },
    { id: 4, role: "Root" },
  ];

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const result = await getAllUsers();
        setUsers(result.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsersData();
  }, []);

  const handleSelectUserRole = (event) => {
    setSelectedUserRole(event);
    setFormData((prevState) => ({
      ...prevState,
      role: event,
    }));
  };

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
    } else {
      try {
        const response = await insertUser(formData);
        console.log("responseAPI", response);
        if (response.name === "AxiosError") {
          alert(response.request.responseText);
          window.location.reload();
        } else if (response.data.affectedRows === 1) {
          alert("Add New User successfully!");
          // Clear the form after successful submission
          setFormData({
            email: "",
            role: "",
          });
          setSelectedUserRole("Select User Type"); // Reset dropdown
          setValidated(false); // Reset validation state
          if (formData.role === "Student") {
            handleShow(); // Assuming this opens the modal
          } else if (
            formData.role === "Instructor" ||
            formData.role === "Admin" ||
            formData.role === "Root"
          ) {
            handleShowInstructor(); // Assuming this opens the modal
          } else {
            window.location.reload();
          }
        } else {
          alert("Something went wrong.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
    setValidated(true);
  };

  const [show, setShow] = useState(false);
  const [showInstructor, setShowInstructor] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);

  const handleClose = () => {
    setShow(false);
    setShowInstructor(false);
    setShowEditUser(false);
    window.location.reload();
  };
  const handleShow = () => setShow(true);
  const handleShowInstructor = () => setShowInstructor(true);
  const handleShowEditUser = () => setShowEditUser(true);

  const [selectedUser, setSelectedUser] = useState({});

  const handleEditUser = async (user) => {
    console.log("user", user);
    setSelectedUser(user);
    setShowEditUser(true);
  };

  return (
    <>
      <NavbarRoot />
      <Container fluid="md">
        <div className="d-flex justify-content-center mb-4">
          <h4>All Users</h4>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <>
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col md={2}> User ID </Col>
                  <Col md={4}>
                    <strong> User Email</strong>
                  </Col>
                  <Col md={2}>
                    <strong> Role</strong>
                  </Col>
                  <Col md={2}></Col>
                  <Col md={2}>
                    <strong></strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {users.map((user) => (
                <ListGroup.Item key={user.id}>
                  <Row>
                    <Col md={2}>{user.id}</Col>
                    <Col md={4}>{user.email}</Col>
                    <Col md={2}>{user.role}</Col>
                    <Col md={2}>
                      <Button
                        variant="outline-dark"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit User Role
                      </Button>
                    </Col>
                    <Col md={2}> </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <br />
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Container fluid="md">
                <Row className="d-flex justify-content-center">
                  <Col md={4}>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="email">User Email:</InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder={inputEmail}
                        aria-label="email"
                        aria-describedby="email"
                        name="email"
                        required
                        onInput={handleInput}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <DropdownButton
                      variant="outline-dark"
                      id="dropdown-basic-button"
                      title={selectedUserRole}
                      onSelect={handleSelectUserRole}
                    >
                      <Dropdown.Item eventKey="Select User Type">
                        Select User Type
                      </Dropdown.Item>
                      {userRoles.map((userRole) => (
                        <Dropdown.Item
                          key={userRole.id}
                          eventKey={userRole.role}
                        >
                          {userRole.role}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  </Col>
                  <Col md={4}>
                    <Button variant="outline-dark" type="submit">
                      Add User
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Form>
          </>
        )}
      </Container>
      <ModalAddNewStudent show={show} handleClose={handleClose} />
      <ModalAddNewInstructor show={showInstructor} handleClose={handleClose} />
      {selectedUser && (
        <ModalEditUser
          show={showEditUser}
          handleClose={handleClose}
          user={selectedUser}
        />
      )}
    </>
  );
}

export default UserManagement;
