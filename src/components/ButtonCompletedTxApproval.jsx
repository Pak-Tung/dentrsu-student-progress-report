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

    let processedUpdatePt = {
      ...updatePt,
    };

    let selectedStatus = "";

    if (role === "student") {
      if (patient.status !== "2") {
        alert("The treatment plan must be approved first!");
        return;
      } else {
        processedUpdatePt = {
          ...updatePt,
          acceptedDate:
            updatePt.acceptedDate === "" ? null : updatePt.acceptedDate,
          planApprovedDate:
            updatePt.planApprovedDate === "" ? null : updatePt.planApprovedDate,
          status: "3", // Set status based on role
          completedTxApprovalBy: role === "student" ? "" : userEmail,
          completedDate:
            role === "student"
              ? null
              : formatDateFormISO(new Date().toISOString()),
        };
      }
    } else if (role === "instructor") {
      // Create a pop-up window for selecting status, centered on the screen
      const popupWidth = 300;
      const popupHeight = 200;
      const left = (window.innerWidth - popupWidth) / 2;
      const top = (window.innerHeight - popupHeight) / 2;
      const popupWindow = window.open(
        "",
        "Select Status",
        `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
      );

      const statusForm = popupWindow.document.createElement("form");
      statusForm.style.fontSize = "16px";

      const option4 = popupWindow.document.createElement("input");
      option4.type = "radio";
      option4.id = "status4";
      option4.name = "status";
      option4.value = "4";
      const label4 = popupWindow.document.createElement("label");
      label4.htmlFor = "status4";
      label4.innerText = "Complete case and pending recall";

      const option5 = popupWindow.document.createElement("input");
      option5.type = "radio";
      option5.id = "status5";
      option5.name = "status";
      option5.value = "5";
      const label5 = popupWindow.document.createElement("label");
      label5.htmlFor = "status5";
      label5.innerText = "Orthodontic treatment referral";

      statusForm.appendChild(option4);
      statusForm.appendChild(label4);
      statusForm.appendChild(popupWindow.document.createElement("br"));
      statusForm.appendChild(option5);
      statusForm.appendChild(label5);
      statusForm.appendChild(popupWindow.document.createElement("br"));

      const submitButton = popupWindow.document.createElement("button");
      submitButton.type = "button";
      submitButton.innerText = "Submit";
      statusForm.appendChild(submitButton);

      popupWindow.document.body.appendChild(statusForm);

      submitButton.addEventListener("click", () => {
        const selectedOption = statusForm.querySelector(
          'input[name="status"]:checked'
        );
        if (selectedOption) {
          selectedStatus = selectedOption.value;
          popupWindow.close();

          // Validate the selected status
          if (!["4", "5"].includes(selectedStatus)) {
            alert("Invalid status selected. Please select either 4 or 5.");
            return;
          }

          processedUpdatePt = {
            ...updatePt,
            acceptedDate:
              updatePt.acceptedDate === "" ? null : updatePt.acceptedDate,
            planApprovedDate:
              updatePt.planApprovedDate === ""
                ? null
                : updatePt.planApprovedDate,
            status: role === "student" ? "3" : selectedStatus, // Set status based on role
            completedTxApprovalBy: role === "student" ? "" : userEmail,
            completedDate:
              role === "student"
                ? null
                : formatDateFormISO(new Date().toISOString()),
          };

          try {
            updatePatient();
          } catch (error) {
            console.error("Error requesting approval:", error);
          }
        } else {
          alert("Please select a status before submitting.");
        }
      });
    }

    const updatePatient = async () => {
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
    };
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
        title={
          role === "student"
            ? "Click to request complete case approval"
            : "Click to approve complete case"
        }
      >
        Approval
      </button>
    </>
  );
}

export default ButtonCompletedTxApproval;
