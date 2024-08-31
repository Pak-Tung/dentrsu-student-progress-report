import React from 'react';

function ButtonUpdatePatientProfile({ handlePatientUpdate, patient }) {
    const handleUpdatePatientProfile = () => {
        handlePatientUpdate(patient);
    };

    return (
        <>
            <button onClick={handleUpdatePatientProfile} style={{ marginBottom: 0, marginTop: 0, paddingBottom: 0, paddingTop: 0, paddingLeft: 15, paddingRight: 15 }}>
                Edit Patient
            </button>
        </>
    );
}

export default ButtonUpdatePatientProfile;