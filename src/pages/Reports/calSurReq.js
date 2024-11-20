import { allTotalDivReq } from "./allTotalDivReq";

export const calSurReq = (rqm, minReq) => {
  let totalReq = allTotalDivReq().sur;

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "Aseptic station") {
        totalReq.RSU.Aseptic_station += parseFloat(item.req_RSU);
        item.extraRSU = "Aseptic station";
      } else if (item.type === "Suture station") {
        totalReq.RSU.Suture_station += parseFloat(item.req_RSU);
        item.extraRSU = "Suture station";
      } else if (item.type === "Vital sign station") {
        totalReq.RSU.Vital_sign_station += parseFloat(item.req_RSU);
        item.extraRSU = "Vital sign station";
      } else if (item.type === "IANB exam") {
        totalReq.RSU.IANB_exam += parseFloat(item.req_RSU);
        item.extraRSU = "IANB exam";
      } else if (item.type === "Impact (model)") {
        totalReq.RSU.Impact_in_model += parseFloat(item.req_RSU);
        item.extraRSU = "Impact (model)";
      } else if (item.type === "Extraction") {
        totalReq.RSU.Extraction += parseFloat(item.req_RSU);
        item.extraRSU = "Extraction";
      } else if (item.type === "Impact") {
        totalReq.RSU.Impact += parseFloat(item.req_RSU);
        if (totalReq.RSU.Impact <= minReq.RSU.Impact) {
          item.extraRSU = "Impact";
        } else if (totalReq.RSU.Impact > minReq.RSU.Impact) {
          item.extraRSU = "Impact surplus";
        }
      } else if (item.type === "Exam: extraction (RSU)") {
        totalReq.RSU.Exam_extraction_RSU += parseFloat(item.req_RSU);
        item.extraRSU = "Exam extraction";
      } else if (item.type === "Exam: impact (RSU)") {
        totalReq.RSU.Exam_impact_RSU += parseFloat(item.req_RSU);
        item.extraRSU = "Exam impact";
      }
    }
  });

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "Extraction") {
        totalReq.CDA.Extraction += parseFloat(item.req_DC);
        item.extraCDA = "Extraction";
      } else if (item.type === "Impact") {
        totalReq.CDA.Impact += parseFloat(item.req_DC);
        if (totalReq.CDA.Impact <= minReq.CDA.Impact) {
          item.extraCDA = "Impact";
        } else if (totalReq.CDA.Impact > minReq.CDA.Impact) {
          item.extraCDA = "Impact surplus";
        }
      } else if (item.type === "Exam: extraction (CDA)") {
        totalReq.CDA.Exam_extraction_CDA += parseFloat(item.req_DC);
        item.extraCDA = "Exam extraction";
      } else if (item.type === "Exam: impact (CDA)") {
        totalReq.CDA.Exam_impact_CDA += parseFloat(item.req_DC);
        item.extraCDA = "Exam impact";
      }
    }
  });

  let totalTransfer = 0;
  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.extraRSU === "Impact surplus") {
        if (
          totalReq.RSU.Extraction < minReq.RSU.Extraction &&
          totalTransfer < 2
        ) {
          totalReq.RSU.Extraction += parseFloat(item.req_RSU);
          item.extraRSU = "Extraction substitute by Impact";
          totalReq.RSU.Impact -= parseFloat(item.req_RSU);
        }
      }
      if (item.extraCDA === "Impact surplus") {
        if (
          totalReq.CDA.Extraction < minReq.CDA.Extraction &&
          totalTransfer < 2
        ) {
          totalReq.CDA.Extraction += parseFloat(item.req_DC);
          item.extraCDA = "Extraction substitute by Impact";
          totalReq.CDA.Impact -= parseFloat(item.req_DC);
          totalTransfer += 1;
        }
      }
      
    }
  });

  return { totalReq, rqm };
};
