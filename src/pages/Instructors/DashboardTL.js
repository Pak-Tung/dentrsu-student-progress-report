import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getStudentsByTeamLeaderId, getTeamLeaderById } from '../../features/apiTL';
import Student from '../../components/Student';

function DashboardTL() {
    const email = "test.t@rsu.ac.th";
    const teamLeaderId = 0;

    const [students, setStudents] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await getStudentsByTeamLeaderId(teamLeaderId);
            console.log(result);    
            const { error } = result;
            const data = result.data;
            if (error) {
                console.log(error);        
            } else {
                if (data) {
                    console.log(data);
                    setStudents(data);
                } else {
                    console.log("Data is undefined");
                }
            }
        };
        fetchData();
    }, [])

  return (
    <div className='container'>DashboardTL
        <div className="row">
            {students.length > 0 ?(
            students.map((student) => {
                return (
                    <div className="col-md-4" key={student.studentId}>
                        <Student student={student} />
                    </div>
                    );
            })
            ) : (
                <div className="col-md-12">
                    <h3>Students not found</h3>
                </div>
            )}
        </div>
    </div>
  )
}

export default DashboardTL;