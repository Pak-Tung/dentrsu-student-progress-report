import { allTotalDivReq } from "./allTotalDivReq";

export const calRadioReq = (rqm, minReq)=>{
    let totalReq = allTotalDivReq().radio;

      rqm.forEach((item) => {
        if (item.isApproved === 1) {
          if (item.type === "Full mouth periapical radiograph") {
            totalReq.RSU.Full_mouth_periapical_radiograph += parseFloat(item.req_RSU);
            item.extraRSU = "Full mouth periapical radiograph";
          } else if (item.type === "Periapical radiograph") {
            totalReq.RSU.Periapical_radiograph += parseFloat(item.req_RSU);
            item.extraRSU = "Periapical radiograph";
          } else if (item.type === "Bitewing radiograph") {
            totalReq.RSU.Bitewing_radiograph += parseFloat(item.req_RSU);
            item.extraRSU = "Bitewing radiograph";
          } else if (item.type === "Extraoral and Special technique radiograph") {
            totalReq.RSU.Extraoral_and_Special_technique_radiograph += parseFloat(item.req_RSU);
            item.extraRSU = "Extraoral and Special technique radiograph";
          } else if (item.type === "Film interpretation") {
            totalReq.RSU.Film_interpretation += parseFloat(item.req_RSU);
            item.extraRSU = "Film interpretation";
          } else if (item.type === "Journal club") {
            totalReq.RSU.Journal_club += parseFloat(item.req_RSU);
            item.extraRSU = "Journal club";
          }
        }
      });

      rqm.forEach((item) => {
        if (item.isApproved === 1) {
          if (item.type === "Exam periapical radiograph (anterior teeth)") {
            totalReq.CDA.Exam_periapical_radiograph_anterior_teeth += parseFloat(item.req_DC);
            item.extraCDA = "Exam periapical radiograph anterior teeth";
          } else if (item.type === "Exam periapical radiograph (posterior teeth)") {
            totalReq.CDA.Exam_periapical_radiograph_posterior_teeth += parseFloat(item.req_DC);
            item.extraCDA = "Exam periapical radiograph posterior teeth";
          } else if (item.type === "Exam bitewing radiograph") {
            totalReq.CDA.Exam_bitewing_radiograph += parseFloat(item.req_DC);
            item.extraCDA = "Exam bitewing radiograph";
          }
        }
      });

    return {totalReq, rqm} ;
}