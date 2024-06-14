import { React, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllUsers } from "../../features/apiCalls";
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
  Alert,
} from "react-bootstrap";
import ModalAddNewStudent from "./ModalAddNewStudent";
import ModalAddNewInstructor from "./ModalAddNewInstructor";
import ModalEditUser from "./ModalEditUser";
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
    { id: 1, role: "admin" },
    { id: 2, role: "instructor" },
    { id: 3, role: "student" },
    { id: 4, role: "root" },
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
      setSelectedUserRole("Select User Type"); // Reset dropdown
      setValidated(false); // Reset validation state
      if (formData.role === "student") {
        handleShow(); // Assuming this opens the modal
      } else if (
        formData.role === "instructor" ||
        formData.role === "admin" ||
        formData.role === "root"
      ) {
        handleShowInstructor(); // Assuming this opens the modal
      } else {
        alert("Something went wrong.");
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

  const [selectedUser, setSelectedUser] = useState({});

  const handleEditUser = async (user) => {
    //console.log("user", user);
    setSelectedUser(user);
    setShowEditUser(true);
  };

  return (
    <>
      <NavbarRoot />
      <br />
      <Container fluid="md">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="d-flex justify-content-center">
            <Col md={6}>
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
                  <Dropdown.Item key={userRole.id} eventKey={userRole.role}>
                    {userRole.role}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
            <Col md={2}>
              <Button variant="outline-dark" type="submit">
                Add User
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <br />
      <Container fluid="md">
        <div className="d-flex justify-content-center mb-4">
          <h4>All Users</h4>
        </div>
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
          </>
        )}
      </Container>
      <ModalAddNewStudent
        show={show}
        handleClose={handleClose}
        email={formData.email}
      />
      <ModalAddNewInstructor
        show={showInstructor}
        handleClose={handleClose}
        email={formData.email}
        role={formData.role}
      />
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
