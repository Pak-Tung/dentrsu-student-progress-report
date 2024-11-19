export const calPedoReq = (rqm, minReq) => {
    let totalReq = {
        RSU: {
            Comprehensive_examination_and_treatment_plan_in_new_patient: 0,
            Comprehensive_examination_and_treatment_plan_in_recall_patient: 0,
            Photographs_and_Radiographs: 0,
            Caries_risk_assessment_and_Management: 0,
            Sealant: 0,
            Filling_or_PRR: 0,
            Primary_molar_class_II_restoration: 0,
            Stainless_steel_crown_in_posterior_teeth: 0,
            Pulpectomy_Step_OC_and_LT_or_Pulpotomy: 0,
            Pulpectomy_Step_MI_and_FRC: 0,
            Extraction: 0,
            Miscellaneous_work: 0,
            Exam_Inferior_alveolar_nerve_block_injection: 0,
            Exam_Rubber_dam_application: 0,
        },
        CDA: {
            Comprehensive_examination_and_treatment_plan: 0,
            Caries_risk_assessment_and_Management: 0,
            Sealant: 0,
            Filling_or_PRR: 0,
            Stainless_steel_crown: 0,
            Pulpectomy_or_Pulpotomy: 0,
            Extraction: 0,
        },
    };

    rqm.forEach((item) => {
        if(item.isApproved === 1){
            if(item.type === "Comprehensive examination and treatment plan in new patient"){
                totalReq.RSU.Comprehensive_examination_and_treatment_plan_in_new_patient += parseFloat(item.req_RSU);
                item.extraRSU = "Comprehensive examination and treatment plan in new patient";
            } else if(item.type === "Comprehensive examination and treatment plan in recall patient"){
                totalReq.RSU.Comprehensive_examination_and_treatment_plan_in_recall_patient += parseFloat(item.req_RSU);
                item.extraRSU = "Comprehensive examination and treatment plan in recall patient";
            } else if(item.type === "Photographs and Radiographs"){
                totalReq.RSU.Photographs_and_Radiographs += parseFloat(item.req_RSU);
                item.extraRSU = "Photographs and Radiographs";
            } else if(item.type === "Caries risk assessment and Management"){
                totalReq.RSU.Caries_risk_assessment_and_Management += parseFloat(item.req_RSU);
                item.extraRSU = "Caries risk assessment and Management";
            } else if(item.type === "Sealant"){
                totalReq.RSU.Sealant += parseFloat(item.req_RSU);
                item.extraRSU = "Sealant";
            } else if(item.type === "Filling or PRR"){
                totalReq.RSU.Filling_or_PRR += parseFloat(item.req_RSU);
                item.extraRSU = "Filling or PRR";
            } else if(item.type === "Primary molar class II restoration"){
                totalReq.RSU.Primary_molar_class_II_restoration += parseFloat(item.req_RSU);
                item.extraRSU = "Primary molar class II restoration";
            } else if(item.type === "Stainless steel crown in posterior teeth"){
                totalReq.RSU.Stainless_steel_crown_in_posterior_teeth += parseFloat(item.req_RSU);
                item.extraRSU = "SSC";
            } else if(item.type === "Pulpectomy Step OC and LT or Pulpotomy"){
                totalReq.RSU.Pulpectomy_Step_OC_and_LT_or_Pulpotomy += parseFloat(item.req_RSU);
                item.extraRSU = "Pulpectomy OC, LT (Pulpotomy)";
            } else if(item.type === "Pulpectomy Step MI and FRC"){
                totalReq.RSU.Pulpectomy_Step_MI_and_FRC += parseFloat(item.req_RSU);
                item.extraRSU = "Pulpectomy MI and FRC";
            } else if(item.type === "Extraction"){
                totalReq.RSU.Extraction += parseFloat(item.req_RSU);
                item.extraRSU = "Extraction";
            } else if(item.type === "Miscellaneous work"){
                totalReq.RSU.Miscellaneous_work += parseFloat(item.req_RSU);
                item.extraRSU = "Miscellaneous";
            } else if(item.type === "Exam Inferior alveolar nerve block injection"){
                totalReq.RSU.Exam_Inferior_alveolar_nerve_block_injection += parseFloat(item.req_RSU);
                item.extraRSU = "Exam Inferior alveolar nerve block injection";
            } else if(item.type === "Exam Rubber dam application"){
                totalReq.RSU.Exam_Rubber_dam_application += parseFloat(item.req_RSU);
                item.extraRSU = "Exam Rubber dam application";
            }
        }
    });

    rqm.forEach((item) => {
        if(item.isApproved === 1){
            if(item.type === "Comprehensive examination and treatment plan in new patient"){
                totalReq.CDA.Comprehensive_examination_and_treatment_plan += parseFloat(item.req_DC);
                item.extraCDA = "new patient";
            }else if(item.type === "Comprehensive examination and treatment plan in recall patient"){
                totalReq.CDA.Comprehensive_examination_and_treatment_plan += parseFloat(item.req_DC);
                item.extraCDA = "recall patient";
            } else if(item.type === "Caries risk assessment and Management"){
                totalReq.CDA.Caries_risk_assessment_and_Management += parseFloat(item.req_DC);
                item.extraCDA = "Caries risk assessment and Management";
            } else if(item.type === "Sealant"){
                totalReq.CDA.Sealant += parseFloat(item.req_DC);
                item.extraCDA = "Sealant";
            } else if(item.type === "Filling"){
                totalReq.CDA.Filling_or_PRR += parseFloat(item.req_DC);
                item.extraCDA = "Filling or PRR";
            } else if(item.type === "Primary molar class II restoration"){
                totalReq.CDA.Filling_or_PRR += parseFloat(item.req_DC);
                item.extraRSU = "Primary molar class II restoration";
            }else if(item.type === "Stainless steel crown in posterior teeth"){
                totalReq.CDA.Stainless_steel_crown += parseFloat(item.req_DC);
                item.extraCDA = "SSC";
            } else if(item.type === "Pulpectomy Step OC and LT or Pulpotomy"){
                totalReq.CDA.Pulpectomy_or_Pulpotomy += parseFloat(item.req_DC);
                item.extraCDA = "Pulpectomy";
            } else if(item.type === "Extraction"){
                totalReq.CDA.Extraction += parseFloat(item.req_DC);
                item.extraCDA = "Extraction";
            }
        }
    });

    return { totalReq, rqm };
};