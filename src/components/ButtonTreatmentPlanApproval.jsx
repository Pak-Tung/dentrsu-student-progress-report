import React, { useState, useEffect } from "react";
import { updatePatientbyhn } from "../features/apiCalls";
import Cookies from "js-cookie";
import { formatDateFormISO } from "../utilities/dateUtils";

function ButtonTxApproval({ patient, updateStatus }) {
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
    hn: "",
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
      hn: patient.hn,
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

  // Change the button text based on the role
  // If the role is student, the button text should be "Tx Approval Request"

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

    // Check dates and set them to null if they are empty
    const processedUpdatePt = {
      ...updatePt,
      acceptedDate: updatePt.acceptedDate === "" ? null : updatePt.acceptedDate,
      completedDate:
        updatePt.completedDate === "" ? null : updatePt.completedDate,
      status: role === "student" ? "1" : "2", // 1 = Treatment plan requested, 2 = Treatment plan approved
      planApprovalBy: role === "student" ? "" : userEmail,
      planApprovedDate:
        role === "student" ? null : formatDateFormISO(new Date().toISOString()),
    };

    //console.log(processedUpdatePt); // Use console.log to inspect the object

    try {
      const response = await updatePatientbyhn(patient.hn, processedUpdatePt);
      //console.log(response);
      // Optionally call updateStatus to update parent state
      updateStatus(processedUpdatePt);
    } catch (error) {
      console.error("Error requesting treatment approval:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleTxPlanApproval} // Call the function properly
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
        title={
          role === "student"
            ? "Click to request treatment plan approval"
            : "Click to approve treatment plan"
        }
      >
        {role === "student" ? "Approval Request" : "Approve Plan"}
      </button>
    </>
  );
}

export default ButtonTxApproval;
