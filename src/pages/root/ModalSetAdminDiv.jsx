import { useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { updateInstructorDivByInstructorEmail } from "../../features/apiCalls";

function ModalSetAdminDiv({ show, handleClose, userEmail }) {
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
  const [selectedDivision, setSelectedDivision] = useState("");

  const handleSelect = (division) => {
    setSelectedDivision(division);
    console.log("selectedDivision set to:", division);
  };

  const handleSave = async () => {
    if (selectedDivision) {
      const isConfirmed = window.confirm(
        `Are you sure you want to set the division to ${selectedDivision}?`
      );
      if (isConfirmed) {
        try {
          const result = await updateInstructorDivByInstructorEmail(
            userEmail,
            {division: selectedDivision}
          );
          console.log("result", result);
          handleClose(); // Close the modal after successful update
        } catch (error) {
          console.error("Failed to update division:", error);
          alert("Failed to update division");
        }
      }
    } else {
      alert("Please select a division");
    }
  };

  const fullNameDivision = useCallback((division) => {
    const divisionMap = {
      oper: "Operative",
      endo: "Endodontic",
      perio: "Periodontic",
      prosth: "Prosthodontic",
      diag: "Diagnostic",
      radio: "Radiology",
      sur: "Oral Surgery",
      pedo: "Pediatric Dentistry",
      ortho: "Orthodontic",
    };
    return divisionMap[division] || "";
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Set Division for Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DropdownButton
            id="dropdown-basic-button"
            title={selectedDivision || "Select Division"}
            onSelect={handleSelect}
          >
            {divisions.map((division) => (
              <Dropdown.Item key={division} eventKey={division}>
                {fullNameDivision(division)}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalSetAdminDiv;
