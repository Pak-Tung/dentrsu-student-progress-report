export const calProsthReq = (rqm, minReq) => {
  let totalReq = {
    RSU: {
      CD_Upper: 0,
      CD_Lower: 0,
      MRPD: 0,
      ARPD: 0,
      Crown: 0,
      Post_Core_Crown: 0,
      Exam_design_RPD: 0,
      Exam_crown_preparation: 0,
    },
    CDA: {
      CD_Upper: 0,
      CD_Lower: 0,
      MRPD: 0,
      ARPD: 0,
      Crown: 0,
      Post_Core_Crown: 0,
    },
  };

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "CD (Upper)") {
        totalReq.RSU.CD_Upper += parseFloat(item.req_RSU);
        totalReq.CDA.CD_Upper += parseFloat(item.req_DC);
        item.extraRSU = "CD Upper";
        item.extraCDA = "CD Upper";
      } else if (item.type === "CD (Lower)") {
        totalReq.RSU.CD_Lower += parseFloat(item.req_RSU);
        totalReq.CDA.CD_Lower += parseFloat(item.req_DC);
        item.extraRSU = "CD Lower";
        item.extraCDA = "CD Lower"
      } else if (item.type === "MRPD") {
        totalReq.RSU.MRPD += parseFloat(item.req_RSU);
        totalReq.CDA.MRPD += parseFloat(item.req_DC);
        item.extraRSU = "MRPD";
        item.extraCDA = "MRPD";
      } else if (item.type === "ARPD") {
        totalReq.RSU.ARPD += parseFloat(item.req_RSU);
        totalReq.CDA.ARPD += parseFloat(item.req_DC);
        item.extraRSU = "ARPD";
        item.extraCDA = "ARPD";
      } else if (item.type === "Crown") {
        totalReq.RSU.Crown += parseFloat(item.req_RSU);
        totalReq.CDA.Crown += parseFloat(item.req_DC);
        item.extraRSU = "Crown";
        item.extraCDA = "Crown";
      } else if (item.type === "Post Core Crown") {
        totalReq.RSU.Post_Core_Crown += parseFloat(item.req_RSU);
        totalReq.CDA.Post_Core_Crown += parseFloat(item.req_DC);
        item.extraRSU = "Post Core Crown";
        item.extraCDA = "Post Core Crown";
      } else if (item.type === "Bridge 3 units") {
        //totalReq.RSU.Bridge_3_units += parseFloat(item.req_RSU);
        //totalReq.CDA.Bridge_3_units += parseFloat(item.req_DC);
        totalReq.RSU.Crown += 2;
        totalReq.CDA.Crown += 2;
        item.extraRSU = "Bridge => Crown";
        item.extraCDA = "Bridge => Crown";
      } else if (item.type === "Exam design RPD") {
        totalReq.RSU.Exam_design_RPD += parseFloat(item.req_RSU);
        item.extraRSU = "Exam design RPD";
      } else if (item.type === "Exam crown preparation") {
        totalReq.RSU.Exam_crown_preparation += parseFloat(item.req_RSU);
        item.extraRSU = "Exam crown preparation";
      }
    }
  });

  return { totalReq, rqm };
};
