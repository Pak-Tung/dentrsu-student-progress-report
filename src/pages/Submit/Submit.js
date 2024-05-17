import { React, useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getStudentByEmail } from "../../features/apiCalls";
import Cookies from "js-cookie";
import GoogleLogin from "../../components/GoogleLogin";
import Navbar from "../../components/Navbar";

function Submit() {
  Cookies.get("user") === undefined
    ? Cookies.set("user", JSON.stringify({}))
    : console.log("User email", Cookies.get("user"));
  const user = JSON.parse(Cookies.get("user"));
  console.log("User in Profile", user);
  const userEmail = user.email;
  console.log("UserEmail", userEmail);
  const userName = user.name;

  const [student, setStudent] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getStudentByEmail(userEmail);
      const { error } = result;
      const data = result[0];
      console.log("result", result[0]);
      if (error) {
        console.log(error);
      } else {
        if (data) {
          console.log(data);
          setStudent(data);
        } else {
          console.log("Data is undefined");
        }
      }
    };
    fetchData();
  }, [userEmail]);



  return (
    <>
      {userEmail !== undefined ? (
        <>
          <Navbar />
          <div className='d-flex justify-content-center'>
            <h2>Requirement Submission</h2>
            </div>
            <br />
          <div
            className="justify-content-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
          </div>
          <div className="d-flex justify-content-center">
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">Name: {userName}</h5>
                <p className="card-text">Email: {userEmail}</p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Floor: {student.floor}</li>
                <li className="list-group-item">
                  Unit: {student.bay + student.unitNumber}
                </li>
                <li className="list-group-item">Status: {student.status}</li>
                
              </ul>
              {/* <div className="card-body">
                <div className="row justify-content-evenly">
                  <div className="col-6">
                    <button className="btn btn-outline-success">
                      Submit Requirements
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-outline-primary">
                      Overview Requirements
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </>
      ) : (
        <>
          <GoogleLogin />
        </>
      )}
    </>
  )
}

export default Submit;