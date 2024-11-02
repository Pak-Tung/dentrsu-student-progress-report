import React from "react";
import NavbarPatientBank from "./NavbarPatientBank";
import { Container, Row, Col, Alert } from "react-bootstrap";
import UploadPatientsCSV from "../../components/UploadPatientsCSV";
import LoginByEmail from "../../components/LoginByEmail";
import Cookies from "js-cookie";

function AddMultiNewPatient() {
  const userEmail = JSON.parse(Cookies.get("user")).email;

  return (
    <>
      {userEmail ? (
        <>
          <NavbarPatientBank />
          <Container>
            <Row className="justify-content-center">
              <Col md={12}>
                <h2>เพิ่มผู้ป่วยใหม่ด้วยไฟล์ CSV</h2>
                <Alert variant="info">
                  คำแนะนำ: ไฟล์ประกอบด้วย 8 คอลัมน์ คือ เลขที่บัตรผู้ป่วย,
                  ชื่อ-นามสกุลผู้ป่วย, เบอร์โทรศัพท์ผู้ป่วย, ปี
                  (ค.ศ.)-เดือน-วันเกิด, ชื่อผู้ติดต่อกรณีฉุกเฉิน,
                  เบอร์ติดต่อกรณีฉุกเฉิน, ความสัมพันธ์กับผู้ป่วย,
                  อีเมลของอาจารย์ทีมลีดเดอร์
                </Alert>
                <UploadPatientsCSV />
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <div>
          <LoginByEmail />
        </div>
      )}
    </>
  );
}

export default AddMultiNewPatient;
