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

        <Route path="/memberInTeam" element={<MemberInTeam />} />
        <Route path="/divisionAdvisee" element={<DivisionAdvisee />} />
        <Route path="/minReq" element={<MinimumReq />} />

        <Route path="/reqApprovedEdit" element={<EditApprovedReq />} />
        <Route path="/editReqOfDivision" element={<EditDivisionReq />} />
        <Route path="/reqDivOfAllStudent" element={<DivisionReqOfStudent />} />
        <Route path="/assignAdvisor" element={<DivisionAdvisor />} />
        <Route path="/assignAdvisee" element={<ManageDivisionAdvisee />} />
        <Route path="/requestComplete" element={<RequestComplete />} />

        <Route path="/addDivision" element={<AddDivision />} />
        <Route path="/addUser" element={<UserManagement />} />
        <Route path="/editInstructors" element={<EditInstructors />} />
        <Route path="/editStudents" element={<EditStudents />} />
        
        <Route path="/" element={<RoleLogin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
