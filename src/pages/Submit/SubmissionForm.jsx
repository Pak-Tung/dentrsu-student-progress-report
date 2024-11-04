import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import {
  getReqByDivision,
  insertDivisionReq,
  getStudentByEmail,
} from "../../features/apiCalls";
import { getInstructorsByDivision } from "../../features/apiTL";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "../../App.css";
import Cookies from "js-cookie";
import { ThemeContext } from "../../ThemeContext";

const InputGroupField = ({
  id,
  label,
  placeholder,
  name,
  value,
  onChange,
  disabled,
  required,
  className,
}) => (
  <InputGroup className="mb-3">
    <InputGroup.Text id={id} className={className}>
      {label}:
    </InputGroup.Text>
    <Form.Control
      placeholder={placeholder}
      aria-label={label.toLowerCase()}
      aria-describedby={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={className}
    />
  </InputGroup>
);

const SubmissionForm = ({ division }) => {
  const { theme } = useContext(ThemeContext);
  const user = JSON.parse(Cookies.get("user"));
  const userEmail = user.email;

  const [options, setOptions] = useState([]);
  const [optionsInstructor, setOptionsInstructor] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [unitRSU, setUnitRSU] = useState("unit_RSU");
  const [unitDC, setUnitDC] = useState("unit_CDA");
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    studentEmail: userEmail,
    type: "",
    area: "",
    req_RSU: 0,
    unit_RSU: "",
    req_DC: 0,
    unit_DC: "",
    HN: "",
    patientName: "",
    isApproved: 0,
    instructorEmail: "",
    approvedDate: "",
    bookNo: 0,
    pageNo: 0,
    note: "",
  });
  const [divisionInstructor, setDivisionInstructor] = useState("");
  const [divisionInstructorName, setDivisionInstructorName] = useState("");

  const recallStatusOptions = [
    { id: 1, value: "Completed recheck" },
    { id: 2, value: "Completed recall" },
    { id: 3, value: "Only recall" },
    { id: 4, value: "N/A" },
  ];

  const [selectedRecallStatus, setSelectedRecallStatus] = useState("");

  const handleChangeRecallStatus = (event) => {
    const { name, value } = event.target;
    setSelectedRecallStatus(value);
    setRecall(value);

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const divisionMap = useMemo(
    () => ({
      oper: "Operative",
      endo: "Endodontic",
      perio: "Periodontic",
      prosth: "Prosthodontic",
      diag: "Diagnostic",
      radio: "Radiology",
      sur: "Oral Surgery",
      pedo: "Pediatric Dentistry",
      ortho: "Orthodontic",
    }),
    []
  );

  const fullNameDivision = useCallback(
    (division) => {
      return divisionMap[division] || "";
    },
    [divisionMap]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqResponse, instructorResponse, studentResponse] =
          await Promise.all([
            getReqByDivision(division),
            getInstructorsByDivision(division),
            getStudentByEmail(userEmail),
          ]);
        setOptions(reqResponse);
        setOptionsInstructor(instructorResponse);

        const studentData = studentResponse[0];
        setDivisionInstructor(studentData[`${division}InstructorEmail`]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [division, userEmail]);

  useEffect(() => {
    if (divisionInstructor) {
      const instructor = optionsInstructor.find(
        (item) => item.instructorEmail === divisionInstructor
      );
      if (instructor) {
        setDivisionInstructorName(instructor.instructorName);
        setFormData((prevState) => ({
          ...prevState,
          instructorEmail: divisionInstructor,
        }));
      } else {
        setDivisionInstructorName("Instructor Not Found");
      }
    }
  }, [divisionInstructor, optionsInstructor]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedOption(value);

    const item = options.find((d) => d.type === value);
    const reqRSU = item?.req_RSU || 0;
    const reqDC = item?.req_DC || 0;

    setUnitRSU(reqRSU > 0 ? item.unit_RSU : "");
    setUnitDC(reqDC > 0 ? item.unit_DC : "");

    if (name === "type" && division === "perio") {
      setType(value);
      if (value === "SRP 1st exam" || value === "OHI 1st exam") {
        setSelectedRecallStatus("N/A");
      } else if (value === "SRP 2nd exam" || value === "OHI 2nd exam") {
        setSelectedRecallStatus("N/A");
      } else {
        setSelectedRecallStatus("");
      }
    }

    if (name === "type" && division === "sur") {
      if (
        value === "Aseptic station" ||
        value === "Suture station" ||
        value === "Vital sign station" ||
        value === "IANB exam" ||
        value === "Impact (model)"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 0,
        }));
        setDisableSurArea(false);
        setShowSurReq(true);
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "pageNo" && division === "perio") {
      setSeverity(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const updatedFormData = {
          ...formData,
          unit_RSU: unitRSU,
          unit_DC: unitDC,
        };
        console.log("response", updatedFormData);
        const response = await insertDivisionReq(updatedFormData, division);

        if (response.insertId > 0 && response.affectedRows > 0) {
          alert("Form submitted successfully!");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
    setValidated(true);
  };

  const themeClass = theme === "dark" ? "form-control-dark" : "";

  const labelPageNo = (division) => {
    if (division === "perio") {
      return "Severity";
    } else {
      return "Requirement Page No";
    }
  };

  const labelPageNoPlaceholder = (division) => {
    if (division === "perio") {
      return "Severity";
    } else {
      return "Page No. (if not available, enter 0)";
    }
  };

  /******Calculate Oper ****************/
  const [showOperReq, setShowOperReq] = useState(false);

  useEffect(() => {
    if (division === "oper") {
      setFormData((prevState) => ({
        ...prevState,
        req_RSU: 0,
        req_DC: 0,
      }));

      if (
        selectedOption === "Exam class II" ||
        selectedOption === "Exam class V"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 0,
        }));
      } else if (
        selectedOption === "Oper chart" ||
        selectedOption === "Recall completed case" ||
        selectedOption === "Recall any"
      ) {
        setShowOperReq(true);
      } 
    }
  }, [selectedOption, division]);

  /*******End of Oper Calculate ************/
  
  useEffect(() => {
    if (division === "endo") {
      

      if (
        selectedOption === "RCT Anterior or premolar" ||
        selectedOption === "Exam RCT"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 1,
        }));
      } else if (
        selectedOption === "Emergency RCT" ||
        selectedOption === "Talk case" ||
        selectedOption === "RCT Molar" ||
        selectedOption === "Recall 6 months"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 0,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0,
          req_DC: 0,
        }));
      }
    }
  }, [selectedOption, division]);

  /*****Endo Calculate ******/


  /****End of Endo Calculate ******/

  //**********Calculate RSU and DC requirements of Perio division ***************/
  //****Note: Complexities were recorded at req_RSU column, type of recall at area,  */
  const [severity, setSeverity] = useState(0);
  const [recall, setRecall] = useState(0);
  const [type, setType] = useState("");

  useEffect(() => {
    if (division === "perio") {
      calculatePerioRequirements(severity, type, recall);
    }
  }, [type, severity, recall, division]);

  const calculatePerioRequirements = (severity, type, recall) => {
    //console.log('calculatePerioRequirements', severity, type);
    let complexity_RSU = 0;
    let cases_DC = 0;

    if (type === "Case G" && recall === "Completed recall") {
      complexity_RSU = severity / 0.8;
      cases_DC = 1;
    } else if (type === "Case P" && recall === "Completed recall") {
      complexity_RSU = severity / 0.5;
      cases_DC = 1;
    } else {
      complexity_RSU = 0;
      cases_DC = 0;
    }

    setFormData((prevState) => ({
      ...prevState,
      req_RSU: complexity_RSU,
      req_DC: cases_DC,
      ...(recall === "Only recall" && { req_DC: 1 }),
      ...((type === "SRP 1st exam" || type === "OHI 1st exam") && {
        req_RSU: 1,
      }),
      ...((type === "SRP 2nd exam" || type === "OHI 2nd exam") && {
        req_DC: 1,
      }),
    }));
  };

  //**********End of calculate perio requirements *******************************/

  //*********Prosth Condition ***********************/
  const [showProsthReq, setShowProsthReq] = useState(false);
  const [showProsthPt, setShowProsthPt] = useState(true);

  useEffect(() => {
    if (division === "prosth") {
      if (selectedOption === "CD (Upper)" || selectedOption === "CD (Lower)") {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 1,
        }));
        setShowProsthReq(false);
        setShowProsthPt(true);
      } else if (
        selectedOption === "Exam design RPD" ||
        selectedOption === "Exam crown preparation"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 0,
        }));
        setShowProsthReq(true);
        setShowProsthPt(false);
      } else if(
        selectedOption === "MRPD" ||
        selectedOption === "ARPD" ||
        selectedOption === "Crown" ||
        selectedOption === "Post Core Crown" ||
        selectedOption === "Bridge 3 units"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0,
          req_DC: 0,
        }));
        setShowProsthReq(false);
        setShowProsthPt(true);
      }
    }
  }, [selectedOption, division]);

  //*****End of prosth condition ******************/

  //*****Diag Condition *************************/
  const [disableDiagRSU, setDisableDiagRSU] = useState(false);
  const [disableDiagCDA, setDisableDiagCDA] = useState(false);

  useEffect(() => {
    if (division === "diag") {
      if(selectedOption === "Complete case examination"){
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 1,
        }));
        setDisableDiagRSU(false);
        setDisableDiagCDA(false);
      } else if (
        selectedOption === "Complete splint" ||
        selectedOption === "Recall cases splint"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 0,
        }));
        setDisableDiagRSU(false);
        setDisableDiagCDA(true);
      } else if (
        selectedOption === "Assistant" ||
        selectedOption === "CPC or Journal club"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0.5,
          req_DC: 0,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0,
          req_DC: 1,
        }));
      }
    }
  }, [selectedOption, division]);

  //*****End of Diag Condition ******************/

  //*********Radio Condition ***********************/
  const [disableRadioArea, setDisableRadioArea] = useState(false);

  useEffect(() => {
    if (division === "radio") {
      if (
        selectedOption === "Periapical radiograph" ||
        selectedOption === "Bitewing radiograph" ||
        selectedOption === "Extraoral and Special technique radiograph" ||
        selectedOption === "Film interpretation"
      ) {
        setDisableRadioArea(false);
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 0,
        }));
      } else if (
        selectedOption === "Full mouth periapical radiograph" ||
        selectedOption === "Journal club"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 0,
        }));
        setDisableRadioArea(true);
      } else {
        setDisableRadioArea(false);
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0,
          req_DC: 1,
        }));
      }
    }
  }, [selectedOption, division]);

  //*********End of Radio Condition ***********************/

  //*********Sur Condition ***********************/
  const [disableSurArea, setDisableSurArea] = useState(false);
  const [showSurReq, setShowSurReq] = useState(false);

  useEffect(() => {
    if (division === "sur") {
      if (
        selectedOption === "Aseptic station" ||
        selectedOption === "Suture station" ||
        selectedOption === "Vital sign station" ||
        selectedOption === "IANB exam" ||
        selectedOption === "Impact (model)"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 0,
        }));
        setDisableSurArea(true);
        setShowSurReq(true);
      } else if (
        selectedOption === "Extraction" ||
        selectedOption === "Impact"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 1,
        }));
        setDisableSurArea(false);
        setShowSurReq(true);
      } else if (
        selectedOption === "Exam: extraction (RSU)" ||
        selectedOption === "Exam: impact (RSU)"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 0,
        }));
        setDisableSurArea(false);
        setShowSurReq(true);
      } else if (
        selectedOption === "Exam: extraction (CDA)" ||
        selectedOption === "Exam: impact (CDA)"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0,
          req_DC: 1,
        }));
        setDisableSurArea(false);
        setShowSurReq(true);
      } else {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0,
          req_DC: 0,
        }));
        setDisableSurArea(true);
        setShowSurReq(false);
      }
    }
  }, [selectedOption, division]);

  //*********End of Sur Condition ***********************/

  //*********Ortho Condition ***********************/

  useEffect(() => {
    if (division === "ortho") {
      if (
        selectedOption === "Charting" ||
        selectedOption === "Photograph taking" ||
        selectedOption === "Impression taking Upper" ||
        selectedOption === "Impression taking Lower" ||
        selectedOption === "Removable appliance" ||
        selectedOption === "Assisting adjust fixed appliance" ||
        selectedOption === "Plaster Pouring" ||
        selectedOption === "Model Trimming"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 0,
        }));
      } else if (
        selectedOption === "Inserting removable appliance" ||
        selectedOption === "Case analysis"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 1,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0,
          req_DC: 0,
        }));
      }
    }
  }, [selectedOption, division, formData]);

  //********End of Ortho Condition ***********************/

  //*********Pedo Condition ***********************/
  const [showPedoReq, setShowPedoReq] = useState(false);
  const [showPedoReqCDA, setShowPedoReqCDA] = useState(false);
  const [disablePedoArea, setDisablePedoArea] = useState(false);

  useEffect(() => {
    if (division === "pedo") {
      if (
        selectedOption ===
          "Comprehensive examination and treatment plan in new patient" ||
        selectedOption ===
          "Comprehensive examination and treatment plan in recall patient" ||
        selectedOption === "Caries risk assessment and Management"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 1,
        }));
        setShowPedoReq(true);
        setDisablePedoArea(true);
      } else if (
        selectedOption === "Photographs and Radiographs" ||
        selectedOption === "Exam Inferior alveolar nerve block injection" ||
        selectedOption === "Exam Rubber dam application in posterior teeth"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 1,
          req_DC: 0,
        }));
        setShowPedoReq(true);
        setDisablePedoArea(true);
      } else if (
        selectedOption === "Sealant" ||
        selectedOption === "Filling" ||
        selectedOption === "Primary molar class II restoration" ||
        selectedOption === "Stainless steel crown in posterior teeth" ||
        selectedOption === "Pulpectomy Step OC and LT or Pulpotomy" ||
        selectedOption === "Pulpectomy Step MI and FRC" ||
        selectedOption === "Extraction"
      ) {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0,
          req_DC: 0,
        }));
        setShowPedoReq(false);
        setDisablePedoArea(false);
        setShowPedoReqCDA(false);
      } else if (selectedOption === "PRR") {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0,
          req_DC: 1,
        }));
        setShowPedoReq(true);
        setShowPedoReqCDA(false);
        setDisablePedoArea(false);
      } else if (selectedOption === "Miscellaneous work") {
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0,
          req_DC: 0,
        }));
        setShowPedoReq(false);
        setShowPedoReqCDA(true);
        setDisablePedoArea(false);
      } else {
        setShowPedoReq(false);
        setFormData((prevState) => ({
          ...prevState,
          req_RSU: 0,
          req_DC: 0,
        }));
      }
    }
  }, [selectedOption, division, formData]);

  //********End of Pedo Condition ***********************/

  return (
    <>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className={theme}
      >
        <Container fluid>
          <Row className="justify-content-center">
            <Col>
              {division === "oper" && (
                <InputGroupField
                  id="bookNo"
                  label="Requirement Book No"
                  placeholder="Book No (if not available, enter 0)"
                  name="bookNo"
                  onChange={handleInput}
                  required
                  className={themeClass}
                />
              )}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col>
              {(division === "oper" ||
                (division === "perio" &&
                  (selectedOption === "Case G" ||
                    selectedOption === "Case P"))) && (
                <InputGroupField
                  id="pageNo"
                  label={labelPageNo(division)}
                  placeholder={labelPageNoPlaceholder(division)}
                  name="pageNo"
                  onChange={handleInput}
                  required
                  className={themeClass}
                />
              )}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col>
              <Form.Group controlId="Form.SelectCustomType" className="mb-3">
                <Form.Select
                  name="type"
                  value={selectedOption}
                  onChange={handleChange}
                  required
                  className={themeClass}
                >
                  <option value="" disabled>
                    Select Type of Work
                  </option>
                  {options.map((option) => (
                    <option key={option.id} value={option.type}>
                      {option.type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {division === "perio"
              ? (selectedOption === "Case G" ||
                  selectedOption === "Case P") && (
                  <Col>
                    <Form.Group
                      controlId="Form.SelectCustomArea"
                      className="mb-3"
                    >
                      <Form.Select
                        name="area"
                        value={selectedRecallStatus}
                        onChange={handleChangeRecallStatus}
                        required
                        className={themeClass}
                      >
                        <option value="" disabled>
                          Select Recall Status
                        </option>
                        {recallStatusOptions.map((option) => (
                          <option key={option.id} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                )
              : division !== "ortho" &&
                division !== "prosth" &&
                division !== "diag" &&
                !disableRadioArea &&
                !disableSurArea &&
                !disablePedoArea &&
                !showOperReq && (
                  <Col>
                    <InputGroupField
                      id="area"
                      label="Area/Teeth-Surface"
                      placeholder="Area / Teeth & Surface / Detail"
                      name="area"
                      onChange={handleInput}
                      required
                      className={themeClass}
                    />
                  </Col>
                )}
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="requirement-rsu" className={themeClass}>
                  Requirement (RSU)
                </InputGroup.Text>
                <Form.Control
                  id="requirement-rsu"
                  label="Requirement (RSU)"
                  placeholder="0"
                  name="req_RSU"
                  value={formData.req_RSU}
                  onChange={handleInput}
                  disabled={
                    unitRSU === "" ||
                    unitRSU === "unit_RSU" ||
                    division === "perio" ||
                    showProsthReq ||
                    showSurReq ||
                    showPedoReq ||
                    disableDiagRSU
                  }
                  required
                  className={themeClass}
                />
                <InputGroup.Text id="unit_rsu" className={themeClass}>
                  {unitRSU}
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="requirement-dc" className={themeClass}>
                  Requirement (CDA)
                </InputGroup.Text>
                <Form.Control
                  id="requirement-dc"
                  label="Requirement (CDA)"
                  placeholder="0"
                  name="req_DC"
                  value={formData.req_DC}
                  onChange={handleInput}
                  disabled={
                    unitDC === "" ||
                    unitDC === "unit_CDA" ||
                    division === "perio" ||
                    showProsthReq ||
                    showPedoReqCDA ||
                    disableDiagCDA
                  }
                  required
                  className={themeClass}
                />
                <InputGroup.Text id="unit_cda" className={themeClass}>
                  {unitDC}
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          {selectedOption !== "CPC or Journal club" &&
            selectedOption !== "Journal club" && 
            showProsthPt && (
              <Row className="justify-content-md-center">
                <Col md={4}>
                  <InputGroupField
                    id="HN"
                    label="HN"
                    placeholder="0000000"
                    name="HN"
                    onChange={handleInput}
                    required
                    className={themeClass}
                  />
                </Col>
                <Col>
                  <InputGroupField
                    id="patientName"
                    label="Pt Name"
                    placeholder="Name of Patient"
                    name="patientName"
                    onChange={handleInput}
                    required
                    className={themeClass}
                  />
                </Col>
              </Row>
            )}
          <Row>
            <Col>
              <InputGroupField
                id="advisor"
                label={`${fullNameDivision(division)} Advisor`}
                placeholder="Name of Advisor"
                name="instructorName"
                value={formData.instructorName || divisionInstructorName}
                onChange={handleInput}
                disabled
                required
                className={themeClass}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputGroupField
                id="advisorEmail"
                label={`${fullNameDivision(division)} Advisor Email`}
                placeholder="Advisor Email"
                name="instructorEmail"
                value={divisionInstructor}
                onChange={handleInput}
                disabled
                required
                className={themeClass}
              />
            </Col>
          </Row>
          <Row>
            <div className="d-grid gap-2">
              <Button
                variant={theme === "dark" ? "secondary" : "dark"}
                size="lg"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Row>
        </Container>
      </Form>
    </>
  );
};

export default SubmissionForm;
