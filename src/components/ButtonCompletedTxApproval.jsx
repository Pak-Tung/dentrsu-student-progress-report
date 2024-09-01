import React, { useState, useEffect } from "react";
import { updatePatientbyhn } from "../features/apiCalls";
import Cookies from "js-cookie";
import { formatDateFormISO } from "../utilities/dateUtils";

function ButtonCompletedTxApproval({ patient, updateStatus }) {
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

  const [updatePt, setUpdatePt] = useState({
    tel: "",
    teamleaderEmail: "",
    studentEmail: "",
    complexity: "",
    note: "",
    status: "",
    acceptedDate: "",
    planApprovedDate: "",
    completedDate: "",
    planApprovalBy: "",
    completedTxApprovalBy: "",
  });

  useEffect(() => {
    setUpdatePt({
      tel: patient.tel,
      teamleaderEmail: patient.teamleaderEmail,
      studentEmail: patient.studentEmail,
      complexity: patient.complexity,
      note: patient.note,
      status: patient.status,
      acceptedDate: patient.acceptedDate
        ? formatDateFormISO(patient.acceptedDate)
        : "",
      planApprovalBy: patient.planApprovalBy,
      planApprovedDate: patient.planApprovedDate
        ? formatDateFormISO(patient.planApprovedDate)
        : "",
      completedDate: patient.completedDate
        ? formatDateFormISO(patient.completedDate)
        : "",
      completedTxApprovalBy: patient.completedTxApprovalBy,
    });
  }, [patient]);

  const handleTxPlanApproval = async (e) => {
    e.preventDefault();

    // Show a confirmation dialog to the user
    const confirmApproval = window.confirm(
      role === "student"
        ? "Are you sure you want to request treatment plan approval?"
        : "Are you sure you want to approve the treatment plan?"
    );

    // If the user does not confirm, exit the function
    if (!confirmApproval) {
      return;
    }

    if (role === "student" ?patient.status !== 2: patient.status !== 3) {
      alert("The treatment plan must be approved first!");
      return;
    } else if (patient.status !== 4) {
      // Update status before sending the request
      // Check dates and set them to null if they are empty
      const processedUpdatePt = {
        ...updatePt,
        acceptedDate:
          updatePt.acceptedDate === "" ? null : updatePt.acceptedDate,
        planApprovedDate:
          updatePt.planApprovedDate === "" ? null : updatePt.planApprovedDate,
        status: role === "student" ? 3 : 4, // 1 = Treatment plan requested, 2 = Treatment plan approved
        completedTxApprovalBy: role === "student" ? "" : userEmail,
        completedDate:
          role === "student" ? null : formatDateFormISO(new Date().toISOString()),
      };

      console.log("processedUpdatePt", processedUpdatePt);

      try {
        const response = await updatePatientbyhn(patient.hn, processedUpdatePt);
        //console.log(response);
        // Optionally call updateStatus to update parent state
        if (processedUpdatePt) {
          updateStatus(processedUpdatePt);
        }
        alert("Complete case approval requested successfully!");
      } catch (error) {
        console.error("Error requesting approval:", error);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleTxPlanApproval}
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
        title={role === "student" ? "Click to request complete case approval" : "Click to approve complete case"} 
      >
        Approval Request
      </button>
    </>
  );
}

export default ButtonCompletedTxApproval;
