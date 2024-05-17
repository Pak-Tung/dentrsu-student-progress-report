import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Student from "../../components/Student";
import { getAllStudents } from "../../features/apiCalls";

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllStudents();
                const { error, data } = result;

                if (error) {
                    setError(error);
                } else if (data && data.result) {
                    setStudents(data.result);
                } else {
                    setError("No data available");
                }
            } catch (err) {
                setError("Failed to fetch students");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mt-5">
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            ) : students.length > 0 ? (
                <div className="row">
                    {students.map((student) => (
                        <div className="col-md-4 mb-4" key={student.studentId}>
                            <Student student={student} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <h3>No students found</h3>
                </div>
            )}
        </div>
    );
};

export default Students;


// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Student from "../../components/Student";
// import { getAllStudents } from "../../features/apiCalls";
// import './CustomStyles.css';


// const Students = () => {
//     const [students, setStudents] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const result = await getAllStudents();    
//             const { error } = result;
//             const data = result.data.result;
//             if (error) {
//                 console.log(error);        
//             } else {
//                 if (data) {
//                     console.log(data);
//                     setStudents(data);
//                 } else {
//                     console.log("Data is undefined");
//                 }
//             }
//         };
//         fetchData();
//     }, []);
//     return (
//         <div className="container">
//             <div className="row">
//                 {students.length > 0 ?(
//                 students.map((student) => {
//                     return (
//                         <div className="col-md-4" key={student.studentId}>
//                             <Student student={student} />
//                         </div>
//                         );
//                 })
//                 ) : (
//                     <div className="col-md-12">
//                         <h3>Students not found</h3>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Students;