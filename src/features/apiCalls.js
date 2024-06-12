import axios from 'axios';

const host = 'https://dentrsu-0b0ffade06fd.herokuapp.com';//'http://localhost:3001'; //

export const getJwtToken = async (user) => {
    try {
        const response = await axios.post(`${ host }/api/students/create-token`, user);
        return response;
    } catch (error) {
        return error;
    }
};


export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${ host }/api/students/api/users`);
        return response;
    } catch (error) {
        return error;
    }
};

export const getAllStudents = async () => {
    try {
        const response = await axios.get(`${ host }/api/students`);
        return response;
    } catch (error) {
        return error;
    }
};

export const getStudentByEmail = async (studentEmail) => {
    try {
        const response = await axios.get(`${ host }/api/students/studentEmail/${studentEmail}`);
        return response.data;
    }catch (error){
        return error;
    }
};

export const getStudentById = async (studentId) => {
    try {
        const response = await axios.get(`${ host }/api/students/${studentId}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const insertStudent = async (student) => {
    try {
        const response = await axios.post(`${ host }/api/students`, student);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateStudent = async (studentId, student) => {
    try {
        const response = await axios.put(`${ host }/api/students/${studentId}`, student);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const deleteStudent = async (studentId) => {
    try {
        const response = await axios.delete(`${ host }/api/students/${studentId}`);
        return response.data;
    } catch (error) {
        return error;
    }
};


export const getReqByDivision = async (division) => {
    try {
        const response = await axios.get(`${ host }/api/students/reqs/${division}`);
        //console.log("responseAPI", response);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const insertDivisionReq = async (req, division) => {
    switch (division) {
        case "oper":
            division = "operReq";
            break;
        case "endo":
            division = "endoReq";
            break;
        case "perio":
            division = "perioReq";
            break;
        case "prosth":
            division = "prosthReq";
            break;
        case "diag":
            division = "diagReq";
            break;
        case "radio":
            division = "radioReq";
            break;
        case "sur":
            division = "surReq";
            break;
        case "pedo":
            division = "pedoReq";
            break;
        case "ortho":
            division = "orthoReq";
            break;
        default:
            break;
    }
    try {
        const response = await axios.post(`${ host }/api/students/reqs/${division}`, req);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const insertOperReq = async (req) => {
    try {
        const response = await axios.post(`${ host }/api/students/reqs/operReq`, req);
        return response.data;
    } catch (error) {
        console.log("errorAPI", error);
        return error;
    }
};

export const getOperReqByStudentEmail = async (studentEmail) => {
    try {
        const response = await axios.get(`${ host }/api/students/reqs/operReq/${studentEmail}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getOperReqById = async (id, req) => {
    try {
        const response = await axios.get(`${ host }/api/students/reqs/operReq/id/${id}`, req);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateOperReqById = async (id, req) => {
    try {
        const response = await axios.put(`${ host }/api/students/reqs/operReqUpdate/id/${id}`, req);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getAllDivisions = async () => {
    try {
        const response = await axios.get(`${ host }/api/students/divisions/division`);
        //console.log("responseAPI", response);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getDivReqByStudentEmail = async (studentEmail, division) => {
    switch (division) {
        case "oper":
            division = "operReq";
            break;
        case "endo":
            division = "endoReq";
            break;
        case "perio":
            division = "perioReq";
            break;
        case "prosth":
            division = "prosthReq";
            break;
        case "diag":
            division = "diagReq";
            break;
        case "radio":
            division = "radioReq";
            break;
        case "sur":
            division = "surReq";
            break;
        case "pedo":
            division = "pedoReq";
            break;
        case "ortho":
            division = "orthoReq";
            break;
        default:
            break;
    }
    try {
        //console.log("division in API", division);
        const response = await axios.get(`${ host }/api/students/reqs/${division}/${studentEmail}`);
        return response.data;
    } catch (error) {
        return error;
    }

};

export const getDivReqById = async (id, division) => {
    switch (division) {
        case "oper":
            division = "operReq";
            break;
        case "endo":
            division = "endoReq";
            break;
        case "perio":
            division = "perioReq";
            break;
        case "prosth":
            division = "prosthReq";
            break;
        case "diag":
            division = "diagReq";
            break;
        case "radio":
            division = "radioReq";
            break;
        case "sur":
            division = "surReq";
            break;
        case "pedo":
            division = "pedoReq";
            break;
        case "ortho":
            division = "orthoReq";
            break;
        default:
            break;
    }
    try {
        const response = await axios.get(`${ host }/api/students/reqs/${division}/id/${id}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateDivReqById = async (id, req, division) => {
    switch (division) {
        case "oper":
            division = "operReqUpdate";
            break;
        case "endo":
            division = "endoReqUpdate";
            break;
        case "perio":
            division = "perioReqUpdate";
            break;
        case "prosth":
            division = "prosthReqUpdate";
            break;
        case "diag":
            division = "diagReqUpdate";
            break;
        case "radio":
            division = "radioReqUpdate";
            break;
        case "sur":
            division = "surReqUpdate";
            break;
        case "pedo":
            division = "pedoReqUpdate";
            break;
        case "ortho":
            division = "orthoReqUpdate";
            break;
        default:
            break;
    }
    try {
        const response = await axios.put(`${ host }/api/students/reqs/${division}/id/${id}`, req);
        return response.data;
    } catch (error) {
        return error;
    }
};



//Instructors
export const getAllInstructors = async () => {
    try {
        const response = await axios.get(`${ host }/api/students/all/instructors`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getInstructorByEmail = async (instructorEmail) => {
    try {
        const response = await axios.get(`${ host }/api/students/instructors/instructorEmail/${instructorEmail}`);
        return response.data;
    }catch (error){
        return error;
    }
};

export const getDivReqByInstructorEmail = async (instructorEmail, division) => {
    //console.log("division in API", division);
    switch (division) {
        case "oper":
            division = "operReq";
            break;
        case "endo":
            division = "endoReq";
            break;
        case "perio":
            division = "perioReq";
            break;
        case "prosth":
            division = "prosthReq";
            break;
        case "diag":
            division = "diagReq";
            break;
        case "radio":
            division = "radioReq";
            break;
        case "sur":
            division = "surReq";
            break;
        case "pedo" :
            division = "pedoReq";
            break;
        case "ortho":
            division = "orthoReq";
            break;
        default:
            break;
    }
    try {
        //console.log("division in API", division);
        const response = await axios.get(`${ host }/api/students/reqs/${division}/instructorEmail/${instructorEmail}`);
        //"/reqs/operReq/instructorEmail/:instructorEmail"
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getUserByEmail = async (userEmail) => {
    try {
        const response = await axios.get(`${ host }/api/students/users/${userEmail}`);
        return response.data;
    }catch (error){
        return error;
    }
};

export const getCompcasesDetails = async () => {
    try {
        const response = await axios.get(`${ host }/api/students/compcases/details`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getInstructorsByTeamleaderRole = async (roleId) => {
    try {
        const response = await axios.get(`${ host }/api/students/instructors/teamleaderRole/${roleId}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const insertCompletedCase = async (compCase) => {
    //console.log("compCase", compCase);
    try {
        const response = await axios.post(`${ host }/api/students/reqs/c/compcases`, compCase);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getCompcaseReqByStudentEmail = async (studentEmail) => {
    try {
        const response = await axios.get(`${ host }/api/students/compcases/studentEmail/${studentEmail}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateCompReqById = async (id, req) => {
    try {
        const response = await axios.put(`${ host }/api/students/reqs/c/compcases/id/${id}`, req);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getCompReqByInstructorEmail = async (instructorEmail) => {
    try {
        const response = await axios.get(`${ host }/api/students/compcases/instructorEmail/${instructorEmail}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getStudentByTeamleaderEmail = async (teamleaderEmail) => {
    try {
        const response = await axios.get(`${ host }/api/students/students/teamleaderEmail/${teamleaderEmail}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getStudentByDivInstructorEmail = async (instructorEmail, division) => {
    switch (division) {
        case "oper":
            division = "operInstructorEmail";
            break;
        case "endo":
            division = "endoInstructorEmail";
            break;
        case "perio":
            division = "perioInstructorEmail";
            break;
        case "prosth":
            division = "prosthInstructorEmail";
            break;
        case "diag":
            division = "diagInstructorEmail";
            break;
        case "radio":
            division = "radioInstructorEmail";
            break;
        case "sur":
            division = "surInstructorEmail";
            break;
        case "pedo" :
            division = "pedoInstructorEmail";
            break;
        case "ortho":
            division = "orthoInstructorEmail";
            break;
        default:
            break;
    }
    try {
        const response = await axios.get(`${ host }/api/students/students/${division}/${instructorEmail}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getAllReqByDivision = async (division) => {
    try {
        const response = await axios.get(`${ host }/api/students/reqs/division/${division}`);
        //console.log("responseAPI", response);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateInstructorDivByInstructorEmail = async (instructorEmail, division) => {
    try {
        const response = await axios.put(`${ host }/api/students/instructors/division/instructorEmail/${instructorEmail}`, division);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getInstructorsByDivision = async (division) => {
    try {
        const response = await axios.get(`${ host }/api/students/instructors/${division}`);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const insertUser = async (user) => {
    try {
        const response = await axios.post(`${ host }/api/students/add/users`, user);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateMinReqById = async (id, req) => {
    try {
        const response = await axios.put(`${ host }/api/students/reqs/minReq/id/${id}`, req);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateStudentDivInstructorByDivInstructorEmail = async (studentId, formData) => {
    try {
        const response = await axios.put(`${ host }/api/students/students/division/instructorEmail/${studentId}`, formData);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const insertInstructor = async (instructor) => {
    try {
        const response = await axios.post(`${ host }/api/students/add/instructors`, instructor);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateUserById = async (id, user) => {
    try {
        const response = await axios.put(`${ host }/api/students/update/users/${id}`, user);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateInstructorByInstructorId = async (id, instructor) => {
    try {
        const response = await axios.put(`${ host }/api/students/update/instructors/instructorId/${id}`, instructor);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateRequestByStudentEmail = async (studentEmail, request) => {
    //console.log("request", request);
    try {
        const response = await axios.put(`${ host }/api/students/update/requests/studentEmail/${studentEmail}`, request);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const updateStatusByStudentEmail = async (studentEmail, status) => {
    //console.log("status", status);
    try {
        const response = await axios.put(`${ host }/api/students/update/status/studentEmail/${studentEmail}`, status);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const deleteCompReqById = async (id) => {
    try {
        const response = await axios.delete(`${ host }/api/students/reqs/d/compcases/id/${id}`);
        return response.data;
    } catch (error) {
        return error;
    }
};





