import { React, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getStudentByEmail } from "../../features/apiCalls";
import Cookies from "js-cookie";
import GoogleLogin from "../../components/GoogleLogin";
import Navbar from "../../components/Navbar";
import SubmissionForm from "../../components/SubmissionForm";

function OperSubmit() {
  const division = "oper";
  Cookies.get("user") === undefined
    ? Cookies.set("user", JSON.stringify({}))
    : console.log("User email", Cookies.get("user"));
  const user = JSON.parse(Cookies.get("user"));
  console.log("User in Profile", user);
  const userEmail = user.email;
  console.log("UserEmail", userEmail);
  //const userName = user.name;

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
          <div className="d-flex justify-content-center">
            <h2>Oper Req Submission</h2>
          </div>
          <div
            className="justify-content-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            Student:{" "}
            {student.studentId +
              " " +
              student.title +
              " " +
              student.studentName}
          </div>
          <div className="d-flex justify-content-center">
            <SubmissionForm division={division} />
          </div>
        </>
      ) : (
        <>
          <div>
            <GoogleLogin />
          </div>
        </>
      )}
    </>
  );
}

export default OperSubmit;
