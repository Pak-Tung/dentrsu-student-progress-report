import { React, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllUsers, insertUser } from "../../features/apiCalls";
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
import LoadingComponent from "../../components/LoadingComponent";
import LoginByEmail from "../../components/LoginByEmail";
import Cookies from "js-cookie";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });
  const email = Cookies.get("email");

  const [inputEmail, setInputEmail] = useState(
    "Only '@rsu.ac.th' email is allowed"
  );
  const [selectedUserRole, setSelectedUserRole] = useState("Select User Type");

  const userRoles = [
    { id: 1, role: "admin" },
    { id: 2, role: "instructor" },
    { id: 3, role: "student" },
    { id: 4, role: "root" },
    { id: 5, role: "supervisor" },
    { id: 6, role: "ptBank" },
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
      if (formData.role === "student" ||
        formData.role === "instructor" ||
        formData.role === "admin" ||
        formData.role === "root" ||
        formData.role === "supervisor" ||
        formData.role === "ptBank"
      ) {
        await insertUser(formData);
        alert("Add New Student successfully!");
      } else {
        alert("Something went wrong.");
      }
    }
    setValidated(true);
  };

  const handleAddInstructor = () => {
    handleShowInstructor(); // opens the create instructor modal
  };

  const handleAddStudent = () => {
    handleShow(); // opens the create student modal
  };

  const handleAddPtBank = () => {
    alert("Add Patient Bank Staff");
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
      {email ? (
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
              <Row>
                <Col md={3}>Add user first then add user role&#8658;</Col>
                <Col md={4}>
                  <Button variant="outline-dark" onClick={handleAddInstructor}>
                    Add Instructor/Admin/Supervisor/Patient Bank Staff
                  </Button>
                </Col>
                <Col md={4}>
                  <Button variant="outline-dark" onClick={handleAddStudent}>
                    Add Student
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
              <LoadingComponent />
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
      ) : (
        <LoginByEmail />
      )}
    </>
  );
}

export default UserManagement;
