import {
  getDivReqByStudentEmail,
  getAllReqByDivision,
} from "./apiCalls";

export const getTotalReqByDivisionAndType = async (email) => {
  //   const student = await getStudentByEmail(email);
  //   console.log(student);

  const division = [
    "oper",
    "perio",
    "endo",
    "prosth",
    "diag",
    "radio",
    "sur",
    "ortho",
    "pedo",
  ];
  const reqPromises = division.map((div) =>
    getDivReqByStudentEmail(email, div)
  );
  const reqResults = await Promise.all(reqPromises);

  const sumRequirements = (reqs) => {
    const result = {};
    reqs.forEach((req) => {
      if (!result[req.type]) {
        result[req.type] = { req_RSU: 0, req_DC: 0 };
      }
      result[req.type].req_RSU += parseFloat(req.req_RSU) || 0;
      result[req.type].req_DC += parseFloat(req.req_DC) || 0;
    });
    return result;
  };

  const reqOper = sumRequirements(reqResults[0]);
  const reqPerio = sumRequirements(reqResults[1]);
  const reqEndo = sumRequirements(reqResults[2]);
  const reqProsth = sumRequirements(reqResults[3]);
  const reqDiag = sumRequirements(reqResults[4]);
  const reqRadio = sumRequirements(reqResults[5]);
  const reqSur = sumRequirements(reqResults[6]);
  const reqOrtho = sumRequirements(reqResults[7]);
  const reqPedo = sumRequirements(reqResults[8]);

  return [
    reqOper,
    reqPerio,
    reqEndo,
    reqProsth,
    reqDiag,
    reqRadio,
    reqSur,
    reqOrtho,
    reqPedo,
  ];
};

export const getTotalReqByDivisionAndEmail = async (email) => {
  const req = await getTotalReqByDivisionAndType(email);
  // Example of req structure:
  // req = [
  //   { 'Class I': { req_RSU: 0, req_DC: 0 }, 'Class II': { req_RSU: 0, req_DC: 0 }, ... }, //reqOper
  //   { 'complete case': { req_RSU: 0, req_DC: 0 }, 'complexity': { req_RSU: 0, req_DC: 0 }, ... }, //reqPerio
  //   ...
  // ]

  const sumRequirements = (reqs) => {
    let totalReq_RSU = 0;
    let totalReq_DC = 0;
    if (reqs && typeof reqs === "object") {
      for (const values of Object.values(reqs)) {
        totalReq_RSU += parseFloat(values.req_RSU) || 0;
        totalReq_DC += parseFloat(values.req_DC) || 0;
      }
    } else {
      console.error("Expected an object but got:", reqs);
    }
    return { totalReq_RSU, totalReq_DC };
  };

  const totalReqOper = sumRequirements(req[0] || {});
  const totalReqPerio = sumRequirements(req[1] || {});
  const totalReqEndo = sumRequirements(req[2] || {});
  const totalReqProsth = sumRequirements(req[3] || {});
  const totalReqDiag = sumRequirements(req[4] || {});
  const totalReqRadio = sumRequirements(req[5] || {});
  const totalReqSur = sumRequirements(req[6] || {});
  const totalReqOrtho = sumRequirements(req[7] || {});
  const totalReqPedo = sumRequirements(req[8] || {});

  const totalDivReq_RSU = {
    Oper: totalReqOper.totalReq_RSU,
    Perio: totalReqPerio.totalReq_RSU,
    Endo: totalReqEndo.totalReq_RSU,
    Prosth: totalReqProsth.totalReq_RSU,
    Diag: totalReqDiag.totalReq_RSU,
    Radio: totalReqRadio.totalReq_RSU,
    Sur: totalReqSur.totalReq_RSU,
    Ortho: totalReqOrtho.totalReq_RSU,
    Pedo: totalReqPedo.totalReq_RSU,
  };

  const totalDivReq_DC = {
    Oper: totalReqOper.totalReq_DC,
    Perio: totalReqPerio.totalReq_DC,
    Endo: totalReqEndo.totalReq_DC,
    Prosth: totalReqProsth.totalReq_DC,
    Diag: totalReqDiag.totalReq_DC,
    Radio: totalReqRadio.totalReq_DC,
    Sur: totalReqSur.totalReq_DC,
    Ortho: totalReqOrtho.totalReq_DC,
    Pedo: totalReqPedo.totalReq_DC,
  };

  //console.log('Total Division Req RSU:', totalDivReq_RSU);
  //console.log('Total Division Req DC:', totalDivReq_DC);

  return {
    totalDivReq_RSU,
    totalDivReq_DC,
  };
};

