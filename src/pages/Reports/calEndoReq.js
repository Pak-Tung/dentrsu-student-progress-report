export const calEndoReq = (rqm, minR) => {
  let totalReq = {
    RSU: {
      RCT_Anterior_or_Premolar: 0,
      RCT_Molar: 0,
      Emergency_RCT: 0,
      Talk_case: 0,
      Recall_6_months: 0,
      Exam_RCT: 0,
    },
    CDA: {
      RCT_Anterior_or_Premolar: 0,
      Exam_RCT: 0,
    },
  };

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "RCT Anterior or premolar") {
        totalReq.RSU.RCT_Anterior_or_Premolar += parseFloat(item.req_RSU);
        item.extraRSU = "RCT Anterior";
      } else if (item.type === "RCT Molar") {
        totalReq.RSU.RCT_Molar += parseFloat(item.req_RSU);
        item.extraRSU = "RCT Molar";
      } else if (item.type === "Emergency RCT") {
        totalReq.RSU.Emergency_RCT += parseFloat(item.req_RSU);
        item.extraRSU = "Emergency RCT";
      } else if (item.type === "Talk case") {
        totalReq.RSU.Talk_case += parseFloat(item.req_RSU);
        item.extraRSU = "Talk case";
      } else if (item.type === "Recall 6 months") {
        totalReq.RSU.Recall_6_months += parseFloat(item.req_RSU);
        item.extraRSU = "Recall 6 months";
      } else if (item.type === "Exam RCT") {
        totalReq.RSU.Exam_RCT += parseFloat(item.req_RSU);
        item.extraRSU = "Exam RCT";
      }
    }
  });

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "RCT Anterior or premolar") {
        totalReq.CDA.RCT_Anterior_or_Premolar += parseFloat(item.req_DC);
        item.extraCDA = "RCT Anterior";
      } else if (item.type === "Exam RCT") {
        totalReq.CDA.Exam_RCT += parseFloat(item.req_DC);
        item.extraCDA = "Exam RCT";
      }
    }
  });

  rqm.forEach((item) => {
    if (
      totalReq.RSU.RCT_Anterior_or_Premolar <
        minR.RSU.RCT_Anterior_or_Premolar &&
      totalReq.RSU.RCT_Molar >= minR.RSU.RCT_Molar
    ) {
      totalReq.RSU.RCT_Anterior_or_Premolar += parseFloat(item.req_RSU);
      totalReq.CDA.RCT_Anterior_or_Premolar += parseFloat(item.req_RSU);
      item.extraRSU = "Molar to Anterior";
      item.extraCDA = "Molar to Anterior";
      totalReq.RSU.RCT_Molar -= parseFloat(item.req_RSU);
    }
  });
  return { totalReq, rqm };
};
