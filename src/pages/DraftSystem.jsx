// pages/MillingSystem.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";
import { getPowerData } from "../api/piApi";
import { useTrend } from "../context/TrendContext";
import SelectableTrendCell from "../components/SelectableTrendCell";
import {
  DSLoad,
  DSspecificCoal,
  draftSystems,
} from "../data/draftSystems";
import {
  getDraftSystemTotalPower
} from "../utils/powerCalculations";

// ========================================
// PI TAG CONFIGURATION
// ========================================
   
  

export default function DraftSystem() {


  const [apiData, setApiData] = useState({});
  const draftSystemTotalPower =
  getDraftSystemTotalPower(
    apiData,
    draftSystems
  );

  // ========================================
  // FORMAT VALUE
  // ========================================

 
const formatValue = (
    value,
    isDecimal = false
  ) => {
    if (
      value === "NA" ||
      value === null ||
      value === undefined ||
      isNaN(value)
    ) {
      return "NA";
    }

    return isDecimal
      ? Number(value).toFixed(2) // ECI
      : Number(value).toFixed(0); // all others
  };
  // ========================================
  // API CALL
  // ========================================

    useEffect(() => {

      const fetchData = () => {

        getPowerData()

          .then((res) => {


            if (res.data?.value) {
              setApiData(res.data.value);
            }

          })

          .catch(console.log);
      };

      // INITIAL LOAD
      fetchData();

      // AUTO REFRESH
      const interval = setInterval(() => {
        fetchData();
      }, 5000);

      // CLEANUP
      return () => clearInterval(interval);

    }, []);
        {/* ======================================== */}
        {/* VALUE FUNCTION */}
        {/* ======================================== */}

 const getValue = (item, unit) => {

  // ========================================
  // TOTAL TAGS
  // ========================================

  if (item[`${unit}Tags`]) {

    const total = item[`${unit}Tags`]
      .reduce((sum, tag) => {

        return sum + Number(
          apiData[tag] || 0
        );

      }, 0);

    return total.toFixed(2);
  }

  // ========================================
  // RATIO VALUE
  // ========================================

 
if (item[`${unit}Tag1`]) {

  const tag1 = Number(
    apiData[item[`${unit}Tag1`]] || 0
  );

  const tag2 = Number(
    apiData[item[`${unit}Tag2`]] || 0
  );

  return (
    tag1 * tag2
  ).toFixed(2);
}
  // ========================================
  // SINGLE VALUE
  // ========================================

  return Number(
    apiData[item[unit]] || 0
  ).toFixed(2);
};
  
 const calculateDesignValue = (value) => {

  if (!value) return 0;

  // Handles:
  // "525"
  // "95.7*6"
  // "120+30"

  try {
    return Function(
      `"use strict"; return (${value})`
    )();
  } catch {
    return Number(value) || 0;
  }
};const selectedFans = [
  "PA FAN",
  "FD FAN",
  "ID FAN",
];

const stage1DesignTotal =
  draftSystems
    .filter(item =>
      selectedFans.some(fan =>
        item.title.includes(fan)
      )
    )
    .reduce((sum, item) => {

      return (
        sum +
        calculateDesignValue(
          item.stage1Design
        )
      );

    }, 0);

const stage2DesignTotal =
  draftSystems
    .filter(item =>
      selectedFans.some(fan =>
        item.title.includes(fan)
      )
    )
    .reduce((sum, item) => {

      return (
        sum +
        calculateDesignValue(
          item.stage2Design
        )
      );

    }, 0);   
const loadItem = draftSystems.find(
  item => item.title === "LOAD"
);

const stage1Load =
  Number(loadItem?.stage1Design || 1);

const stage2Load =
  Number(loadItem?.stage2Design || 1);
const fdFanA = draftSystems.find(
  item => item.title === "FD FAN A"
);

const fdFanB = draftSystems.find(
  item => item.title === "FD FAN B"
);
const paFanA = draftSystems.find(
  item => item.title === "PA FAN A"
);

const paFanB = draftSystems.find(
  item => item.title === "PA FAN B"
);
const secondaryAirFlow = draftSystems.find(
  item => item.title === "Secondary Air Flow"
);

const secAirFlowS1 =
  calculateDesignValue(
    secondaryAirFlow?.stage1Design
  );

const secAirFlowS2 =
  calculateDesignValue(
    secondaryAirFlow?.stage2Design
  );
const calculateRatio = (tag1, tag2) => {

  console.log("Tag1 =", tag1);
  console.log("Tag2 =", tag2);

  console.log("Value1 =", apiData[tag1]);
  console.log("Value2 =", apiData[tag2]);

  if (
    apiData[tag1] === undefined ||
    apiData[tag2] === undefined
  ) {
    return "NA";
  }

  const value1 = Number(apiData[tag1]);
  const value2 = Number(apiData[tag2]);

  if (value2 === 0) {
    return "NA";
  }

  return (value1 / value2).toFixed(3);
};
  // ========================================
  // SEC OF ID FANS Calculations
  // ========================================
// ACTUAL SEC VALUES
const idFanSecU1 =
(
  (
    Number(apiData.DS_ID_FAN_A_CH_1_u1 || 0) +
    Number(apiData.DS_ID_FAN_A_CH_2_u1 || 0) +
    Number(apiData.DS_ID_FAN_B_CH_1_u1 || 0) +
    Number(apiData.DS_ID_FAN_B_CH_2_u1 || 0)
  ) /
  Number(apiData.DS_TotalAirFlow_u1 || 1)
);

const idFanSecU2 =
(
  (
    Number(apiData.DS_ID_FAN_A_CH_1_u2 || 0) +
    Number(apiData.DS_ID_FAN_A_CH_2_u2 || 0) +
    Number(apiData.DS_ID_FAN_B_CH_1_u2 || 0) +
    Number(apiData.DS_ID_FAN_B_CH_2_u2 || 0)
  ) /
  Number(apiData.DS_TotalAirFlow_u2 || 1)
);

const idFanSecU3 =
(
  (
    Number(apiData.DS_ID_FAN_A_CH_1_u3 || 0) +
    Number(apiData.DS_ID_FAN_A_CH_2_u3 || 0) +
    Number(apiData.DS_ID_FAN_B_CH_1_u3 || 0) +
    Number(apiData.DS_ID_FAN_B_CH_2_u3 || 0)
  ) /
  Number(apiData.DS_TotalAirFlow_u3 || 1)
);

const idFanSecU4 =
(
  (
    Number(apiData.DS_ID_FAN_A_CH_1_u4 || 0) +
    Number(apiData.DS_ID_FAN_A_CH_2_u4 || 0) +
    Number(apiData.DS_ID_FAN_B_CH_1_u4 || 0) +
    Number(apiData.DS_ID_FAN_B_CH_2_u4 || 0)
  ) /
  Number(apiData.DS_TotalAirFlow_u4 || 1)
);

// DESIGN VALUES
const idFanStage1Design = (1825 + 1825 + 1825 + 1825) / 1823;
const idFanStage2Design = (2000 + 2000 + 2000 + 2000) / 1855;

// STAGE VALUES
{/*
  const idFanStage1 = idFanSecU1 + idFanSecU2;
  const idFanStage2 = idFanSecU3 + idFanSecU4;
*/}

// GAP VALUES
const idFanGap1 = idFanSecU1 - idFanStage1Design;
const idFanGap2 = idFanSecU2 - idFanStage1Design;
const idFanGap3 = idFanSecU3 - idFanStage2Design;
const idFanGap4 = idFanSecU4 - idFanStage2Design;

// SEC OF FD FANS Calculations

const fdFanSecU1 =
(
  (
    Number(apiData.DS_FD_FAN_A_u1 || 0) +
    Number(apiData.DS_FD_FAN_B_u1 || 0)
  ) /
  Number(apiData.DS_SEC_AIR_FLOW_u1 || 1)
);

const fdFanSecU2 =
(
  (
    Number(apiData.DS_FD_FAN_A_u2 || 0) +
    Number(apiData.DS_FD_FAN_B_u2 || 0)
  ) /
  Number(apiData.DS_SEC_AIR_FLOW_u2 || 1)
);

const fdFanSecU3 =
(
  (
    Number(apiData.DS_FD_FAN_A_u3 || 0) +
    Number(apiData.DS_FD_FAN_B_u3 || 0)
  ) /
  Number(apiData.DS_SEC_AIR_FLOW_u3 || 1)
);

const fdFanSecU4 =
(
  (
    Number(apiData.DS_FD_FAN_A_u4 || 0) +
    Number(apiData.DS_FD_FAN_B_u4 || 0)
  ) /
  Number(apiData.DS_SEC_AIR_FLOW_u4 || 1)
);

const fdFanStage1Design =
(
  (
    Number(fdFanA?.stage1Design || 0) +
    Number(fdFanB?.stage1Design || 0)
  ) /
  secAirFlowS1
);

const fdFanStage2Design =
(
  (
    Number(fdFanA?.stage2Design || 0) +
    Number(fdFanB?.stage2Design || 0)
  ) /
  secAirFlowS2
);

{/*
  const fdFanStage1 = fdFanSecU1 + fdFanSecU2;
  const fdFanStage2 = fdFanSecU3 + fdFanSecU4;
*/}

const fdFanGap1 = fdFanSecU1 - fdFanStage1Design;
const fdFanGap2 = fdFanSecU2 - fdFanStage1Design;
const fdFanGap3 = fdFanSecU3 - fdFanStage2Design;
const fdFanGap4 = fdFanSecU4 - fdFanStage2Design;


//SEC OF PA FANS Calculations

const paFanSecU1 =
(
  (
    Number(apiData.DS_PA_FAN_A_u1 || 0) +
    Number(apiData.DS_PA_FAN_B_u1 || 0)
  ) /
  Number(apiData.DS_PRI_AIR_FLOW_u1 || 1)
);

const paFanSecU2 =
(
  (
    Number(apiData.DS_PA_FAN_A_u2 || 0) +
    Number(apiData.DS_PA_FAN_B_u2 || 0)
  ) /
  Number(apiData.DS_PRI_AIR_FLOW_u2 || 1)
);

const paFanSecU3 =
(
  (
    Number(apiData.DS_PA_FAN_A_u3 || 0) +
    Number(apiData.DS_PA_FAN_B_u3 || 0)
  ) /
  Number(apiData.DS_PRI_AIR_FLOW_u3 || 1)
);

const paFanSecU4 =
(
  (
    Number(apiData.DS_PA_FAN_A_u4 || 0) +
    Number(apiData.DS_PA_FAN_B_u4 || 0)
  ) /
  Number(apiData.DS_PRI_AIR_FLOW_u4 || 1)
);
const primaryAirFlow = draftSystems.find(
  item => item.title === "Primary Air Flow"
);

const paFanStage1Design =
(
  Number(paFanA.stage1Design || 0) +
  Number(paFanB.stage1Design || 0)
) /
Number(primaryAirFlow?.stage1Design || 1);

const paFanStage2Design =
(
  Number(paFanA.stage2Design || 0) +
  Number(paFanB.stage2Design || 0)
) /
Number(primaryAirFlow?.stage2Design || 1);

{/*
  const paFanStage1 = paFanSecU1 + paFanSecU2;
  const paFanStage2 = paFanSecU3 + paFanSecU4;
*/}


const paFanGap1 = paFanSecU1 - paFanStage1Design;
const paFanGap2 = paFanSecU2 - paFanStage1Design;
const paFanGap3 = paFanSecU3 - paFanStage2Design;
const paFanGap4 = paFanSecU4 - paFanStage2Design;

// UNIT VALUES
const eciU1 =
  draftSystems
    .filter(item => item.type === "fan")
    .reduce((sum, item) => sum + Number(apiData[item.unit1] || 0), 0) /
  Number(apiData.DS_LOAD_u1 || 1);

const eciU2 =
  draftSystems
    .filter(item => item.type === "fan")
    .reduce((sum, item) => sum + Number(apiData[item.unit2] || 0), 0) /
  Number(apiData.DS_LOAD_u2 || 1);

const eciU3 =
  draftSystems
    .filter(item => item.type === "fan")
    .reduce((sum, item) => sum + Number(apiData[item.unit3] || 0), 0) /
  Number(apiData.DS_LOAD_u3 || 1);

const eciU4 =
  draftSystems
    .filter(item => item.type === "fan")
    .reduce((sum, item) => sum + Number(apiData[item.unit4] || 0), 0) /
  Number(apiData.DS_LOAD_u4 || 1);

// DESIGN VALUES
const eciStage1Design = stage1DesignTotal / 500;
const eciStage2Design = stage2DesignTotal / 500;

// STAGE ACTUALS
{/*
  const eciStage1 = eciU1 + eciU2;
  const eciStage2 = eciU3 + eciU4;
*/}

// GAPS
const eciGap1 = eciU1 - eciStage1Design;
const eciGap2 = eciU2 - eciStage1Design;
const eciGap3 = eciU3 - eciStage2Design;
const eciGap4 = eciU4 - eciStage2Design;

const draftUnit1Total = draftSystems
  .filter(
    item =>
      item.type !== "ratio" &&
      item.type !== "single" &&
      item.type !== "flow"
  )
  .reduce(
    (sum, item) =>
      sum + Number(apiData[item.unit1] || 0),
    0
  );

const draftUnit2Total = draftSystems
  .filter(
    item =>
      item.type !== "ratio" &&
      item.type !== "single" &&
      item.type !== "flow"
  )
  .reduce(
    (sum, item) =>
      sum + Number(apiData[item.unit2] || 0),
    0
  );

const draftUnit3Total = draftSystems
  .filter(
    item =>
      item.type !== "ratio" &&
      item.type !== "single" &&
      item.type !== "flow"
  )
  .reduce(
    (sum, item) =>
      sum + Number(apiData[item.unit3] || 0),
    0
  );

const draftUnit4Total = draftSystems
  .filter(
    item =>
      item.type !== "ratio" &&
      item.type !== "single" &&
      item.type !== "flow"
  )
  .reduce(
    (sum, item) =>
      sum + Number(apiData[item.unit4] || 0),
    0
  );

// For Pie Chart Page


return (

  <div className="milling-page">

    {/* ======================================== */}
    {/* MAIN TABLE */}
    {/* ======================================== */}

    <div className="industrial-table-container">

      {/* TITLE */}
      <div className="industrial-title">
        Draft Power
      </div>

      {/* HEADER */}
      <div className="industrial-header">

        <div>System</div>
        <div>Units</div>

        <div>STAGE-I (Design)</div>
        <div>UNIT-1</div>
        <div>UNIT-2</div>
        
        <div>STAGE-II (Design)</div>
        <div>UNIT-3</div>
        <div>UNIT-4</div>

      </div>

      {/* BODY */}
      {/* load */}
      <div className="industrial-body">

        {DSLoad.map((item, index) => {

          // ========================================
          // VALUE FUNCTION
          // ========================================

          const getValue = (unitKey) => {

            // SINGLE VALUE
            if (item.type !== "ratio") {

              return Number(
                apiData[item[unitKey]] || 0
              ).toFixed(2);
            }

            // RATIO VALUE
            const tag1 = Number(
              apiData[item[`${unitKey}Tag1`]] || 0
            );

            const tag2 = Number(
              apiData[item[`${unitKey}Tag2`]] || 0
            );

            return (Number(tag1.toFixed(1))/(tag2.toFixed(1))).toFixed(2);
          };

          return (

            <div
              className="industrial-row"
              key={index}
            >

              {/* SYSTEM */}
              <div className="system-cell">
                {item.title}
              </div>

              {/* UNITS */}
              <div className="trend-cell">
                {item.type === "ratio"
                  ? "kg/kWh"
                  : item.type === "single"
                  ? "MW"
                  : item.type === "flow"
                  ? "TPH"
                  : "kW"
                }
              </div>

              {/* STAGE 1 DESIGN */}
              <div className="design-cell">
                {item.stage1Design}
              </div>

              {/* UNIT 1 */}
              <SelectableTrendCell
              className="trend-cell"
                              value={formatValue(apiData[item.unit1])}
                              tag={item.unit1}
                              label={`${item.title} Unit-1`}
                            />
              
              {/* UNIT-2 */}
                            <SelectableTrendCell
                            value={formatValue(apiData[item.unit2])}
                            tag={item.unit2}
                            label={`${item.title} Unit-2`}
                          />
              
              {/* STAGE 2 DESIGN */}
              <div className="design-cell">
                {item.stage2Design}
              </div>

              {/* UNIT 3 */}
               <SelectableTrendCell
               className="trend-cell"
                              value={formatValue(apiData[item.unit3])}
                              tag={item.unit3}
                              label={`${item.title} Unit-3`}
                            />
              
              {/* UNIT-4 */}
                            <SelectableTrendCell
                            className="trend-cell"
                            value={formatValue(apiData[item.unit4])}
                            tag={item.unit4}
                            label={`${item.title} Unit-4`}
                          />

            </div>
          );
        })}
    <div className="industrial-body">

  {DSspecificCoal.map((item, index) => {

    const formatValue = (value, tag = "") => {
  console.log("ITEM =", item);
      if (
        value === undefined ||
        value === null
      ) {
        console.log("Missing Tag:", tag);
        return "NA";
      }

      return Number(value).toFixed(2);
    };

    return (

      <div
        className="industrial-row"
        key={index}
      >

        {/* SYSTEM */}
        <div className="system-cell">
          {item.title}
        </div>

        {/* UNITS */}
        <div className="trend-cell">
          {item.type === "ratio"
            ? "kg/kWh"
            : item.type === "single"
            ? "MW"
            : item.type === "flow"
            ? "TPH"
            : "kW"}
        </div>

        {/* STAGE-1 DESIGN */}
        <div className="design-cell">
          {item.stage1Design}
        </div>

        {/* UNIT-1 */}
        <div className="trend-cell">
          {item.type === "ratio"
            ? Number(
                calculateRatio(
                  item.unit1Tag1,
                  item.unit1Tag2
                ) || 0
              ).toFixed(2)
            : formatValue(
                apiData[item.unit1],
                item.unit1
              )}
        </div>

        {/* UNIT-2 */}
        <div className="trend-cell">
        {item.type === "ratio"
          ? Number(
              calculateRatio(
                item.unit2Tag1,
                item.unit2Tag2
              ) || 0
            ).toFixed(2)
          : formatValue(
              apiData[item.unit2],
              item.unit2
            )}
      </div>

      {/* STAGE-2 DESIGN */}
        <div className="design-cell">
          {item.stage2Design}
        </div>

        {/* UNIT-3 */}
        <div className="trend-cell">
        {item.type === "ratio"
          ? Number(
              calculateRatio(
                item.unit3Tag1,
                item.unit3Tag2
              ) || 0
            ).toFixed(2)
          : formatValue(
              apiData[item.unit3],
              item.unit3
            )}
      </div>

        {/* UNIT-4 */}
        <div className="trend-cell">
        {item.type === "ratio"
          ? Number(
              calculateRatio(
                item.unit4Tag1,
                item.unit4Tag2
              ) || 0
            ).toFixed(2)
          : formatValue(
              apiData[item.unit4],
              item.unit4
            )}
      </div>


      </div>
    );
  })}

</div>
        
        
        {/* ======================================== */}
        {/* TOTAL ROW */}
        {/* ======================================== */}

        
        
        

      </div>
      <div className="industrial-body">

        {draftSystems.map((item, index) => {

          // ========================================
          // VALUE FUNCTION
          // ========================================

          const getValue = (unitKey) => {

            // SINGLE VALUE
            if (item.type !== "ratio") {

              return Number(
                apiData[item[unitKey]] || 0
              ).toFixed(2);
            }

            // RATIO VALUE
            const tag1 = Number(
              apiData[item[`${unitKey}Tag1`]] || 0
            );

            const tag2 = Number(
              apiData[item[`${unitKey}Tag2`]] || 0
            );

            return (Number(tag1.toFixed(1))/(tag2.toFixed(1))).toFixed(2);
          };

          return (

            <div
              className="industrial-row"
              key={index}
            >

              {/* SYSTEM */}
              <div className="system-cell">
                {item.title}
              </div>

              {/* UNITS */}
              <div className="trend-cell">
                {item.type === "ratio"
                  ? "kg/kWh"
                  : item.type === "single"
                  ? "MW"
                  : item.type === "flow"
                  ? "TPH"
                  : "kW"
                }
              </div>

              {/* STAGE 1 DESIGN */}
              <div className="design-cell">
                {calculateDesignValue(item.stage1Design).toFixed(0)}
              </div>

              {/* UNIT 1 */}
              <SelectableTrendCell
              className="trend-cell"
                              value={formatValue(apiData[item.unit1])}
                              tag={item.unit1}
                              label={`${item.system} Unit-1`}
                            />
              
                            {/* UNIT-2 */}
                            <SelectableTrendCell
                            className="trend-cell"
                            value={formatValue(apiData[item.unit2])}
                            tag={item.unit2}
                            label={`${item.system} Unit-2`}
                          />

              {/* STAGE 2 DESIGN */}
              <div className="design-cell">
                {calculateDesignValue(item.stage2Design).toFixed(0)}
              </div>

              {/* UNIT 3 */}
               <SelectableTrendCell
               className="trend-cell"
                              value={formatValue(apiData[item.unit3])}
                              tag={item.unit3}
                              label={`${item.system} Unit-3`}
                            />
              
                            {/* UNIT-4 */}
                            <SelectableTrendCell
                            className="trend-cell"
                            value={formatValue(apiData[item.unit4])}
                            tag={item.unit4}
                            label={`${item.system} Unit-4`}
                          />

            </div>
          );
        })}

        {/* ======================================== */}
        {/* TOTAL ROW */}
        {/* ======================================== */}

        <div className="industrial-row total-row">

          <div className="total-cell">
            Total Power
          </div>

          <div className="total-cell">kW</div>

          {/* STAGE-1 DESIGN TOTAL */}
          <div className="total-cell">
           -
          </div>

          {/* UNIT-1 TOTAL */}
          <div className="total-cell">{draftUnit1Total.toFixed(0)}</div>

          {/* UNIT-2 TOTAL */}
          <div className="total-cell">{draftUnit2Total.toFixed(0)}</div>

          {/* STAGE-2 DESIGN TOTAL */}
          <div className="total-cell">
           -
          </div>

          {/* UNIT-3 TOTAL */}
          <div className="total-cell">{draftUnit3Total.toFixed(0)}</div>

          {/* UNIT-4 TOTAL */}
          <div className="total-cell">{draftUnit4Total.toFixed(0)}</div>

        </div>
        
        

      </div>

    </div>

    {/* ======================================== */}
    {/* SECOND TABLE */}
    {/* ======================================== */}
    <div className="industrial-table-container">

{/* TITLE */}
<div className="industrial-title">
  Specific energy consumption (SEC) & Energy Consumption Index (ECI)
</div>

{/* HEADER */}
<div className="sec_industrial-header">

  <div>System</div>
  <div>Units</div>

  <div>STAGE-I (Design)</div>
  <div>UNIT-1</div>
  <div>UNIT-1 Gap</div>
  <div>UNIT-2</div>
  <div>UNIT-2 Gap</div>

  <div>STAGE-II (Design)</div>
  <div>UNIT-3</div>
  <div>UNIT-3 Gap</div>
  <div>UNIT-4</div>
  <div>UNIT-4 Gap</div>

</div>

{/* BODY */}
<div className="industrial-body">

    {/* SEC OF ID FANS ROW */}
  <div className="sec_industrial-row ">

  <div className="system-cell">
    SEC of ID FANS
  </div>

  <div className="trend-cell">kWh/T</div>

  {/* STAGE-1 DESIGN */}
  <div className="design-cell">
    {idFanStage1Design.toFixed(2)}
  </div>

  {/* UNIT-1 */}
  <div className="trend-cell">{idFanSecU1.toFixed(2)}</div>

  {/* Unit-1 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: idFanGap1 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {idFanGap1.toFixed(2)}
  </div>

  {/* UNIT-2 */}
  <div className="trend-cell">{idFanSecU2.toFixed(2)}</div>

  {/* Unit-2 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: idFanGap2 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {idFanGap2.toFixed(2)}
  </div>

  {/* STAGE-2 DESIGN */}
  <div className="design-cell">
    {idFanStage2Design.toFixed(2)}
  </div>

  {/* UNIT-3 */}
  <div className="trend-cell">{idFanSecU3.toFixed(2)}</div>

  {/* Unit-3 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: idFanGap3 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {idFanGap3.toFixed(2)}
  </div>

  {/* UNIT-4 */}
  <div className="trend-cell">{idFanSecU4.toFixed(2)}</div>

  {/* Unit-4 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: idFanGap4 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {idFanGap4.toFixed(2)}
  </div>


</div>
  {/* SEC OF FD FANS ROW */}
  <div className="sec_industrial-row ">

  <div className="system-cell">
    SEC of FD FANS
  </div>

  <div className="trend-cell">kWh/T</div>

  {/* STAGE-1 DESIGN */}
  <div className="design-cell">
    {fdFanStage1Design.toFixed(2)}
  </div>

  {/* UNIT-1 */}
  <div className="trend-cell">{fdFanSecU1.toFixed(2)}</div>

  {/* UNIT-1 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: fdFanGap1 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {fdFanGap1.toFixed(2)}
  </div>

  {/* UNIT-2 */}
  <div className="trend-cell">{fdFanSecU2.toFixed(2)}</div>

  {/* UNIT-2 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: fdFanGap2 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {fdFanGap2.toFixed(2)}
  </div>

  {/* STAGE-2 DESIGN */}
  <div className="design-cell">
    {fdFanStage2Design.toFixed(2)}
  </div>

  {/* UNIT-3 */}
  <div className="trend-cell">{fdFanSecU3.toFixed(2)}</div>

  {/* UNIT-3 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: fdFanGap3 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {fdFanGap3.toFixed(2)}
  </div>

  {/* UNIT-4 */}
  <div className="trend-cell">{fdFanSecU4.toFixed(2)}</div>

  {/* UNIT-4 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: fdFanGap4 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {fdFanGap4.toFixed(2)}
  </div>

  

</div>
  {/* SEC OF PA FANS ROW */}
  <div className="sec_industrial-row ">

  <div className="system-cell">
    SEC of PA FANS
  </div>

  <div className="trend-cell">kWh/T</div>

  {/* STAGE-1 DESIGN */}
  <div className="design-cell">
    {paFanStage1Design.toFixed(2)}
  </div>

  {/* UNIT-1 */}
  <div className="trend-cell">{paFanSecU1.toFixed(2)}</div>

  {/* UNIT-1 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: paFanGap1 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {paFanGap1.toFixed(2)}
  </div>

  {/* UNIT-2 */}
  <div className="trend-cell">{paFanSecU2.toFixed(2)}</div>

  {/* UNIT-2 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: paFanGap2 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {paFanGap2.toFixed(2)}
  </div>

  

  {/* STAGE-2 DESIGN */}
  <div className="design-cell">
    {paFanStage2Design.toFixed(2)}
  </div>

  {/* UNIT-3 */}
  <div className="trend-cell">{paFanSecU3.toFixed(2)}</div>

  {/* UNIT-3 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: paFanGap3 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {paFanGap3.toFixed(2)}
  </div>

  {/* UNIT-4 */}
  <div className="trend-cell">{paFanSecU4.toFixed(2)}</div>

  {/* UNIT-4 Gap*/}
  <div className="trend-cell"
    
    style={{
      color: paFanGap4 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {paFanGap4.toFixed(2)}
  </div>

  
</div>
  {/* ENERGY CONSUMPTION INDEX ROW */}
<div className="sec_industrial-row ">

  <div className="system-cell">
    Energy Consumption Index (ECI)
  </div>

  <div className="trend-cell">kW/MW</div>

  {/* STAGE-1 DESIGN */}
  <div className="design-cell">
    {eciStage1Design.toFixed(2)}
  </div>

  {/* UNIT-1 */}
  <div className="trend-cell">{eciU1.toFixed(2)}</div>

  {/* Unit-1 Gap*/}
  <div
    className="trend-cell"
    style={{
      color: eciGap1 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {eciGap1.toFixed(2)}
  </div>

  {/* UNIT-2 */}
  <div className="trend-cell">{eciU2.toFixed(2)}</div>

  {/* Unit-2 Gap */}
  <div
    className="trend-cell"
    style={{
      color: eciGap2 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {eciGap2.toFixed(2)}
  </div>

  {/* STAGE-2 DESIGN */}
  <div className="design-cell">
    {eciStage2Design.toFixed(2)}
  </div>

  {/* UNIT-3 */}
  <div className="trend-cell">{eciU3.toFixed(2)}</div>

  {/* Unit-3 Gap */}
  <div
    className="trend-cell"
    style={{
      color: eciGap3 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {eciGap3.toFixed(2)}
  </div>

  {/* UNIT-4 */}
  <div className="trend-cell">{eciU4.toFixed(2)}</div>

  {/* Unit-4 Gap */}
  <div
    className="trend-cell"
    style={{
      color: eciGap4 > 0 ? "red" : "#00ff00",
      fontWeight: "600"
    }}
  >
    {eciGap4.toFixed(2)}
  </div>

</div>

</div>

</div>

  </div>
);
}