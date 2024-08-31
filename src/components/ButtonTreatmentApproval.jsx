import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { formatDateFormISO } from "../utilities/dateUtils";
import { updateTreatmentById } from "../features/apiCalls";

function ButtonTreatmentApproval({ treatment, updateTreatment }) {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });

  const userEmail = user.email;
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = JSON.parse(localStorage.getItem("role"));
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const [newTx, setNewTx] = useState({
    id: "",
    txid: "",
    phase: "",
    area: "",
    description: "",
    hn: "",
    note: "",
    division: "",
    startDate: "",
    completeDate: "",
    operatorEmail: "",
    approvedInstructor: "",
    status: "",
  });

  useEffect(() => {
    if (treatment) {
      setNewTx({
        id: treatment.id || "",
        txid: treatment.txid || "",
        phase: treatment.phase || "",
        area: treatment.area || "",
        description: treatment.description || "",
        hn: treatment.hn || "",
        note: treatment.note || "",
        division: treatment.division || "",
        startDate: formatDateFormISO(treatment.startDate) || "",
        completeDate: formatDateFormISO(treatment.completeDate),
        operatorEmail: treatment.operatorEmail || "",
        approvedInstructor: userEmail,
        status: 2,
      });
    }
  }, [treatment, userEmail]);

  const handleTreatmentApproval = async (e) => {
    e.preventDefault();
    const isConfirmed = window.confirm("Are you sure you want to approve this treatment?");
    if (!isConfirmed) return;

    try {
      const result = await updateTreatmentById(newTx.id, newTx);
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        updateTreatment(newTx);
      }
    } catch (error) {
      alert(`An unexpected error occurred: ${error.message}`);
    }
  };

  return (
    <>
      {role !== "student" && (
        <button
          onClick={handleTreatmentApproval}
          style={{
            marginBottom: 0,
            marginTop: 0,
            paddingBottom: 0,
            paddingTop: 0,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: "green",
            color: "white",
            borderRadius: 5,
            border: "none",
          }}
        >
          Approve
        </button>
      )}
    </>
  );
}

export default ButtonTreatmentApproval;