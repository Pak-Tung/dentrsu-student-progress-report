import React, { useState } from 'react';
import Papa from 'papaparse'; // For parsing CSV files (install using npm or yarn)
//import { insertPatientsDataCSV } from './api'; // Assuming you have an API function for inserting patient data

const UploadPatientsCSV = () => {
  const [csvData, setCsvData] = useState([]);
  const [confirmData, setConfirmData] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
        setConfirmData(false); // Reset confirmation on new file upload
      },
      header: true, // Assuming CSV has a header row with field names
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
  };

  const handleInsertData = () => {
    // Assuming insertPatientsDataCSV function takes an array of patients and sends it to the API
    //insertPatientsDataCSV(csvData);
    console.log(csvData); // Log the data to console for now
    setCsvData([]); // Clear CSV data after insertion
    setConfirmData(false); // Hide confirmation table
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept=".csv" />
      <br />

      {csvData.length > 0 && (
        <div>
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}

      {confirmData && (
        <div>
          <table>
            <thead>
              <tr>
                <th>HN</th>
                <th>Name</th>
                <th>Telephone</th>
                <th>Team Leader Email</th>
              </tr>
            </thead>
            <tbody>
              {csvData.map((patient, index) => (
                <tr key={index}>
                  <td>{patient.hn}</td>
                  <td>{patient.name}</td>
                  <td>{patient.tel}</td>
                  <td>{patient.teamleaderEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleInsertData}>Insert Data</button>
        </div>
      )}
    </div>
  );
};

export default UploadPatientsCSV;
