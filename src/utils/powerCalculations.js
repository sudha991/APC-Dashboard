// src/utils/powerCalculations.js

export const getDraftSystemTotalPower = (
  apiData,
  draftSystems
) =>
  draftSystems
    .filter(
      item =>
        item.type !== "ratio" &&
        item.type !== "single" &&
        item.type !== "flow"
    )
    .reduce(
      (sum, item) =>
        sum +
        Number(apiData[item.unit1] || 0) +
        Number(apiData[item.unit2] || 0) +
        Number(apiData[item.unit3] || 0) +
        Number(apiData[item.unit4] || 0),
      0
    );
export const getMillingSystemTotalPower = (
  apiData,
  millSystems
) =>
  millSystems
    .filter(
      item => item.title !== "Total Power"
    )
    .reduce(
      (sum, item) =>
        sum +
        Number(apiData[item.unit1] || 0) +
        Number(apiData[item.unit2] || 0) +
        Number(apiData[item.unit3] || 0) +
        Number(apiData[item.unit4] || 0),
      0
    );
export const getCWPumpsTotalPower = (
  apiData,
  cwPumpsSystem
) =>
  cwPumpsSystem
    .filter(item => item.type !== "ratio")
    .reduce(
      (sum, item) =>
        sum +
        Number(apiData[item.stage1] || 0) +
        Number(apiData[item.stage2] || 0),
      0
    );
export const getBFPTotalPower = (apiData) =>
  Number(apiData.BFP_MDBFP_U1 || 0) +
  Number(apiData.BFP_MDBFP_U2 || 0) +
  Number(apiData.BFP_MDBFP_U3 || 0) +
  Number(apiData.BFP_MDBFP_U4 || 0);

export const getCCPumpsTotalPower = (
  apiData,
  ccPumpsSystem
) =>
  ccPumpsSystem
    .filter(item => item.type === "pump")
    .reduce(
      (sum, item) =>
        sum +
        Number(apiData[item.unit1] || 0) +
        Number(apiData[item.unit2] || 0) +
        Number(apiData[item.unit3] || 0) +
        Number(apiData[item.unit4] || 0),
      0
    );
export const getCEPTotalPower = (
  apiData,
  cepSystem
) =>
  cepSystem
    .filter(item => item.type !== "ratio")
    .reduce(
      (sum, item) =>
        sum +
        Number(apiData[item.unit1] || 0) +
        Number(apiData[item.unit2] || 0) +
        Number(apiData[item.unit3] || 0) +
        Number(apiData[item.unit4] || 0),
      0
    );
export const getCompressorTotalPower = (
  apiData,
  comprSystem
) =>
  comprSystem
    .filter(item => item.type !== "ratio")
    .reduce(
      (sum, item) =>
        sum +
        Number(apiData[item.Stage1] || 0) +
        Number(apiData[item.Stage2] || 0),
      0
    );