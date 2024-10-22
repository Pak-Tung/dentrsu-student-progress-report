import React, { useState, useRef } from "react";
import Papa from "papaparse"; // For parsing CSV files (install using npm or yarn)
import { insertPatientsDataCsv } from "../features/apiCalls";

const UploadPatientsCSV = () => {
  const [csvData, setCsvData] = useState([]);
  const [confirmData, setConfirmData] = useState(false);
  const [message, setMessage] = useState(""); // Success message
  const [error, setError] = useState(""); // Error message

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.error("No file selected");
      return; // Stop execution if no file is selected
    }

    Papa.parse(file, {
      complete: (result) => {
        if (result.data) {
          setCsvData(result.data);
          setConfirmData(false); // Reset confirmation on new file upload
        } else {
          console.error("Parsing error or empty data");
        }
      },
      header: true, // Assuming CSV has a header row with field names
      error: (error) => {
        console.error("Error parsing CSV file: ", error.message);
      },
    });
  };

  const handleConfirm = () => {
    // Assuming csvData is an array of objects where each object represents a row from CSV
    if (csvData.length > 0) {
      setConfirmData(true); // Show confirmation table
    }
  };

  const handleCancel = () => {
    setCsvData([]); // Clear CSV data
    setConfirmData(false); // Hide confirmation table

    // Clear the file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setMessage("");
    setError("");
  };

  const handleInsertData = async () => {
    try {
      const result = await insertPatientsDataCsv(csvData);
      setMessage(result.message); // Display success message
      setError("");
      setCsvData([]);
      setConfirmData(false);

      // Clear the file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  const handleEditField = (index, field, value) => {
    const updatedData = [...csvData];
    updatedData[index][field] = value;
    setCsvData(updatedData);
  };

  return (
    <div>
      {/* File Upload and Buttons */}
      <input
        type="file"
        ref={fileInputRef} // Attach the ref here
        onChange={handleFileUpload}
        accept=".csv"
      />
      <br />

      {csvData.length > 0 && (
        <div>
          <button onClick={handleConfirm}>อัพโหลดข้อมูลผู้ป่วย</button>
          <button onClick={handleCancel}>ยกเลิก</button>
        </div>
      )}

      {/* Display Messages */}
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Confirmation Table */}
      {confirmData && (
        <div>
          <table>
            <thead>
              <tr>
                <th>เลขที่บัตร</th>
                <th>ชื่อ-นามสกุล</th>
                <th>เบอร์โทรศัพท์</th>
                <th>วันเกิด</th>
                <th>ผู้ติดต่อกรณีฉุกเฉิน</th>
                <th>เบอร์โทรศัพท์ผู้ติดต่อกรณีฉุกเฉิน</th>
                <th>ความสัมพันธ์กับผู้ป่วย</th>
                <th>อาจารย์ผู้รับมอบหมาย</th>
              </tr>
            </thead>
            <tbody>
              {csvData.map((patient, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={patient.hn}
                      onChange={(e) =>
                        handleEditField(index, "hn", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={patient.name}
                      onChange={(e) =>
                        handleEditField(index, "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={patient.tel}
                      onChange={(e) =>
                        handleEditField(index, "tel", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={patient.birthDate}
                      onChange={(e) =>
                        handleEditField(index, "birthDate", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={patient.emergencyContact}
                      onChange={(e) =>
                        handleEditField(index, "emergencyContact", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="tel"
                      value={patient.emergencyTel}
                      onChange={(e) =>
                        handleEditField(index, "emergencyTel", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={patient.relationship}
                      onChange={(e) =>
                        handleEditField(index, "relationship", e.target.value)
                      }
                    />  
                  </td>
                  <td>
                    <input
                      type="text"
                      value={patient.teamleaderEmail}
                      onChange={(e) =>
                        handleEditField(
                          index,
                          "teamleaderEmail",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleInsertData}>บันทึกข้อมูล</button>
        </div>
      )}
    </div>
  );
};

export default UploadPatientsCSV;
