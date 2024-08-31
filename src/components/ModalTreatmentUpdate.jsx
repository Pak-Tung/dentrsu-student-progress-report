import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import {
  getAllDivisions,
  updateTreatmentById,
  insertTxPlan,
  getTxtypesByDivision,
} from "../features/apiCalls";
import ModalCompleteTxApproval from "./ModalCompleteTxApproval";

function ModalTreatmentUpdate({
  show,
  handleClose,
  treatment,
  onUpdate,
  onUpdateNewTx,
}) {
  const { theme } = useContext(ThemeContext);
  const containerClass = theme === "dark" ? "container-dark" : "";
  const alertClass = theme === "dark" ? "alert-dark" : "";
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [error, setError] = useState(null);

  const [newTxPlan, setNewTxPlan] = useState({
    id: "",
    txid: "",
    phase: "",
    area: "",
    description: "",
    hn: "",
    note: "",
    division: "",
  });

  useEffect(() => {
    if (treatment) {
      setNewTxPlan({
        id: treatment.id || "",
        txid: treatment.txid || "",
        phase: treatment.phase || "",
        area: treatment.area || "",
        description: treatment.description || "",
        hn: treatment.hn || "",
        note: treatment.note || "",
        division: treatment.division || "",
        startDate: treatment.startDate || "",
        completeDate: treatment.completeDate || "",
      });
      setSelectedDivision(treatment.division || "");
      setSelectedOption(treatment.description || "");
    }
  }, [treatment]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTxPlan((prevTxPlan) => ({
      ...prevTxPlan,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const result = await getAllDivisions();
        if (result.error) {
          setError(result.error);
        } else {
          setDivisions(result);
        }
      } catch (error) {
        setError("Error fetching divisions: " + error.message);
      }
    };
    fetchDivisions();
  }, []);

  const handleDivisionChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedDivision(selectedValue);
    setNewTxPlan((prevTxPlan) => ({
      ...prevTxPlan,
      division: selectedValue,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await changeTreatmentStatus(); // Ensure this completes before inserting new plan
      const response = await insertTxPlan(newTxPlan);
      onUpdateNewTx(newTxPlan); // Notify parent about the new treatment plan
      handleClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error inserting treatment plan:", error);
    }
  };

  const changeTreatmentStatus = async () => {
    try {
      const response = await updateTreatmentById(treatment.id, {
        ...treatment,
        status: -1,
      });
      console.log(response);
      onUpdate({
        ...treatment,
        status: -1,
      });
    } catch (error) {
      console.error("Error updating treatment status:", error);
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [showApprovalRequestForm, setShowApprovalRequestForm] = useState(false);
  const handleCompleteTreatmentRequest = () => {
    setShowApprovalRequestForm(true); // Show the approval request modal
  };

  const handleApprovalUpdate = (updatedTreatment) => {
    onUpdate(updatedTreatment);
    handleClose(); // Close the modal after update
  };

  const [txtypes, setTxtypes] = useState([]);
  const [selectedOption, setSelectedOption] = useState(newTxPlan.description || "");

  useEffect(() => {
    const fetchTxtypes = async () => {
      try {
        const result = await getTxtypesByDivision(selectedDivision);
        if (result.error) {
          setError(result.error);
        } else {
          console.log(result.data);
          setTxtypes(result.data);
        }
      } catch (error) {
        setError("Error fetching txtypes: " + error.message);
      }
    };
    if (selectedDivision) {
      fetchTxtypes();
    }
  }, [selectedDivision]);

  const handleDescriptionChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    setNewTxPlan((prevTxPlan) => ({
      ...prevTxPlan,
      description: selectedValue,
    }));
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        className={theme}
        fullscreen={true}
      >
        <Modal.Header closeButton>
          <Modal.Title id="custom-modal-title">Update Treatment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container
            fluid="md"
            className={`status-by-div-container ${containerClass}`}
          >
            {error && (
              <Alert variant="danger" className={alertClass}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleFormSubmit} className={`mt-4`}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                  ID
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="number"
                    name="id"
                    value={newTxPlan.id}
                    readOnly
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                  HN
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="hn"
                    value={newTxPlan.hn}
                    readOnly
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                  Treatment No.
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="txid"
                    value={newTxPlan.txid}
                    readOnly
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                  Phase
                </Form.Label>
                <Col sm={9}>
                  <Form.Select
                    name="phase"
                    value={newTxPlan.phase}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Phase</option>
                    <option value="Systemic">Systemic</option>
                    <option value="Acute">Acute</option>
                    <option value="Disease control">Disease control</option>
                    <option value="Definitive">Definitive</option>
                    <option value="Maintenance">Maintenance</option>
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                  Area
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="area"
                    value={newTxPlan.area}
                    onChange={handleFormChange}
                    required
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                  Select Division
                </Form.Label>
                <Col sm={9}>
                  <Form.Select
                    name="division"
                    value={newTxPlan.division}
                    onChange={handleDivisionChange}
                    required
                  >
                    <option value="" disabled>
                      Select Division
                    </option>
                    {divisions.map((division) => (
                      <option key={division.id} value={division.shortName}>
                        {division.fullName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                  Description
                </Form.Label>
                <Col sm={9}>
                  <Form.Select
                    name="description"
                    value={selectedOption}
                    onChange={handleDescriptionChange}
                    required
                  >
                    <option value="" disabled>
                      Select Type of Work
                    </option>
                    {txtypes.map((option) => (
                      <option key={option.id} value={option.treatment}>
                        {option.treatment}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                  Note
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="note"
                    value={newTxPlan.note}
                    onChange={handleFormChange}
                  />
                </Col>
              </Form.Group>

              <Row className="d-flex justify-content-center">
                <Col className="d-flex justify-content-center">
                  <Button variant="danger" onClick={changeTreatmentStatus}>
                    Remove Treatment
                  </Button>
                </Col>
                <Col className="d-flex justify-content-center">
                  <Button variant="dark" type="submit">
                    Save Changes
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-dark"
            onClick={handleCompleteTreatmentRequest}
          >
            Complete tx approval request
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ModalCompleteTxApproval
        show={showApprovalRequestForm}
        handleClose={() => setShowApprovalRequestForm(false)}
        treatment={treatment}
        onUpdate2={handleApprovalUpdate}
      />
    </>
  );
}

export default ModalTreatmentUpdate;


// import React, { useEffect, useState, useContext } from "react";
// import { ThemeContext } from "../ThemeContext";
// import {
//   Modal,
//   Button,
//   Form,
//   Container,
//   Row,
//   Col,
//   Alert,
// } from "react-bootstrap";
// import {
//   getAllDivisions,
//   updateTreatmentById,
//   insertTxPlan,
//   getTxtypesByDivision,
// } from "../features/apiCalls";
// import ModalCompleteTxApproval from "./ModalCompleteTxApproval";

// function ModalTreatmentUpdate({
//   show,
//   handleClose,
//   treatment,
//   onUpdate,
//   onUpdateNewTx,
// }) {
//   const { theme } = useContext(ThemeContext);
//   const containerClass = theme === "dark" ? "container-dark" : "";
//   const alertClass = theme === "dark" ? "alert-dark" : "";
//   const [divisions, setDivisions] = useState([]);
//   const [selectedDivision, setSelectedDivision] = useState("");
//   const [error, setError] = useState(null);

//   const [newTxPlan, setNewTxPlan] = useState({
//     id: "",
//     txid: "",
//     phase: "",
//     area: "",
//     description: "",
//     hn: "",
//     note: "",
//     division: "",
//   });

//   useEffect(() => {
//     if (treatment) {
//       setNewTxPlan({
//         id: treatment.id || "",
//         txid: treatment.txid || "",
//         phase: treatment.phase || "",
//         area: treatment.area || "",
//         description: treatment.description || "",
//         hn: treatment.hn || "",
//         note: treatment.note || "",
//         division: treatment.division || "",
//         startDate: treatment.startDate || "",
//         completeDate: treatment.completeDate || "",
//       });
//     }
//   }, [treatment]);

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setNewTxPlan((prevTxPlan) => ({
//       ...prevTxPlan,
//       [name]: value,
//     }));
//   };

//   useEffect(() => {
//     const fetchDivisions = async () => {
//       try {
//         const result = await getAllDivisions();
//         if (result.error) {
//           setError(result.error);
//         } else {
//           setDivisions(result);
//         }
//       } catch (error) {
//         setError("Error fetching divisions: " + error.message);
//       }
//     };
//     fetchDivisions();
//   }, []);

//   const handleDivisionChange = (e) => {
//     const selectedValue = e.target.value;
//     setSelectedDivision(selectedValue);
//     setNewTxPlan((prevTxPlan) => ({
//       ...prevTxPlan,
//       division: selectedValue,
//     }));
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await changeTreatmentStatus(); // Ensure this completes before inserting new plan
//       const response = await insertTxPlan(newTxPlan);
//       onUpdateNewTx(newTxPlan); // Notify parent about the new treatment plan
//       handleClose(); // Close the modal after successful submission
//     } catch (error) {
//       console.error("Error inserting treatment plan:", error);
//     }
//   };

//   const changeTreatmentStatus = async () => {
//     try {
//       const response = await updateTreatmentById(treatment.id, {
//         ...treatment,
//         status: -1,
//       });
//       console.log(response);
//       onUpdate({
//         ...treatment,
//         status: -1,
//       });
//     } catch (error) {
//       console.error("Error updating treatment status:", error);
//     }
//   };

//   const [showModal, setShowModal] = useState(false);

//   const handleShow = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);

//   const [showApprovalRequestForm, setShowApprovalRequestForm] = useState(false);
//   const handleCompleteTreatmentRequest = () => {
//     setShowApprovalRequestForm(true); // Show the approval request modal
//   };

//   const handleApprovalUpdate = (updatedTreatment) => {
//     onUpdate(updatedTreatment);
//     handleClose(); // Close the modal after update
//   };

//   const [txtypes, setTxtypes] = useState([]);
//   const [selectedOption, setSelectedOption] = useState("");

//   useEffect(() => {
//     const fetchTxtypes = async () => {
//       try {
//         const result = await getTxtypesByDivision(selectedDivision);
//         if (result.error) {
//           setError(result.error);
//         } else {
//           console.log(result.data);
//           setTxtypes(result.data);
//         }
//       } catch (error) {
//         setError("Error fetching txtypes: " + error.message);
//       }
//     };
//     if (selectedDivision) {
//       fetchTxtypes();
//     }
//   }, [selectedDivision]);

//   return (
//     <>
//       <Modal
//         show={show}
//         onHide={handleClose}
//         className={theme}
//         fullscreen={true}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title id="custom-modal-title">Update Treatment</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Container
//             fluid="md"
//             className={`status-by-div-container ${containerClass}`}
//           >
//             {error && (
//               <Alert variant="danger" className={alertClass}>
//                 {error}
//               </Alert>
//             )}

//             <Form onSubmit={handleFormSubmit} className={`mt-4`}>
//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column sm={3}>
//                   ID
//                 </Form.Label>
//                 <Col sm={9}>
//                   <Form.Control
//                     type="number"
//                     name="id"
//                     value={newTxPlan.id}
//                     readOnly
//                   />
//                 </Col>
//               </Form.Group>

//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column sm={3}>
//                   HN
//                 </Form.Label>
//                 <Col sm={9}>
//                   <Form.Control
//                     type="text"
//                     name="hn"
//                     value={newTxPlan.hn}
//                     readOnly
//                   />
//                 </Col>
//               </Form.Group>

//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column sm={3}>
//                   Treatment No.
//                 </Form.Label>
//                 <Col sm={9}>
//                   <Form.Control
//                     type="text"
//                     name="txid"
//                     value={newTxPlan.txid}
//                     readOnly
//                   />
//                 </Col>
//               </Form.Group>

//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column sm={3}>
//                   Phase
//                 </Form.Label>
//                 <Col sm={9}>
//                   <Form.Select
//                     name="phase"
//                     value={newTxPlan.phase}
//                     onChange={handleFormChange}
//                     required
//                   >
//                     <option value="">Select Phase</option>
//                     <option value="Systemic">Systemic</option>
//                     <option value="Acute">Acute</option>
//                     <option value="Disease control">Disease control</option>
//                     <option value="Definitive">Definitive</option>
//                     <option value="Maintenance">Maintenance</option>
//                   </Form.Select>
//                 </Col>
//               </Form.Group>

//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column sm={3}>
//                   Area
//                 </Form.Label>
//                 <Col sm={9}>
//                   <Form.Control
//                     type="text"
//                     name="area"
//                     value={newTxPlan.area}
//                     onChange={handleFormChange}
//                     required
//                   />
//                 </Col>
//               </Form.Group>

//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column sm={3}>
//                   Select Division
//                 </Form.Label>
//                 <Col sm={9}>
//                   <Form.Select
//                     name="division"
//                     value={newTxPlan.division}
//                     onChange={handleDivisionChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Division
//                     </option>
//                     {divisions.map((division) => (
//                       <option key={division.id} value={division.shortName}>
//                         {division.fullName}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Col>
//               </Form.Group>

//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column sm={3}>
//                   Description
//                 </Form.Label>
//                 <Col sm={9}>
//                   {/* <Form.Control
//                     type="text"
//                     name="description"
//                     value={newTxPlan.description}
//                     onChange={handleFormChange}
//                     required
//                   /> */}

//                   <Form.Group controlId="Form.SelectCustom" className="mb-3">
//                     <Form.Select
//                       name="description"
//                       value={selectedOption}
//                       onChange={handleFormChange}
//                       required
//                     >
//                       <option value="" disabled>
//                         Select Type of Work
//                       </option>
//                       {txtypes.map((option) => (
//                         <option key={option.id} value={option.treatment}>
//                           {option.treatment}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                 </Col>
//               </Form.Group>

//               <Form.Group as={Row} className="mb-3">
//                 <Form.Label column sm={3}>
//                   Note
//                 </Form.Label>
//                 <Col sm={9}>
//                   <Form.Control
//                     type="text"
//                     name="note"
//                     value={newTxPlan.note}
//                     onChange={handleFormChange}
//                   />
//                 </Col>
//               </Form.Group>

//               <Row className="d-flex justify-content-center">
//                 <Col className="d-flex justify-content-center">
//                   <Button variant="danger" onClick={changeTreatmentStatus}>
//                     Remove Treatment
//                   </Button>
//                 </Col>
//                 <Col className="d-flex justify-content-center">
//                   <Button variant="dark" type="submit">
//                     Save Changes
//                   </Button>
//                 </Col>
//                 <Col className="d-flex justify-content-center"></Col>
//               </Row>
//             </Form>
//           </Container>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button
//             variant="outline-dark"
//             onClick={handleCompleteTreatmentRequest}
//           >
//             Complete tx approval request
//           </Button>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <ModalCompleteTxApproval
//         show={showApprovalRequestForm}
//         handleClose={() => setShowApprovalRequestForm(false)}
//         treatment={treatment}
//         onUpdate2={handleApprovalUpdate}
//       />
//     </>
//   );
// }

// export default ModalTreatmentUpdate;
