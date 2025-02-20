import React, { useState, useEffect } from "react";
import { updatePatientbyhn } from "../features/apiCalls";
import "../App.css";
import Cookies from "js-cookie";

function UpdateComplexity({ patient, updateComplexity }) {
  const [role, setRole] = useState("");
  
  useEffect(() => {
    const savedRole = Cookies.get("role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);
  const [updatePt, setUpdatePt] = useState({
    tel: "",
    teamleaderEmail: "",
    studentEmail: "",
    complexity: "",
    note: "",
  });

  useEffect(() => {
    setUpdatePt((prevPt) => ({
      ...prevPt,
      tel: patient.tel,
      teamleaderEmail: patient.teamleaderEmail,
      studentEmail: patient.studentEmail,
      complexity: patient.complexity,
      note: patient.note,
    }));
  }, [patient]);

  const handleComplexityChange = (e) => {
    const { name, value } = e.target;
    setUpdatePt((prevPt) => ({
      ...prevPt,
      [name]: value,
    }));
  };

  const handleSubmitComplexity = async (e) => {
    e.preventDefault();

    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to update the complexity?");
    if (!confirmed) {
      return; // Exit function if user cancels
    }

    try {
      const response = await updatePatientbyhn(patient.hn, updatePt);
      // Optionally call updateComplexity to update parent state
      if (updateComplexity) {
        updateComplexity(updatePt);
      }
    } catch (error) {
      console.error("Error updating complexity:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmitComplexity} style={{ margin: 0, padding: 0 }}>
        <div className="d-flex box0">
          <input
            type="number"
            name="complexity"
            value={updatePt.complexity}
            onChange={handleComplexityChange}
            min="0"
            step="1"
            required
            style={{ margin: 0, padding: 0, width: 60 }}
            {...(role === "root" || "student" ? {} : { disabled: true })}
          />
          <button type="submit" style={{ marginBottom: 0, marginTop: 0, paddingBottom: 0, paddingTop: 0, paddingLeft: 15, paddingRight: 15 }}>
            Save
          </button>
        </div>
      </form>
    </>
  );
}

export default UpdateComplexity;
