import React from 'react';
import NavBarPatientBank from "./NavbarPatientBank";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import UploadPatientsCSV from '../../components/UploadPatientsCSV';

function AddMultiNewPatient() {
  return (
    <>
    
    <NavBarPatientBank />
    <Container>
        <Row className="justify-content-center">
            <Col md={10}>
                <h2>เพิ่มผู้ป่วยใหม่ด้วยไฟล์ CSV</h2>
                <UploadPatientsCSV />
            </Col>
        </Row>
    </Container>

    </>
  )
}

export default AddMultiNewPatient