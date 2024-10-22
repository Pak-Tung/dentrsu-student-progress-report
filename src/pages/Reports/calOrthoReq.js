export const calOrthoReq = (rqm, minReq) => {
  let totalReq = {
    RSU: {
      Charting: 0,
      Photograph_taking: 0,
      Impression_taking_Upper: 0,
      Impression_taking_Lower: 0,
      Removable_appliance: 0,
      Inserting_removable_appliance: 0,
      Assisting_adjust_fixed_appliance: 0,
      Plaster_Pouring: 0,
      Model_Trimming: 0,
      Case_analysis: 0,
    },
    CDA: {
      Inserting_removable_appliance: 0,
      Case_analysis: 0,
    },
  };

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "Charting") {
        totalReq.RSU.Charting += parseFloat(item.req_RSU);
        item.extraRSU = "Charting";
      } else if (item.type === "Photograph taking") {
        totalReq.RSU.Photograph_taking += parseFloat(item.req_RSU);
        item.extraRSU = "Photograph taking";
      } else if (item.type === "Impression taking Upper") {
        totalReq.RSU.Impression_taking_Upper += parseFloat(item.req_RSU);
        item.extraRSU = "Upper Impression";
      } else if (item.type === "Impression taking Lower") {
        totalReq.RSU.Impression_taking_Lower += parseFloat(item.req_RSU);
        item.extraRSU = "Lower Impression";
      } else if (item.type === "Removable appliance") {
        totalReq.RSU.Removable_appliance += parseFloat(item.req_RSU);
        item.extraRSU = "Removable appliance";
      } else if (item.type === "Inserting removable appliance") {
        totalReq.RSU.Inserting_removable_appliance += parseFloat(item.req_RSU);
        item.extraRSU = "Inserting removable appliance";
      } else if (item.type === "Assisting adjust fixed appliance") {
        totalReq.RSU.Assisting_adjust_fixed_appliance += parseFloat(
          item.req_RSU
        );
        item.extraRSU = "Assisting adjust fixed appliance";
      } else if (item.type === "Plaster Pouring") {
        totalReq.RSU.Plaster_Pouring += parseFloat(item.req_RSU);
        item.extraRSU = "Plaster Pouring";
      } else if (item.type === "Model Trimming") {
        totalReq.RSU.Model_Trimming += parseFloat(item.req_RSU);
        item.extraRSU = "Model Trimming";
      } else if (item.type === "Case analysis") {
        totalReq.RSU.Case_analysis += parseFloat(item.req_RSU);
        item.extraRSU = "Case analysis";
      }
    }
  });

  rqm.forEach((item) => {
    if (item.isApproved === 1) {
      if (item.type === "Inserting removable appliance") {
        totalReq.CDA.Inserting_removable_appliance += parseFloat(item.req_DC);
        item.extraCDA = "Inserting removable appliance";
      } else if (item.type === "Case analysis") {
        totalReq.CDA.Case_analysis += parseFloat(item.req_DC);
        item.extraCDA = "Case analysis";
      }
    }
  });

  return { totalReq, rqm };
};
