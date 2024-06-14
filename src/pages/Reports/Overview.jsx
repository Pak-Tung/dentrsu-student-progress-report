import React, { useState, useEffect } from "react";
import { getStudentByEmail, getAllDivisions } from "../../features/apiCalls";
import Cookies from "js-cookie";
import Navbar from "../../components/Navbar";
import { Container, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";
import SumByDiv from "./SumByDiv";
import LoginByEmail from "../../components/LoginByEmail";
import "../../Navbar.css";
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

const defaultOptions2 = {
  loop: true,
  autoplay: true,
  animationData: successData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function Overview() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize user data from cookies
  Cookies.get("user") === undefined
    ? Cookies.set("user", JSON.stringify({}))
    : console.log("User email", Cookies.get("user"));
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  // State hooks for managing data
  const [student, setStudent] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedDivisionName, setSelectedDivisionName] =
    useState("Select Division");

  // Fetch student data based on email
  useEffect(() => {

      const fetchStudentData = async () => {
        const result = await getStudentByEmail(userEmail);
        const { error } = result;
        const data = result[0];
        if (error) {
          console.log(error);
        } else {
          if (data) {
            setStudent(data);
            setLoading(true);
            setTimeout(() => {
              setSuccess(true);
            }, 1200);
          } else {
            console.log("Data is undefined");
          }
        }
      };
      fetchStudentData();

  }, [userEmail]);

  // Fetch all divisions data
  useEffect(() => {
    const fetchDivisionsData = async () => {
      const result = await getAllDivisions();
      const { error } = result;

      if (error) {
        console.log(error);
      } else {
        setDivisions(result);
      }
    };
    fetchDivisionsData();
  }, []);

  // Handle division selection from the dropdown
  const handleSelectDivision = (division) => {
    setSelectedDivision(division);
    const selectedDiv = divisions.find((div) => div.shortName === division);
    setSelectedDivisionName(
      selectedDiv ? selectedDiv.fullName : "All Divisions"
    );
  };

  // Render division components based on selected division
  const renderDivisionComponent = () => {
    const divNames = [
      "oper",
      "endo",
      "perio",
      "prosth",
      "diag",
      "radio",
      "sur",
      "pedo",
      "ortho",
    ];
    if (selectedDivision === "all") {
      return (
        <Container fluid="md">
          {divNames.map((divName) => (
            <React.Fragment key={divName}>
              <Row className="d-flex justify-content-center">
                <SumByDiv division={divName} />
              </Row>
              <br />
            </React.Fragment>
          ))}
        </Container>
      );
    } else {
      return (
        <Container fluid="md">
          <Row className="d-flex justify-content-center">
            <SumByDiv division={selectedDivision} key={selectedDivision} />
          </Row>
        </Container>
      );
    }
  };

  return (
    <>
      {userEmail !== undefined ? (
        <>
          {success ? (
            <>
              <Navbar />
              <br />
              <Container fluid="md">
                <Row className="d-flex justify-content-center">
                  <Col>
                    <div className="d-flex justify-content-center">
                      <DropdownButton
                        variant="outline-dark"
                        id="dropdown-basic-button"
                        title={selectedDivisionName}
                        onSelect={handleSelectDivision}
                      >
                        <Dropdown.Item eventKey="all">
                          All Divisions
                        </Dropdown.Item>
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
                <br />
              </Container>
            </>
          ) : (
            <FadeIn>
              <div>
                {!loading ? (
                  <Container>
                    <Row className="d-flex justify-content-center">
                      <Lottie
                        options={defaultOptions}
                        height={140}
                        width={140}
                      />
                    </Row>
                  </Container>
                ) : (
                  <Container>
                    <Row className="d-flex justify-content-center">
                      <Lottie
                        options={defaultOptions2}
                        height={140}
                        width={140}
                      />
                    </Row>
                  </Container>
                )}
              </div>
            </FadeIn>
          )}
        </>
      ) : (
        <>
          <div>
            <LoginByEmail />
          </div>
        </>
      )}
    </>
  );
}

export default Overview;
