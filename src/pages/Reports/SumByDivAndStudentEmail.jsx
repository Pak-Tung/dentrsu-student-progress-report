import React, { useEffect, useState, useContext } from "react";
import { getDivReqByStudentEmail } from "../../features/apiCalls";
import { Container, Alert } from "react-bootstrap";
import LoadingComponent from "../../components/LoadingComponent";
import "../../DarkMode.css";
import { ThemeContext } from "../../ThemeContext";
import ReportPerioReq from "./ReportPerioReq";
import ReportOperReq from "./ReportOperReq";
import ReportEndoReq from "./ReportEndoReq";
import ReportProsthReq from "./ReportProsthReq";
import ReportDiagReq from "./ReportDiagReq";
import ReportRadioReq from "./ReportRadioReq";
import ReportSurReq from "./ReportSurReq";
import ReportOrthoReq from "./ReportOrthoReq";
import ReportPedoReq from "./ReportPedoReq";

function SumByDivAndStudentEmail({ division, studentEmail }) {
  const { theme } = useContext(ThemeContext);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [error, setError] = useState(null);
  const [rqm, setRqm] = useState([]);

  // Fetch requirement data by student email and division
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDivReqByStudentEmail(studentEmail, division);
        setRqm(result);
      } catch (error) {
        setError(`Error fetching data: ${error.message || error}`);
      } finally {
        setLoadingStudent(false);
      }
    };
    fetchData();
  }, [studentEmail, division]);

  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";

  return (
    <Container fluid className={containerClass}>
      {loadingStudent ? (
        <LoadingComponent />
      ) : error ? (
        <div className="d-flex justify-content-center">
          <Alert variant="danger" className={alertClass}>
            {error}
          </Alert>
        </div>
      ) : division === "oper" ? (
        <ReportOperReq rqm={rqm} />
      ) : division === "endo" ? (
        <ReportEndoReq rqm={rqm} />
      ) : division === "perio" ? (
        <ReportPerioReq rqm={rqm} />
      ) : division === "prosth" ? (
        <ReportProsthReq rqm={rqm} />
      ) : division === "diag" ? (
        <ReportDiagReq rqm={rqm} />
      ) : division === "radio" ? (
        <ReportRadioReq rqm={rqm} />
      ) : division === "ortho" ? (
        <ReportOrthoReq rqm={rqm} />
      ) : division === "pedo" ? (
        <ReportPedoReq rqm={rqm} />
      ) : division === "sur" ? (
        <ReportSurReq rqm={rqm} />
      ) : (
        <div>
          <p>Unknown division: {division}</p>
        </div>
      )}
    </Container>
  );
}

export default SumByDivAndStudentEmail;
