import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import Student from './components/Student';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Students from './pages/students/Students';
// import DashboardTL from './pages/Instructors/DashboardTL';
// import Profile from './pages/students/Profile';
import SubmitReports from './pages/Submit/SubmitReports';
import RoleLogin from './pages/RoleLogin';
import NoPermission from './pages/NoPermission';
import Submit from './pages/Submit/Submit';
import OperSubmit from './pages/Submit/OperSubmit';
import OperReport from './pages/Reports/OperReport';
import Overview from './pages/Reports/Overview';
//import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/access_denied' element={<NoPermission />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/students" element={<Students />} />
          <Route path="/reportSubmission" element={<SubmitReports />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/operSubmit" element={<OperSubmit />} />
          <Route path="/operReport" element={<OperReport />} />
          {/* <Route path="/instructors" element={<DashboardTL />} /> */}
          <Route path="/overview" element={<Overview />} />
          <Route path="/" element={<RoleLogin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