export const getTotalMinReqByDivision = async () => {
  const division = [
    "oper",
    "perio",
    "endo",
    "prosth",
    "diag",
    "radio",
    "sur",
    "ortho",
    "pedo",
  ];

  const reqPromises = division.map((div) => getAllReqByDivision(div));

  const reqResults = await Promise.all(reqPromises);

  const sumRequirements = (reqs) => {
    const result = {};
    reqs.forEach((req) => {
      if (!result[req.type]) {
        result[req.type] = { req_RSU: 0, req_DC: 0 };
      }
      result[req.type].req_RSU += parseFloat(req.req_RSU) || 0;
      result[req.type].req_DC += parseFloat(req.req_DC) || 0;
    });
    return result;
  };

  const reqOper = sumRequirements(reqResults[0]);
  const reqPerio = sumRequirements(reqResults[1]);
  const reqEndo = sumRequirements(reqResults[2]);
  const reqProsth = sumRequirements(reqResults[3]);
  const reqDiag = sumRequirements(reqResults[4]);
  const reqRadio = sumRequirements(reqResults[5]);
  const reqSur = sumRequirements(reqResults[6]);
  const reqOrtho = sumRequirements(reqResults[7]);
  const reqPedo = sumRequirements(reqResults[8]);

  const req = [
    reqOper,
    reqPerio,
    reqEndo,
    reqProsth,
    reqDiag,
    reqRadio,
    reqSur,
    reqOrtho,
    reqPedo,
  ];

  const sumMinRequirements = (reqs) => {
    let totalReq_RSU = 0;
    let totalReq_DC = 0;
    if (reqs && typeof reqs === "object") {
      for (const values of Object.values(reqs)) {
        totalReq_RSU += parseFloat(values.req_RSU) || 0;
        totalReq_DC += parseFloat(values.req_DC) || 0;
      }
    } else {
      console.error("Expected an object but got:", reqs);
    }
    return { totalReq_RSU, totalReq_DC };
  };

  const totalReqOper = sumMinRequirements(req[0] || {});
  const totalReqPerio = sumMinRequirements(req[1] || {});
  const totalReqEndo = sumMinRequirements(req[2] || {});
  const totalReqProsth = sumMinRequirements(req[3] || {});
  const totalReqDiag = sumMinRequirements(req[4] || {});
  const totalReqRadio = sumMinRequirements(req[5] || {});
  const totalReqSur = sumMinRequirements(req[6] || {});
  const totalReqOrtho = sumMinRequirements(req[7] || {});
  const totalReqPedo = sumMinRequirements(req[8] || {});

  const totalDivReq_RSU = {
    Oper: totalReqOper.totalReq_RSU,
    Perio: totalReqPerio.totalReq_RSU,
    Endo: totalReqEndo.totalReq_RSU,
    Prosth: totalReqProsth.totalReq_RSU,
    Diag: totalReqDiag.totalReq_RSU,
    Radio: totalReqRadio.totalReq_RSU,
    Sur: totalReqSur.totalReq_RSU,
    Ortho: totalReqOrtho.totalReq_RSU,
    Pedo: totalReqPedo.totalReq_RSU,
  };

  const totalDivReq_DC = {
    Oper: totalReqOper.totalReq_DC,
    Perio: totalReqPerio.totalReq_DC,
    Endo: totalReqEndo.totalReq_DC,
    Prosth: totalReqProsth.totalReq_DC,
    Diag: totalReqDiag.totalReq_DC,
    Radio: totalReqRadio.totalReq_DC,
    Sur: totalReqSur.totalReq_DC,
    Ortho: totalReqOrtho.totalReq_DC,
    Pedo: totalReqPedo.totalReq_DC,
  };


  return {
    totalDivReq_RSU,
    totalDivReq_DC,
  };
};


export const getCompleteReqsPercentageByDivision = async (email) => {
  const totalReqs = await getTotalReqByDivisionAndEmail(email);
  // Example of totalReqs:
  // totalReqs = {
  //     totalDivReq_DC: { Oper: 50, Perio: 0, Endo: 2, Prosth: 0, Diag: 0, … },
  //     totalDivReq_RSU: { Oper: 49, Perio: 2, Endo: 5, Prosth: 0, Diag: 1, … }
  // };

  const totalMinReqs = await getTotalMinReqByDivision();
  // Example of totalMinReqs:
  // totalMinReqs = {
  //     totalDivReq_DC: { Oper: 33, Perio: 1, Endo: 2, Prosth: 10, Diag: 37, … },
  //     totalDivReq_RSU: { Oper: 35, Perio: 84, Endo: 6, Prosth: 10, Diag: 37, … }
  // };

  const calculatePercentage = (total, min) => {
      const percentages = {};
      for (const division in total) {
          percentages[division] = {};
          for (const req in total[division]) {
              if (min[division][req] !== 0) {
                  percentages[division][req] = ((total[division][req] / min[division][req]) * 100).toFixed(2);
              } else {
                  percentages[division][req] = "0.00";
              }
          }
      }
      return percentages;
  };

  const completeReqsPercentageByDivision = calculatePercentage(totalReqs, totalMinReqs);

  // console.log('Complete Reqs Percentage:', completeReqsPercentageByDivision);

  return completeReqsPercentageByDivision;
};

// export const calTotalDivReqByWeight = (totalReq, weight) => {
//   const totalDivReq = {};
//   for (const division in totalReq) {
//     totalDivReq[division] = {};
//     for (const req in totalReq[division]) {
//       totalDivReq[division][req] = totalReq[division][req] * weight[req];
//     }
//   }
//   return totalDivReq;
// };

