//import apiClient from "apiClient";
import  apiClient  from "./mainApi";
//const host = apiClient();

//const host = 'https://dentrsu-0b0ffade06fd.herokuapp.com';//'http://localhost:3001'; //

export const getJwtToken = async (user) => {
  try {
    const response = await apiClient.post(
      `/api/students/create-token`,
      user
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get(`/api/students/api/users`);
    return response;
  } catch (error) {
    return error;
  }
};

export const getAllStudents = async () => {
  try {
    const response = await apiClient.get(`/api/students`);
    return response;
  } catch (error) {
    return error;
  }
};

export const getStudentByEmail = async (studentEmail) => {
  try {
    const response = await apiClient.get(
      `/api/students/studentEmail/${studentEmail}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getStudentById = async (studentId) => {
  try {
    const response = await apiClient.get(`/api/students/${studentId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const insertStudent = async (student) => {
  try {
    const response = await apiClient.post(`/api/students`, student);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateStudent = async (studentId, student) => {
  try {
    const response = await apiClient.put(
      `/api/students/${studentId}`,
      student
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteStudent = async (studentId) => {
  try {
    const response = await apiClient.delete(`/api/students/${studentId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getReqByDivision = async (division) => {
  try {
    const response = await apiClient.get(`/api/students/reqs/${division}`);
    //console.log("responseAPI", response);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const insertDivisionReq = async (req, division) => {
  //console.log("division", req);
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
    const response = await apiClient.post(
      `/api/students/reqs/${division}`,
      req
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const insertOperReq = async (req) => {
  try {
    const response = await apiClient.post(`/api/students/reqs/operReq`, req);
    return response.data;
  } catch (error) {
    console.log("errorAPI", error);
    return error;
  }
};

export const getOperReqByStudentEmail = async (studentEmail) => {
  try {
    const response = await apiClient.get(
      `/api/students/reqs/operReq/${studentEmail}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getOperReqById = async (id, req) => {
  try {
    const response = await apiClient.get(
      `/api/students/reqs/operReq/id/${id}`,
      req
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateOperReqById = async (id, req) => {
  try {
    const response = await apiClient.put(
      `/api/students/reqs/operReqUpdate/id/${id}`,
      req
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllDivisions = async () => {
  try {
    const response = await apiClient.get(`/api/students/divisions/division`);
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
    const response = await apiClient.get(
      `/api/students/reqs/${division}/${studentEmail}`
    );
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
    const response = await apiClient.get(
      `/api/students/reqs/${division}/id/${id}`
    );
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
    const response = await apiClient.put(
      `/api/students/reqs/${division}/id/${id}`,
      req
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteDivReqById = async (id, division) => {
  switch (division) {
    case "oper":
      division = "operReqDelete";
      break;
    case "endo":
      division = "endoReqDelete";
      break;
    case "perio":
      division = "perioReqDelete";
      break;
    case "prosth":
      division = "prosthReqDelete";
      break;
    case "diag":
      division = "diagReqDelete";
      break;
    case "radio":
      division = "radioReqDelete";
      break;
    case "sur":
      division = "surReqDelete";
      break;
    case "pedo":
      division = "pedoReqDelete";
      break;
    case "ortho":
      division = "orthoReqDelete";
      break;
    default:
      break;
  }
  try {
    const response = await apiClient.delete(
      `/api/students/reqs/${division}/id/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//Instructors
export const getAllInstructors = async () => {
  try {
    const response = await apiClient.get(`/api/students/all/instructors`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getInstructorByEmail = async (instructorEmail) => {
  try {
    const response = await apiClient.get(
      `/api/students/instructors/instructorEmail/${instructorEmail}`
    );
    return response.data;
  } catch (error) {
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
    const response = await apiClient.get(
      `/api/students/reqs/${division}/instructorEmail/${instructorEmail}`
    );
    //"/reqs/operReq/instructorEmail/:instructorEmail"
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getUserByEmail = async (userEmail) => {
  try {
    const response = await apiClient.get(`/api/students/users/${userEmail}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getCompcasesDetails = async () => {
  try {
    const response = await apiClient.get(`/api/students/compcases/details`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getInstructorsByTeamleaderRole = async (roleId) => {
  try {
    const response = await apiClient.get(
      `/api/students/instructors/teamleaderRole/${roleId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const insertCompletedCase = async (compCase) => {
  //console.log("compCase", compCase);
  try {
    const response = await apiClient.post(
      `/api/students/reqs/c/compcases`,
      compCase
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getCompcaseReqByStudentEmail = async (studentEmail) => {
  try {
    const response = await apiClient.get(
      `/api/students/compcases/studentEmail/${studentEmail}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateCompReqById = async (id, req) => {
  try {
    const response = await apiClient.put(
      `/api/students/reqs/c/compcases/id/${id}`,
      req
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getCompReqByInstructorEmail = async (instructorEmail) => {
  try {
    const response = await apiClient.get(
      `/api/students/compcases/instructorEmail/${instructorEmail}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getStudentByTeamleaderEmail = async (teamleaderEmail) => {
  try {
    const response = await apiClient.get(
      `/api/students/students/teamleaderEmail/${teamleaderEmail}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getStudentByDivInstructorEmail = async (
  instructorEmail,
  division
) => {
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
    case "pedo":
      division = "pedoInstructorEmail";
      break;
    case "ortho":
      division = "orthoInstructorEmail";
      break;
    default:
      break;
  }
  try {
    const response = await apiClient.get(
      `/api/students/students/${division}/${instructorEmail}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllReqByDivision = async (division) => {
  try {
    const response = await apiClient.get(
      `/api/students/reqs/division/${division}`
    );
    //console.log("responseAPI", response);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateInstructorDivByInstructorEmail = async (
  instructorEmail,
  division
) => {
  try {
    const response = await apiClient.put(
      `/api/students/instructors/division/instructorEmail/${instructorEmail}`,
      division
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getInstructorsByDivision = async (division) => {
  try {
    const response = await apiClient.get(
      `/api/students/instructors/${division}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const insertUser = async (user) => {
  try {
    const response = await apiClient.post(`/api/students/add/users`, user);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateMinReqById = async (id, req) => {
  try {
    const response = await apiClient.put(
      `/api/students/reqs/minReq/id/${id}`,
      req
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateStudentDivInstructorByDivInstructorEmail = async (
  studentId,
  formData
) => {
  try {
    const response = await apiClient.put(
      `/api/students/students/division/instructorEmail/${studentId}`,
      formData
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const insertInstructor = async (instructor) => {
  try {
    const response = await apiClient.post(
      `/api/students/add/instructors`,
      instructor
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateUserById = async (id, user) => {
  try {
    const response = await apiClient.put(
      `/api/students/update/users/${id}`,
      user
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateInstructorByInstructorId = async (id, instructor) => {
  try {
    const response = await apiClient.put(
      `/api/students/update/instructors/instructorId/${id}`,
      instructor
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateRequestByStudentEmail = async (studentEmail, request) => {
  //console.log("request", request);
  try {
    const response = await apiClient.put(
      `/api/students/update/requests/studentEmail/${studentEmail}`,
      request
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateStatusByStudentEmail = async (studentEmail, status) => {
  //console.log("status", status);
  try {
    const response = await apiClient.put(
      `/api/students/update/status/studentEmail/${studentEmail}`,
      status
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteCompReqById = async (id) => {
  try {
    const response = await apiClient.delete(
      `/api/students/reqs/d/compcases/id/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateUserPictureByEmail = async (email, imgUrl) => {
  try {
    const response = await apiClient.put(
      `/api/students/update/picture/studentEmail/${email}`,
      imgUrl
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//////////////////////////////////////////
export const getPatientsByStudentEmail = async (studentEmail) => {
  try {
    const response = await apiClient.get(
      `/api/students/patients/studentEmail/${studentEmail}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getPatientsByTeamleaderEmail = async (teamleaderEmail) => {
  try {
    const response = await apiClient.get(
      `/api/students/patients/teamleaderEmail/${teamleaderEmail}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getPatientByHn = async (hn) => {
  try {
    const response = await apiClient.get(`/api/students/patients/hn/${hn}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getTxPlanByPatientHn = async (hn) => {
  try {
    const response = await apiClient.get(
      `/api/students/patients/txplan/hn/${hn}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const insertTxPlan = async (txPlan) => {
  try {
    const response = await apiClient.post(
      `/api/students/patients/txplan`,
      txPlan
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updatePatientbyhn = async (hn, patient) => {
  try {
    const response = await apiClient.put(
      `/api/students/patients/update/hn/${hn}`,
      patient
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateTreatmentById = async (id, treatment) => {
  console.log("id", treatment);
  try {
    const response = await apiClient.put(
      `/api/students/patients/update/treatment/id/${id}`,
      treatment
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getTreatmentsByApprovedInstructorEmail = async (
  instructorEmail
) => {
  try {
    const response = await apiClient.get(
      `/api/students/patients/treatments/approvedInstructorEmail/${instructorEmail}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getPatientNameByHn = async (hn) => {
  try {
    const response = await apiClient.get(
      `/api/students/patient/name/hn/${hn}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateTreatmentStatusById = async (id, status) => {
  try {
    const response = await apiClient.put(
      `/api/students/patients/treatments/update/status/id/${id}`,
      status
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getTxtypesByDivision = async (division) => {
  try {
    const response = await apiClient.get(
      `/api/students/txtypes/division/${division}`
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const insertNewPatient = async (patient) => {
  try {
    const response = await apiClient.post(
      `/api/students/patients/new`,
      patient
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const insertPatientsDataCsv = async (patients) => {
  try {
    //console.log("patients", patients);
    const response = await apiClient.post(
      `/api/students/patients/csv`,
      patients
    );
    return response.data;
  } catch (error) {
    // Extract error message from response
    const errorMsg =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(errorMsg);
  }
};

