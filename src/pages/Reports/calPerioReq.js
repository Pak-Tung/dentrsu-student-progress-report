import { allTotalDivReq } from "./allTotalDivReq";

export const calPerioReq = (rqm, minReq) => {
  let totalReq = allTotalDivReq().perio;

  //Calculate RSU
  let totalCaseG = 0;
  let totalCaseP = 0;
  let totalComplexities = 0;
  let totalOHI1stExam = 0;
  let totalOHI2ndExam = 0;
  let totalSRP1stExam = 0;

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "Case G" && item.area === "Completed recall") {
        totalCaseG += 1;
        item.extraRSU = "Case G, Completed recall";
      } else if (item.type === "Case P" && item.area === "Completed recall") {
        totalCaseP += 1;
        item.extraRSU = "Case P, Completed recall";
      } else if (item.type === "OHI 1st exam") {
        totalOHI1stExam += parseFloat(item.req_RSU);
        item.extraRSU = "OHI 1st exam";
      } else if (item.type === "OHI 2nd exam") {
        totalOHI2ndExam += parseFloat(item.req_RSU);
        item.extraRSU = "OHI 2nd exam";
      }else if (item.type === "SRP 1st exam") {
        totalSRP1stExam += parseFloat(item.req_RSU);
        item.extraRSU = "SRP 1st exam";
      }

      if (item.area === "Completed recall") {
        totalComplexities += parseFloat(item.req_RSU);
        item.extraRSU += ", Complexities";
      }
    }
  });

  //Calculate CDA

  let totalCaseG_CDA = 0;
  let totalCaseP_CDA = 0;
  let totalCDACases = 0;
  let totalSRP2ndExam = 0;

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "Case G") {
        //totalCaseG_CDA += 1;
        item.extraCDA = "Case G";
      } else if (item.type === "Case P") {
        totalCaseP_CDA += 1;
        item.extraCDA = "Case P";
      } else if (item.type === "SRP 2nd exam") {
        totalSRP2ndExam += parseFloat(item.req_DC);
        item.extraCDA = "SRP 2nd exam";
      }
      if (
        item.area === "Completed recall" ||
        item.area === "Only recall" ||
        item.area === "Completed recheck"
      ) {
        totalCDACases += 1;
        item.extraCDA = "CDA Cases";
      }
    }
  });

  totalReq.RSU.Case_G = totalCaseG;
  //totalReq.CDA.Case_G = totalCaseG_CDA;
  totalReq.RSU.Case_P = totalCaseP;
  totalReq.CDA.Case_P = totalCaseP_CDA;
  totalReq.RSU.Complexities = totalComplexities;
  totalReq.CDA.CDA_Cases = totalCDACases;
  totalReq.RSU.OHI_1st_Exam = totalOHI1stExam;
  totalReq.RSU.OHI_2n_Exam = totalOHI2ndExam;
  totalReq.RSU.SRP_1st_Exam = totalSRP1stExam;
  totalReq.CDA.SRP_2nd_Exam = totalSRP2ndExam;

  return { rqm, totalReq };
};
