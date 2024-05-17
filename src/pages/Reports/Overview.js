import { React, useState, useEffect } from "react";
import { getStudentByEmail, getAllDivisions } from "../../features/apiCalls";
import Cookies from "js-cookie";
import GoogleLogin from "../../components/GoogleLogin";
import Navbar from "../../components/Navbar";
import { Container, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";
import SumOper from "./SumOper";
import SumEndo from "./SumEndo";
import SumPerio from "./SumPerio";
import SumProsth from "./SumProsth";

function Overview() {
  Cookies.get("user") === undefined
    ? Cookies.set("user", JSON.stringify({}))
    : console.log("User email", Cookies.get("user"));
  const user = JSON.parse(Cookies.get("user"));
  console.log("User in Profile", user);
  const userEmail = user.email;
  console.log("UserEmail", userEmail);

  const [student, setStudent] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("all");

  useEffect(() => {
    const fetchStudentData = async () => {
      const result = await getStudentByEmail(userEmail);
      const { error } = result;
      const data = result[0];
      console.log("result", result[0]);
      if (error) {
        console.log(error);
      } else {
        if (data) {
          console.log(data);
          setStudent(data);
        } else {
          console.log("Data is undefined");
        }
      }
    };
    fetchStudentData();
  }, [userEmail]);

  useEffect(() => {
    const fetchDivisionsData = async () => {
      const result = await getAllDivisions();
      const { error } = result;

      if (error) {
        console.log(error);
      } else {
        const shortName = result.map((item) => item.shortName);
        console.log("resultDivisions", shortName);
        setDivisions(result);
      }
    };
    fetchDivisionsData();
  }, []);

  const handleSelectDivision = (division) => {
    setSelectedDivision(division);
  };

  const renderDivisionComponent = () => {
    if (selectedDivision === "all") {
      return (
        <>
          <Container fluid="md">
            <Row className="d-flex justify-content-center">
              <SumOper />
            </Row>
            <br />
            <Row className="d-flex justify-content-center">
              <SumEndo />
            </Row>
            <br />
            <Row className="d-flex justify-content-center">
              <SumPerio />
            </Row>
            <br />
            <Row className="d-flex justify-content-center">
              <SumProsth />
            </Row>
            {/* Add other division components here */}
          </Container>
        </>
      );
    }
    switch (selectedDivision) {
      case "oper":
        return (
          <Row>
            <SumOper />
          </Row>
        );
      case "endo":
        return (
          <Row>
            <SumEndo />
          </Row>
        );
      case "perio":
        return (
          <Row>
            <SumPerio />
          </Row>
        );
      case "prosth":
        return (
          <Row>
            <SumProsth />
          </Row>
        );
      // Add more cases for other divisions as needed
      default:
        return (
          <Row>
            <SumOper />
          </Row>
        );
    }
  };

  return (
    <>
      {userEmail !== undefined ? (
        <>
          <Navbar />
          <div
            className="justify-content-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <h2>
              {student.studentId +
                " " +
                student.title +
                " " +
                student.studentName}
            </h2>
          </div>
          <Container fluid="md">
            <Row className="d-flex justify-content-center">
              <Col>
                <div className="d-flex justify-content-center">
                  <DropdownButton
                    id="dropdown-basic-button"
                    title="Select Division"
                    onSelect={handleSelectDivision}
                  >
                    <Dropdown.Item eventKey="all">All Divisions</Dropdown.Item>
                    {divisions.map((division) => (
                      <Dropdown.Item
                        key={division.id}
                        eventKey={division.shortName}
                      >
                        {division.fullName}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </div>
              </Col>
            </Row>
            <br />
            <Row className="d-flex justify-content-center">
              <div className="d-flex justify-content-center">
                {renderDivisionComponent()}
              </div>
            </Row>
          </Container>
        </>
      ) : (
        <>
          <div>
            <GoogleLogin />
          </div>
        </>
      )}
    </>
  );
}

export default Overview;
