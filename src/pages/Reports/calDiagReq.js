import { allTotalDivReq } from "./allTotalDivReq";

export const calDiagReq = (rqm, minReq) => {
  //console.log("rqm1", rqm);
  let totalReq = allTotalDivReq().diag;

  //calculate RSU
  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "Complete case examination") {
        totalReq.RSU.Complete_case_examination += parseFloat(item.req_RSU);
        item.extraRSU = "Complete case examination";
      } else if (item.type === "Assistant") {
        totalReq.RSU.Assistant += parseFloat(item.req_RSU);
        item.extraRSU = "Assistant";
      } else if (item.type === "CPC or Journal club") {
        totalReq.RSU.CPC_or_Journal_club += parseFloat(item.req_RSU);
        item.extraRSU = "CPC/Journal club";
      } else if (item.type === "Complete splint") {
        totalReq.RSU.Complete_splint += parseFloat(item.req_RSU);
        item.extraRSU = "Complete splint";
      } else if ((item.type === "Recall cases splint")) {
        totalReq.RSU.Recall_cases_splint += parseFloat(item.req_RSU);
        item.extraRSU = "Recall cases splint";
      }
    }
  });

  //Calculate CDA
  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      //console.log("item", item);
      if (item.type === "Chief complaint examination") {
        //console.log("Chief complaint examination", item.req_DC);
        totalReq.CDA.Chief_complaint_examination += parseFloat(item.req_DC);
        item.extraCDA = "Chief complaint examination";
      } else if (item.type === "Complete case examination") {
        totalReq.CDA.Complete_case_examination += parseFloat(item.req_DC);
        item.extraCDA = "Complete case examination";
      } else if (
        item.type ===
        "Biopsy Blood chemistry or soft tissue lesion interpretation"
      ) {
        totalReq.CDA.Biopsy_Blood_chemistry_or_soft_tissue_lesion_interpretation +=
          parseFloat(item.req_DC);
        item.extraCDA =
          "Biopsy, Blood chemistry or soft tissue lesion interpretation";
      } else if (item.type === "TMDs case examination") {
        totalReq.CDA.TMDs_case_examination += parseFloat(item.req_DC);
        item.extraCDA = "TMDs case examination";
      }
    }
  });
  
  return { totalReq, rqm };
};
