import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoleLogin from "./pages/RoleLogin";
import NoPermission from "./pages/NoPermission";
import Overview from "./pages/Reports/Overview";
import ReqSubmit from "./pages/Submit/ReqSubmit";
import ReqStatus from "./pages/Reports/ReqStatus";
import ReqApproval from "./pages/instructors/ReqApproval";
import CompSubmit from "./pages/Submit/CompSubmit";
import CompStatus from "./pages/Reports/CompStatus";
import CompOverview from "./pages/Reports/CompOverview";
import CompApproval from "./pages/instructors/CompApproval";
import MemberInTeam from "./pages/instructors/MemberInTeam";
import DivisionAdvisee from "./pages/instructors/DivisionAdvisee";
import MinimumReq from "./pages/instructors/MinimumReq";
import EditApprovedReq from "./pages/admins/EditApprovedReq";
import EditDivisionReq from "./pages/admins/EditDivisionReq";
import DivisionReqOfStudent from "./pages/admins/DivisionReqOfStudent";
import DivisionAdvisor from "./pages/admins/DivisionAdvisor";
import ManageDivisionAdvisee from "./pages/admins/ManageDivisionAdvisee";
import AddDivision from "./pages/root/AddDivision";
import UserManagement from "./pages/root/UserManagement";
import EditInstructors from "./pages/root/EditInstructors";
import EditStudents from "./pages/root/EditStudents";
import CheckStatus from "./pages/students/CheckStatus";
import RequestComplete from "./pages/instructors/RequestComplete";
import ProfileAdmin from "./pages/admins/ProfileAdmin";
import AllPatients from "./pages/students/AllPatients";
import AllTeamleaderPatients from "./pages/instructors/AllTeamleaderPatients";
import TreatmentApproval from "./pages/instructors/TreatmentApproval";
import UploadPatientsCSV from "./components/UploadPatientsCSV";
import CreateNewPatient from "./components/CreateNewPatient";
import AddNewPatient from "./pages/patientBank/AddNewPatient";
import AssignPatientToInstructor from "./pages/patientBank/AssignPatientToInstructor";
import SearchPatientByHN from "./pages/patientBank/SearchPatientByHN";
import SearchPatientByStudent from "./pages/patientBank/SearchPatientByStudent";
import SearchPatientByInstructor from "./pages/patientBank/SearchPatientByInstructor";
import AddMultiNewPatient from "./pages/patientBank/AddMultiNewPatient";
import ProfilePatientBank from "./pages/patientBank/ProfilePatientBank";
import ProfileSupervisor from "./pages/supervisor/ProfileSupervisor";
import StudentAllReq from "./pages/supervisor/StudentAllReq";
import InstructorOverview from "./pages/supervisor/InstructorOverview";

//import SelectRoleAdmin from "./pages/admins/selectRoleAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/access_denied" element={<NoPermission />} />
        <Route path="/reqSubmit" element={<ReqSubmit />} />
        <Route path="/compSubmit" element={<CompSubmit />} />
        <Route path="/reqStatus" element={<ReqStatus />} />
        <Route path="/compReport" element={<CompStatus />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/compOverview" element={<CompOverview />} />
        <Route path="/reqApproval" element={<ReqApproval />} />
        <Route path="/compApproval" element={<CompApproval />} />
        <Route path="/checkStatus" element={<CheckStatus />} />
        <Route path="/allPatients" element={<AllPatients />} />
     
        <Route path="/allTeamleaderPatients" element={<AllTeamleaderPatients />} />
        <Route path="/memberInTeam" element={<MemberInTeam />} />
        <Route path="/divisionAdvisee" element={<DivisionAdvisee />} />
        <Route path="/minReq" element={<MinimumReq />} />
        <Route path="/profileAdmin" element={<ProfileAdmin />} />

        <Route path="/txApproval" element={<TreatmentApproval />} />
        <Route path="/reqApprovedEdit" element={<EditApprovedReq />} />
        <Route path="/editReqOfDivision" element={<EditDivisionReq />} />
        <Route path="/reqDivOfAllStudent" element={<DivisionReqOfStudent />} />
        <Route path="/assignAdvisor" element={<DivisionAdvisor />} />
        <Route path="/assignAdvisee" element={<ManageDivisionAdvisee />} />
        <Route path="/requestComplete" element={<RequestComplete />} />
        <Route path="/newPatient" element={<CreateNewPatient />} />

        <Route path="/addDivision" element={<AddDivision />} />
        <Route path="/addUser" element={<UserManagement />} />
        <Route path="/editInstructors" element={<EditInstructors />} />
        <Route path="/editStudents" element={<EditStudents />} />

        <Route path="/addNewPatient" element={<AddNewPatient />} />
        <Route path="/assignPatientToInstructor" element={<AssignPatientToInstructor />} />
        <Route path="/searchPatientByHn" element={<SearchPatientByHN />} />
        <Route path="/searchPatientByStudent" element={<SearchPatientByStudent />} />
        <Route path="/searchPatientByInstructor" element={<SearchPatientByInstructor />} />
        <Route path="/addMultiNewPatient" element={<AddMultiNewPatient />} />
        <Route path="/profilePatientBank" element={<ProfilePatientBank />} />
        <Route path="/uploadPatientsCSV" element={<UploadPatientsCSV />} />

        <Route path="/profileSupervisor" element={<ProfileSupervisor />} />
        <Route path="/studentAllReq" element={<StudentAllReq />} />
        <Route path="/instructorOverview" element={<InstructorOverview />} />
        
        
        <Route path="/" element={<RoleLogin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
