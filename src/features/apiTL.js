import axios from 'axios';

const host = 'https://dentrsu-0b0ffade06fd.herokuapp.com';//'http://localhost:3001';//

export const getStudentsByTeamLeaderId = async (teamLeaderId) => {
    try {
        const response = await axios.get(`${ host }/api/students/teamLeaders/${teamLeaderId}`);
        return response;
    } catch (error) {
        return error;
    }
};

export const getTeamLeaderByEmail = async (email) => {
    try {
        const response = await axios.get(`${ host }/api/students/teamLeaders/teamLeaderEmail/${email}`);
        return response;
    } catch (error) {
        return error;
    }
}

export const getTeamLeaderById = async (teamLeaderId) => {
    try {
        const response = await axios.get(`${ host }/api/students/teamLeaders/${teamLeaderId}`);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getInstructorsByDivision = async (division) => {
    try {
        const response = await axios.get(`${ host }/api/students/instructors/${division}`);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const sendEmailToInstructor = async (formData) => {
    try {
      const response = await axios.post(`${ host }/api/students/sendEmailToInstructor`, formData);
      //console.log("Email sent to instructor:", response.data);
    } catch (error) {
      console.error("Error sending email to instructor:", error);
    }
  };