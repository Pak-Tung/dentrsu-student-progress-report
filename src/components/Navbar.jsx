import React, { useContext, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import Navbar from "react-bootstrap/Navbar";
import "../Navbar.css";
import "../DarkMode.css";
import { ThemeContext } from "../ThemeContext";
import {
  getDivReqByStudentEmail,
  getCompcaseReqByStudentEmail,
} from "../features/apiCalls";
import { Badge } from "react-bootstrap";

function NavbarStudent() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const [showNotificationDot, setShowNotificationDot] = useState(false);
  const [showCompletionNotificationDot, setShowCompletionNotificationDot] =
    useState(false);
  const [showApprovalNotificationDot, setShowApprovalNotificationDot] =
    useState(false);

  const divisions = [
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

  useEffect(() => {
    const savedUser = Cookies.get("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      Cookies.set("user", JSON.stringify({ email: "" }));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.email) {
          let completedCasesNotificationNeeded = false;
          let approvalNotificationNeeded = false;

          // Check for requirements needing submission
          for (const division of divisions) {
            const reqs = await getDivReqByStudentEmail(user.email, division);

            if (reqs && reqs.length > 0) {
              for (const req of reqs) {
                // For "Approval Status" notification dot
                if (req.isApproved === -1) {
                  approvalNotificationNeeded = true;
                }
              }
            }

            // Break early if both notifications are needed
            if (approvalNotificationNeeded) {
              break;
            }
          }

          // Check for completed cases needing approval
          const completedCases = await getCompcaseReqByStudentEmail(user.email);
          //console.log("completedCases", completedCases);
          if (completedCases && completedCases.length > 0) {
            for (const caseItem of completedCases) {
              //console.log("caseItem", caseItem.isApproved);
              if (caseItem.isApproved === -1) {
                completedCasesNotificationNeeded = true;
                break;
              }

              // Break early if both notifications are needed
              if (completedCasesNotificationNeeded) {
                break;
              }
            }
          }

          setShowApprovalNotificationDot(
            approvalNotificationNeeded || completedCasesNotificationNeeded
          );
          setShowNotificationDot(approvalNotificationNeeded);
          setShowCompletionNotificationDot(completedCasesNotificationNeeded);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.email]);

  return (
    <Navbar
      expand="md"
      className={`navbar navbar-expand-lg navbar-${theme} bg-${theme}`}
    >
      <div className="logo-navbar-div">
        <Navbar.Brand href="/">
          <img
            src={
              theme === "light" ? "/logo_navbar.png" : "/logo_navbar_dark.png"
            }
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="DentRSU Connect"
          />
        </Navbar.Brand>
      </div>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto w-100 justify-content-between">
          <NavDropdown title="Patients" id="nav-patients" className="flex-fill">
            <NavDropdown.Item href="/allPatients">
              All My Patients
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Submission" id="nav-submit" className="flex-fill">
            <NavDropdown.Item href="/reqSubmit" className="position-relative">
              Requirements
              {showNotificationDot && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle p-1 border border-light rounded-circle"
                  style={{ zIndex: 1 }}
                >
                  <span className="visually-hidden">New alerts</span>
                </Badge>
              )}
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compSubmit">
              Completed Cases
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="Approval Status"
            id="nav-status"
            className="flex-fill"
          >
            <NavDropdown.Item href="/reqStatus" className="position-relative">
              <span>
                Requirements
                {showApprovalNotificationDot && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle p-1 border border-light rounded-circle"
                    style={{ zIndex: 1 }}
                  >
                    <span className="visually-hidden">New alerts</span>
                  </Badge>
                )}
              </span>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compReport">
              <span>
                Completed Cases
                {showCompletionNotificationDot && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-3 start-100 translate-middle p-1 border border-light rounded-circle"
                    style={{ zIndex: 1 }}
                  >
                    <span className="visually-hidden">New alerts</span>
                  </Badge>
                )}
              </span>
            </NavDropdown.Item>
          </NavDropdown>
          {showApprovalNotificationDot && (
            <Badge
              pill
              bg="danger"
              className="position-absolute top-1 start-56 translate-middle p-1 border border-light rounded-circle"
              style={{ zIndex: 1 }}
            >
              <span className="visually-hidden">New alerts</span>
            </Badge>
          )}
          <NavDropdown title="Overview" id="nav-overview" className="flex-fill">
            <NavDropdown.Item href="/overview">Requirements</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/compOverview">
              Completed Cases
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/checkStatus">Radar Chart</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Profile" id="nav-profile" className="flex-fill">
            <NavDropdown.Item href="/">Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={toggleTheme}>
              Switch light/dark theme
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarStudent;
