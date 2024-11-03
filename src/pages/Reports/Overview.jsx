import React, { useState, useEffect, useContext } from "react";
import { getStudentByEmail, getAllDivisions } from "../../features/apiCalls";
import Cookies from "js-cookie";
import Navbar from "../../components/Navbar";
import { Container, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";
import SumByDiv from "./SumByDiv";
import LoginByEmail from "../../components/LoginByEmail";
import "../../Navbar.css";
import FadeIn from "react-fade-in";
import LoadingComponent from "../../components/LoadingComponent";
import LoadingSuccessComponent from "../../components/LoadingSuccessComponent";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";

function Overview() {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  Cookies.get("user") === undefined
    ? Cookies.set("user", JSON.stringify({}))
    : JSON.parse(Cookies.get("user"));
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [student, setStudent] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDivisionName, setSelectedDivisionName] =
    useState("Select Division");

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

  const handleSelectDivision = (division) => {
    setSelectedDivision(division);
    const selectedDiv = divisions.find((div) => div.shortName === division);
    setSelectedDivisionName(
      selectedDiv ? selectedDiv.fullName : "All Divisions"
    );
  };

  const renderDivisionComponent = () => {
    if (!selectedDivision) {
      return null;
    }
    const divNames = [
      "oper",
      "endo",
      "perio",
      "prosth",
      "diag",
      "radio",
      "sur",
      "ortho",
      "pedo",
    ];
    if (selectedDivision === "all") {
      return (
        <Container fluid>
          {divNames.map((divName) => (
            <React.Fragment key={divName}>
              <SumByDiv division={divName} />
            </React.Fragment>
          ))}
        </Container>
      );
    } else {
      return <SumByDiv division={selectedDivision} key={selectedDivision} />;
    }
  };

  return (
    <>
      {userEmail ? (
        <>
          {success ? (
            <>
              <Navbar sticky="top" />
              <Container
                fluid
                className={`${theme === "dark" ? "container-dark" : ""} px-3`}
              >
                <Row className="d-flex justify-content-center mb-3">
                  <Col xs={12} sm={8} md={6} lg={4} xl={3}>
                    <div className="d-flex justify-content-center">
                      <DropdownButton
                        variant={
                          theme === "dark" ? "outline-light" : "outline-dark"
                        }
                        id="dropdown-basic-button"
                        title={selectedDivisionName}
                        onSelect={handleSelectDivision}
                        className={theme === "dark" ? "text-dark-mode" : ""}
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

                {!selectedDivision && (
                  <Row className="d-flex justify-content-center mb-3">
                    <Col xs={12} className="text-center">
                      <h5>Select division to display</h5>
                    </Col>
                  </Row>
                )}

                {renderDivisionComponent()}

                <br />
              </Container>
            </>
          ) : (
            <FadeIn>
              <div>
                {!loading ? <LoadingComponent /> : <LoadingSuccessComponent />}
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
