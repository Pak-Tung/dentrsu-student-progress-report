import React, { useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getTeamLeaderById } from '../features/apiTL';



const Student = (student) => {
  const { studentId, title, studentName, status, startClinicYear, floor, bay, unitNumber, image, teamLeaderId } = student.student;
  let year = new Date().getFullYear() - parseInt(startClinicYear) + 5;
  year = new Date().getMonth() < 6 ? year - 1 : year;

  let teamLeaderName = "";
  teamLeaderId === 0? teamLeaderName = "Not assigned": teamLeaderName = "Assigned";
  
  return (
      <div className="card" style={{ width: '400px' }}>
        <img className="card-img-top" src={ image } alt="StudentPic" style={{ width: '100%' }} />
        <div className="card-body">
          <h4 className="card-title">{studentId} {title} {studentName}</h4>
          <h5 className='card-text'>Status: {status}</h5>
          <p className="card-text">Year: {year}th Floor: {floor} Unit: {bay+unitNumber}</p>
          <p className="card-text">Team leader: {teamLeaderName}</p>
          <p className='card-text'></p>
          <button className="btn btn-primary">Overall Progress</button>

          <Link to={`/updateStudent/${studentId}`}>
            <button className="btn btn-success">
              Update
            </button>
          </Link>
        </div>
      </div>
  )
}

export default Student;