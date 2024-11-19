/**********Calculation criteria **********/
// RSU:
//Diastema closure นับเป็น class IV
//Class II 1 ซี่ย้ายไปนับเป็น class I ได้ 1 R (unlimit)
//Class IV 1 ซี่ย้ายไปนับเป็น class III ได้ 1 R (unlimit)
//PRR ย้ายไปนับเป็น class I ได้ (max 1 R)

//CDA:
//สามารถใช้ class II 1 ซี่ ทดแทน class I III หรือ IV ได้ 1 ด้าน
//สามารถใช้ class I-V 1 ซี่ ทดแทนอุดฟันอื่นๆได้ 1 ด้าน
/**********End of criteria **********/

export const calOperReg = (rqm, minReq) => {
  let totalReq = {
    RSU: {
      Class_I: 0,
      Class_II: 0,
      Class_III: 0,
      Class_IV: 0,
      Class_V: 0,
      Class_VI: 0,
      Recall_completed_case: 0,
      Recall_any: 0,
      Exam_Class_II: 0,
      Exam_Class_V: 0,
      Polishing: 0,
      Sealant: 0,
      PRR: 0,
      Caries_control: 0,
      Emergency_tx: 0,
      Inlay: 0,
      Onlay: 0,
      Diastema_closure: 0,
      Veneer: 0,
      Minimum_total_R: 0,
    },
    CDA: {
      Class_I: 0,
      Class_II: 0,
      Class_III_or_IV: 0,
      Class_V: 0,
      Any_class: 0,
    },
  };

  //Calculate RSU
  let totalClassI = 0;
  let totalClassII = 0;
  let totalClassIII = 0;
  let totalClassIV = 0;
  let totalDiastemaClosure = 0;
  let totalPRR = 0;
  let totalPRRminus1 = 0;

  //Calculate CDA
  let totalClassI_CDA = 0;
  let totalClassII_CDA = 0;
  let totalClassIIIorIV = 0;
  let totalClassV = 0;
  let totalAnyClass = 0;

  //console.log("rqm", rqm);

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "Class I") {
        totalClassI += parseFloat(item.req_RSU);
        if (totalClassI <= minReq.RSU.Class_I) {
          item.extra = "Class I";
        } else {
          item.extra = "Class I Surplus";
        }
      } else if (item.type === "Class II") {
        totalClassII += parseFloat(item.req_RSU);
        if (totalClassII <= minReq.RSU.Class_II) {
          item.extra = "Class II";
        } else {
          item.extra = "Class II Surplus";
        }
      } else if (item.type === "Class III") {
        totalClassIII += parseFloat(item.req_RSU);
        if (totalClassIII <= minReq.RSU.Class_III) {
          item.extra = "Class III";
        } else {
          item.extra = "Class III Surplus";
        }
      } else if (item.type === "Class IV") {
        totalClassIV += parseFloat(item.req_RSU);
        if (totalClassIV <= minReq.RSU.Class_IV) {
          item.extra = "Class IV";
        } else {
          item.extra = "Class IV Surplus";
        }
      } else if (item.type === "Class V") {
        totalReq.RSU.Class_V += parseFloat(item.req_RSU);
        item.extra = "Class V";
      } else if (item.type === "Diastema closure") {
        totalDiastemaClosure += parseFloat(item.req_RSU);
        if (totalDiastemaClosure <= minReq.RSU.Diastema_closure) {
          item.extra = "Diastema closure";
        } else {
          totalClassIV += parseFloat(item.req_RSU);
          totalDiastemaClosure -= parseFloat(item.req_RSU);
          totalClassIIIorIV += parseFloat(item.req_RSU);
          item.extra = "Class IV from Diastema";
          item.extraCDA = "Class III or IV from Diastema";
        }
      } else if (item.type === "PRR") {
        totalPRR += parseFloat(item.req_RSU);
        if (totalPRR <= 1.0) {
          totalClassI += parseFloat(item.req_RSU);
          item.extra = "Class I from PRR";
          totalPRR += totalClassI;
        } else if (totalPRR > 1.0) {
          totalPRRminus1 += parseFloat(item.req_RSU);
          item.extra = "PRR";
        }
      } else if (item.type === "Recall completed case") {
        totalReq.RSU.Recall_completed_case += parseFloat(item.req_RSU);
        item.extra = "Recall completed case";
      } else if (item.type === "Recall any") {
        totalReq.RSU.Recall_any += parseFloat(item.req_RSU);
        item.extra = "Recall any";
      } else if (item.type === "Exam Class II") {
        totalReq.RSU.Exam_Class_II += parseFloat(item.req_RSU);
        item.extra = "Exam Class II";
      } else if (item.type === "Exam Class V") {
        totalReq.RSU.Exam_Class_V += parseFloat(item.req_RSU);
        item.extra = "Exam Class V";
      } else if (item.type === "Polishing") {
        totalReq.RSU.Polishing += parseFloat(item.req_RSU);
        item.extra = "Polishing";
      } else if (item.type === "Sealant") {
        totalReq.RSU.Sealant += parseFloat(item.req_RSU);
        item.extra = "Sealant";
      } else if (item.type === "Caries control") {
        totalReq.RSU.Caries_control += parseFloat(item.req_RSU);
        item.extra = "Caries control";
      } else if (item.type === "Emergency tx") {
        totalReq.RSU.Emergency_tx += parseFloat(item.req_RSU);
        item.extra = "Emergency tx";
      } else if (item.type === "Inlay") {
        totalReq.RSU.Inlay += parseFloat(item.req_RSU);
        item.extra = "Inlay";
      } else if (item.type === "Onlay") {
        totalReq.RSU.Onlay += parseFloat(item.req_RSU);
        item.extra = "Onlay";
      } else if (item.type === "Veneer") {
        totalReq.RSU.Veneer += parseFloat(item.req_RSU);
        item.extra = "Veneer";
      } else if (item.type === "Class VI") {
        totalReq.RSU.Class_VI += parseFloat(item.req_RSU);
        item.extra = "Minimum total R";
      }
    }
  });

  if (totalClassII > minReq.RSU.Class_II && totalClassI < minReq.RSU.Class_I) {
    rqm.forEach((item) => {
      if (item.isApproved === 1) {
        if (
          item.type === "Class II" &&
          item.extra === "Class II Surplus" &&
          totalClassI < minReq.RSU.Class_I
        ) {
          totalClassI += 1;
          item.extra = "Class I substitute by II";
          totalClassII -= parseFloat(item.req_RSU);
        }
      }
    });
  }

  totalReq.RSU.Class_I = totalClassI;
  totalReq.RSU.Class_II = totalClassII;
  totalReq.RSU.PRR = totalPRRminus1;

  if (
    totalClassIV > minReq.RSU.Class_IV &&
    totalClassIII < minReq.RSU.Class_III
  ) {
    rqm.forEach((item) => {
      if (item.isApproved === 1) {
        if (
          item.type === "Class IV" &&
          item.extra === "Class IV Surplus" &&
          totalClassIII < minReq.RSU.Class_III
        ) {
          totalClassIII += 1;
          item.extra = "Class III substitute by IV";
          totalClassIV -= parseFloat(item.req_RSU);
        }
      }
    });
  }

  totalReq.RSU.Class_III = totalClassIII;
  totalReq.RSU.Class_IV = totalClassIV;
  totalReq.RSU.Diastema_closure = totalDiastemaClosure;

  totalReq.RSU.Minimum_total_R =
    totalReq.RSU.Class_I +
    totalReq.RSU.Class_II +
    totalReq.RSU.Class_III +
    totalReq.RSU.Class_IV +
    totalReq.RSU.Class_V +
    totalReq.RSU.Recall_completed_case +
    totalReq.RSU.Recall_any +
    totalReq.RSU.Exam_Class_II +
    totalReq.RSU.Exam_Class_V +
    totalReq.RSU.Polishing +
    totalReq.RSU.Sealant +
    totalReq.RSU.PRR +
    totalReq.RSU.Caries_control +
    totalReq.RSU.Emergency_tx +
    totalReq.RSU.Inlay +
    totalReq.RSU.Onlay +
    totalReq.RSU.Diastema_closure +
    totalReq.RSU.Veneer +
    totalReq.RSU.Class_VI;

  

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "Class II") {
        totalClassII_CDA += parseFloat(item.req_DC);
        if (totalClassII_CDA <= minReq.CDA.Class_II) {
          item.extraCDA = "Class II";
        } else {
          item.extraCDA = "Class II Surplus";
        }
      } else if (item.type === "Class I") {
        totalClassI_CDA += parseFloat(item.req_DC);
        if (totalClassI_CDA <= minReq.CDA.Class_I) {
          item.extraCDA = "Class I";
        } else {
          item.extraCDA = "Class I Surplus";
        }
      } else if (item.type === "Class III" || item.type === "Class IV") {
        totalClassIIIorIV += parseFloat(item.req_DC);
        if (totalClassIIIorIV <= minReq.CDA.Class_III_or_IV) {
          item.extraCDA = "Class III or IV";
        } else {
          item.extraCDA = "Class III or IV Surplus";
        }
      } else if (item.type === "Class V") {
        totalClassV += parseFloat(item.req_DC);
        if (totalClassV <= minReq.CDA.Class_V) {
          item.extraCDA = "Class V";
        } else {
          item.extraCDA = "Class V Surplus";
        }
      } else if (item.type === "Class VI") {
        totalAnyClass += parseFloat(item.req_DC);
        item.extraCDA = "Any class";
      }
    }
  });

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.extraCDA === "Class II Surplus") {
        if (totalClassI_CDA < minReq.CDA.Class_I) {
          totalClassI_CDA += 1;
          item.extraCDA = "Class I substitute by II";
          totalClassII_CDA -= parseFloat(item.req_DC);
        } else if (totalClassIIIorIV < minReq.CDA.Class_III_or_IV) {
          totalClassIIIorIV += 1;
          item.extraCDA = "III/IV substitute by II";
          totalClassII_CDA -= parseFloat(item.req_DC);
        }
      }
    }
  });

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.extraCDA === "Class I Surplus") {
        totalAnyClass += parseFloat(item.req_DC);
        item.extraCDA = "Any class";
        totalClassI_CDA -= parseFloat(item.req_DC);
      } else if (item.extraCDA === "Class III or IV Surplus") {
        totalAnyClass += parseFloat(item.req_DC);
        item.extraCDA = "Any class";
        totalClassIIIorIV -= parseFloat(item.req_DC);
      } else if (item.extraCDA === "Class V Surplus") {
        totalAnyClass += parseFloat(item.req_DC);
        item.extraCDA = "Any class";
        totalClassV -= parseFloat(item.req_DC);
      } else if (item.extraCDA === "Class II Surplus") {
        totalAnyClass += parseFloat(item.req_DC);
        item.extraCDA = "Any class";
        totalClassII_CDA -= parseFloat(item.req_DC);
      } 
    }
  });

  totalReq.CDA.Class_I = totalClassI_CDA;
  totalReq.CDA.Class_II = totalClassII_CDA;
  totalReq.CDA.Class_III_or_IV = totalClassIIIorIV;
  totalReq.CDA.Class_V = totalClassV;
  totalReq.CDA.Any_class = totalAnyClass;

  return { totalReq, rqm };
};
