import axios from 'axios';

const host = 'http://localhost:3001';

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
        console.log("responseAPI", response);
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
        return response.data;
    } catch (error) {
        return error;
    }
};
