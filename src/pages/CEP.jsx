// pages/MillingSystem.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";
import { getPowerData } from "../api/piApi";
import { useTrend } from "../context/TrendContext";
import SelectableTrendCell from "../components/SelectableTrendCell";
import { cepSystem, cepSystemFlow, cepSystemAverage } from "../data/cepSystem";
import {
  getCEPTotalPower
} from "../utils/powerCalculations";
// ========================================
// PI TAG CONFIGURATION
// ========================================

export default function CEPSystems() {


  const [apiData, setApiData] = useState({});
  const cepTotalPower =
    getCEPTotalPower(
      apiData,
      cepSystem
    );
  // ========================================
  // FORMAT VALUE
  // ========================================

  const formatValue = (value) => {

    if (
      value === "NA" ||
      value === null ||
      value === undefined
    ) {
      return "NA";
    }

    return Number(value).toFixed(0);
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
  const calculateDesignValue = (value) => {

    if (!value) return 0;

    try {

      return Function(
        `"use strict"; return (${value})`
      )();

    } catch {

      return Number(value) || 0;

    }
  };
  const cepUnit1Total = cepSystem
    .filter(item => item.type !== "ratio")
    .reduce((sum, item) => {
      const value = apiData[item.unit1];
      return sum + (isNaN(parseFloat(value)) ? 0 : parseFloat(value));
    }, 0);

  const cepUnit2Total = cepSystem
    .filter(item => item.type !== "ratio")
    .reduce((sum, item) => {
      const value = apiData[item.unit2];
      return sum + (isNaN(parseFloat(value)) ? 0 : parseFloat(value));
    }, 0);

  const cepUnit3Total = cepSystem
    .filter(item => item.type !== "ratio")
    .reduce((sum, item) => {
      const value = apiData[item.unit3];
      return sum + (isNaN(parseFloat(value)) ? 0 : parseFloat(value));
    }, 0);

  const cepUnit4Total = cepSystem
    .filter(item => item.type !== "ratio")
    .reduce((sum, item) => {
      const value = apiData[item.unit4];
      return sum + (isNaN(parseFloat(value)) ? 0 : parseFloat(value));
    }, 0);

  // Stage-1 Design Total Power
  const stage1DesignPower = calculateDesignValue("763*2");

  // Stage-2 Design Total Power
  const stage2DesignPower = calculateDesignValue("962*2");

  // Design Load from Average MW row
  const stage1DesignLoad =
    Number(
      cepSystemAverage.find(
        item => item.title === "Load"
      )?.stage1Design
    ) || 1;

  const stage2DesignLoad =
    Number(
      cepSystemAverage.find(
        item => item.title === "Load"
      )?.stage2Design
    ) || 1;

  // ECI Design Values
  const stage1DesignECI =
    stage1DesignPower / (2 * stage1DesignLoad);

  const stage2DesignECI =
    stage2DesignPower / (2 * stage2DesignLoad);

  const eciU1 =
    (
      Number(apiData.CEP_COND_A_U1 || 0) +
      Number(apiData.CEP_COND_B_U1 || 0) +
      Number(apiData.CEP_COND_C_U1 || 0)
    ) /
    Number(apiData.CEP_COND_Average_MW_U1 || 1);

  const eciU2 =
    (
      Number(apiData.CEP_COND_A_U2 || 0) +
      Number(apiData.CEP_COND_B_U2 || 0) +
      Number(apiData.CEP_COND_C_U2 || 0)
    ) /
    Number(apiData.CEP_COND_Average_MW_U2 || 1);

  const eciU3 =
    (
      Number(apiData.CEP_COND_A_U3 || 0) +
      Number(apiData.CEP_COND_B_U3 || 0) +
      Number(apiData.CEP_COND_C_U3 || 0)
    ) /
    Number(apiData.CEP_COND_Average_MW_U3 || 1);

  const eciU4 =
    (
      Number(apiData.CEP_COND_A_U4 || 0) +
      Number(apiData.CEP_COND_B_U4 || 0) +
      Number(apiData.CEP_COND_C_U4 || 0)
    ) /
    Number(apiData.CEP_COND_Average_MW_U4 || 1);

  const unit1Gap =
    eciU1 - stage1DesignECI;

  const unit2Gap =
    eciU2 - stage1DesignECI;

  const unit3Gap =
    eciU3 - stage2DesignECI;

  const unit4Gap =
    eciU4 - stage2DesignECI;

  const secU1 =
    (
      (Number(apiData.CEP_COND_A_U1 || 0) +
        Number(apiData.CEP_COND_B_U1 || 0) +
        Number(apiData.CEP_COND_C_U1 || 0)) /
      Number(apiData.CEP_COND_Condensate_Flow_U1 || 1)
    );

  const secU2 =
    (
      (Number(apiData.CEP_COND_A_U2 || 0) +
        Number(apiData.CEP_COND_B_U2 || 0) +
        Number(apiData.CEP_COND_C_U2 || 0)) /
      Number(apiData.CEP_COND_Condensate_Flow_U2 || 1)
    );

  const stage1DesignSEC =
    calculateDesignValue("763*2") /
    calculateDesignValue(
      cepSystemFlow.find(
        item => item.title === "Condensate Flow"
      )?.stage1Design || 1
    );

  const unit1GapSEC =
    secU1 - stage1DesignSEC;

  const unit2GapSEC =
    secU2 - stage1DesignSEC;

  const secU3 =
    (
      (Number(apiData.CEP_COND_A_U3 || 0) +
        Number(apiData.CEP_COND_B_U3 || 0) +
        Number(apiData.CEP_COND_C_U3 || 0)) /
      Number(apiData.CEP_COND_Condensate_Flow_U3 || 1)
    );

  const secU4 =
    (
      (Number(apiData.CEP_COND_A_U4 || 0) +
        Number(apiData.CEP_COND_B_U4 || 0) +
        Number(apiData.CEP_COND_C_U4 || 0)) /
      Number(apiData.CEP_COND_Condensate_Flow_U4 || 1)
    );

  const stage2DesignSEC =
    calculateDesignValue("962*2") /
    calculateDesignValue(
      cepSystemFlow.find(
        item => item.title === "Condensate Flow"
      )?.stage2Design || 1
    );

  const unit3GapSEC =
    secU3 - stage2DesignSEC;

  const unit4GapSEC =
    secU4 - stage2DesignSEC;

  // For Pie Chart
  return (

    <div className="milling-page">

      {/* ======================================== */}
      {/* MAIN TABLE */}
      {/* ======================================== */}

      <div className="industrial-table-container">

        {/* TITLE */}
        <div className="industrial-title">
          CEP System - Power & Condensate Flow
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
        <div className="industrial-body">

          {cepSystemAverage.map((item, index) => {

            // ========================================
            // VALUE FUNCTION
            // ========================================

            const getValue = (unitKey) => {

              // SINGLE VALUE
              if (item.type !== "ratio") {

                return Number(
                  apiData[item[unitKey]] || 0
                ).toFixed(0);
              }

              // RATIO VALUE
              const tag1 = Number(
                apiData[item[`${unitKey}Tag1`]] || 0
              );

              const tag2 = Number(
                apiData[item[`${unitKey}Tag2`]] || 0
              );

              return `${tag1.toFixed(1)}/${tag2.toFixed(1)}`;
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
                  {
                    item.units
                      ? item.units
                      : item.type === "ratio"
                        ? "kWh/T"
                        : "kW"
                  }
                </div>

                {/* STAGE 1 DESIGN */}
                <div className="design-cell">
                  {item.stage1Design}
                </div>

                {/* UNIT 1 */}
                <div className="trend-cell">
                  {getValue("unit1")}
                </div>

                {/* UNIT 2 */}
                <div className="trend-cell">
                  {getValue("unit2")}
                </div>

                {/* STAGE 2 DESIGN */}
                <div className="design-cell">
                  {item.stage2Design}
                </div>

                {/* UNIT 3 */}
                <div className="trend-cell">
                  {getValue("unit3")}
                </div>

                {/* UNIT 4 */}
                <div className="trend-cell">
                  {getValue("unit4")}
                </div>

              </div>
            );
          })}

        </div>
        <div className="industrial-body">

          {cepSystem.map((item, index) => {

            // ========================================
            // VALUE FUNCTION
            // ========================================

            const getValue = (unitKey) => {

              // SINGLE VALUE
              if (item.type !== "ratio") {

                return Number(
                  apiData[item[unitKey]] || 0
                ).toFixed(0);
              }

              // RATIO VALUE
              const tag1 = Number(
                apiData[item[`${unitKey}Tag1`]] || 0
              );

              const tag2 = Number(
                apiData[item[`${unitKey}Tag2`]] || 0
              );

              return `${tag1.toFixed(1)}/${tag2.toFixed(1)}`;
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
                  {
                    item.units
                      ? item.units
                      : item.type === "ratio"
                        ? "kWh/T"
                        : "kW"
                  }
                </div>

                {/* STAGE 1 DESIGN */}
                <div className="design-cell">
                  {item.stage1Design}
                </div>

                {/* UNIT 1 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(apiData[item.unit1])}
                  tag={item.unit1}
                  label={`${item.system} Unit-1`}
                />

                {/* UNIT 2 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(apiData[item.unit2])}
                  tag={item.unit2}
                  label={`${item.system} Unit-2`}
                />

                {/* STAGE 2 DESIGN */}
                <div className="design-cell">
                  {item.stage2Design}
                </div>

                {/* UNIT 3 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(apiData[item.unit3])}
                  tag={item.unit3}
                  label={`${item.system} Unit-3`}
                />

                {/* UNIT 4 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(apiData[item.unit4])}
                  tag={item.unit4}
                  label={`${item.system} Unit-4`}
                />

              </div>
            );
          })}


        </div>
        {/* ======================================== */}
        {/* TOTAL ROW */}
        {/* ======================================== */}

        <div className="industrial-row total-row">

          {/* TITLE */}
          <div className="system-cell">
            Total Power
          </div>

          {/* UNITS */}
          <div className="trend-cell">kW</div>

          {/* STAGE-1 DESIGN TOTAL */}
          <div className="design-cell">
            {
              ( ( cepSystem
                .reduce(
                  (sum, item) =>
                    sum +
                    calculateDesignValue(
                      item.stage1Design
                    ),
                  0
                )
                .toFixed(0)
                ) -763
              )
            }
          </div>

          {/* UNIT-1 TOTAL */}
          <div className="trend-cell">{cepUnit1Total.toFixed(0)}</div>

          {/* UNIT-2 TOTAL */}
          <div className="trend-cell">{cepUnit2Total.toFixed(0)}</div>

          {/* STAGE-2 DESIGN TOTAL */}
          <div className="design-cell">
            {
              ( ( cepSystem
                .reduce(
                  (sum, item) =>
                    sum +
                    calculateDesignValue(
                      item.stage2Design
                    ),
                  0
                )
                .toFixed(0)
                ) - 962
              )
            }
          </div>

          {/* UNIT-3 TOTAL */}
          <div className="trend-cell">{cepUnit3Total.toFixed(0)}</div>

          {/* UNIT-4 TOTAL */}
          <div className="trend-cell">{cepUnit4Total.toFixed(0)}</div>

        </div>
        <div className="industrial-body">

          {cepSystemFlow.map((item, index) => {

            // ========================================
            // VALUE FUNCTION
            // ========================================

            const getValue = (unitKey) => {

              // SINGLE VALUE
              if (item.type !== "ratio") {

                return Number(
                  apiData[item[unitKey]] || 0
                ).toFixed(0);
              }

              // RATIO VALUE
              const tag1 = Number(
                apiData[item[`${unitKey}Tag1`]] || 0
              );

              const tag2 = Number(
                apiData[item[`${unitKey}Tag2`]] || 0
              );

              return `${tag1.toFixed(1)}/${tag2.toFixed(1)}`;
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
                  {
                    item.units
                      ? item.units
                      : item.type === "ratio"
                        ? "kWh/T"
                        : "kW"
                  }
                </div>

                {/* STAGE 1 DESIGN */}
                <div className="design-cell">
                  {item.stage1Design}
                </div>

                {/* UNIT 1 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(apiData[item.unit1])}
                  tag={item.unit1}
                  label={`${item.system} Unit-1`}
                />

                {/* UNIT 2 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(apiData[item.unit2])}
                  tag={item.unit2}
                  label={`${item.system} Unit-2`}
                />

                {/* STAGE 2 DESIGN */}
                <div className="design-cell">
                  {item.stage2Design}
                </div>

                {/* UNIT 3 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(apiData[item.unit3])}
                  tag={item.unit3}
                  label={`${item.system} Unit-3`}
                />

                {/* UNIT 4 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(apiData[item.unit4])}
                  tag={item.unit4}
                  label={`${item.system} Unit-4`}
                />

              </div>
            );
          })}

        </div>

      </div>

      <div className="industrial-table-container">

        {/* TITLE */}
        <div className="industrial-title">
          CEP System - Specific energy consumption (SEC) & Energy Consumption Index (ECI)
        </div>


        {/* HEADER */}
        <div className="sec_industrial-header ">

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

        {/* ======================================== */}
        {/* SEC ROW */}
        {/* ======================================== */}

        <div className="sec_industrial-row ">

          <div className="system-cell">
            SEC
          </div>

          <div className="trend-cell">kWh/T</div>

          {/* STAGE-I DESIGN */}
          <div className="design-cell">
            {stage1DesignSEC.toFixed(2)}
          </div>

          {/* UNIT-1 */}
          <div className="trend-cell">
            {
              (
                (
                  Number(apiData.CEP_COND_A_U1 || 0) +
                  Number(apiData.CEP_COND_B_U1 || 0) +
                  Number(apiData.CEP_COND_C_U1 || 0)
                ) /
                Number(apiData.CEP_COND_Condensate_Flow_U1 || 1)
              ).toFixed(2)
            }
          </div>

          {/* GAP UNIT-1 */}
          <div
            style={{
              color: unit1GapSEC < 0 ? "#00ff00" : "red",
              fontWeight: "bold", fontSize: 20
            }}
          >
            {unit1GapSEC.toFixed(2)}
          </div>

          {/* UNIT-2 */}
          <div className="trend-cell">
            {
              (
                (
                  Number(apiData.CEP_COND_A_U2 || 0) +
                  Number(apiData.CEP_COND_B_U2 || 0) +
                  Number(apiData.CEP_COND_C_U2 || 0)
                ) /
                Number(apiData.CEP_COND_Condensate_Flow_U2 || 1)
              ).toFixed(2)
            }
          </div>

          {/* GAP UNIT-2 */}
          <div
            style={{
              color: unit2GapSEC < 0 ? "#00ff00" : "red",
              fontWeight: "bold", fontSize: 20
            }}
          >
            {unit2GapSEC.toFixed(2)}
          </div>

          {/* STAGE-II DESIGN */}
          <div className="design-cell">
            {stage2DesignSEC.toFixed(2)}
          </div>

          {/* UNIT-3 */}
          <div className="trend-cell">
            {
              (
                (
                  Number(apiData.CEP_COND_A_U3 || 0) +
                  Number(apiData.CEP_COND_B_U3 || 0) +
                  Number(apiData.CEP_COND_C_U3 || 0)
                ) /
                Number(apiData.CEP_COND_Condensate_Flow_U3 || 1)
              ).toFixed(2)
            }
          </div>

          {/* GAP UNIT-3 */}
          <div
            style={{
              color: unit3GapSEC < 0 ? "#00ff00" : "red",
              fontWeight: "bold", fontSize: 20
            }}
          >
            {unit3GapSEC.toFixed(2)}
          </div>

          {/* UNIT-4 */}
          <div className="trend-cell">
            {
              (
                (
                  Number(apiData.CEP_COND_A_U4 || 0) +
                  Number(apiData.CEP_COND_B_U4 || 0) +
                  Number(apiData.CEP_COND_C_U4 || 0)
                ) /
                Number(apiData.CEP_COND_Condensate_Flow_U4 || 1)
              ).toFixed(2)
            }
          </div>

          {/* GAP UNIT-4 */}
          <div
            style={{
              color: unit4GapSEC < 0 ? "#00ff00" : "red",
              fontWeight: "bold", fontSize: 20
            }}
          >
            {unit4GapSEC.toFixed(2)}
          </div>

        </div>


        {/* ======================================== */}
        {/* ENERGY CONSUMPTION INDEX */}
        {/* ======================================== */}

        <div className="sec_industrial-row ">

          <div className="system-cell">
            Energy Consumption Index(ECI)
          </div>

          <div className="trend-cell">kW/MW</div>

          {/* STAGE-I DESIGN */}
          <div className="design-cell">
            {stage1DesignECI.toFixed(2)}
          </div>

          {/* UNIT-1 */}
          <div className="trend-cell">{eciU1.toFixed(2)}</div>

          {/* GAP UNIT-1 */}
          <div
            style={{
              color: unit1Gap < 0 ? "#00ff00" : "red",
              fontWeight: "bold", fontSize: 20
            }}
          >
            {unit1Gap.toFixed(2)}
          </div>

          {/* UNIT-2 */}
          <div className="trend-cell">{eciU2.toFixed(2)}</div>

          {/* GAP UNIT-2 */}
          <div
            style={{
              color: unit2Gap < 0 ? "#00ff00" : "red",
              fontWeight: "bold", fontSize: 20
            }}
          >
            {unit2Gap.toFixed(2)}
          </div>

          {/* STAGE-II DESIGN */}
          <div className="design-cell">
            {stage2DesignECI.toFixed(2)}
          </div>

          {/* UNIT-3 */}
          <div className="trend-cell">{eciU3.toFixed(2)}</div>

          {/* GAP UNIT-3 */}
          <div
            style={{
              color: unit3Gap < 0 ? "#00ff00" : "red",
              fontWeight: "bold", fontSize: 20
            }}
          >
            {unit3Gap.toFixed(2)}
          </div>

          {/* UNIT-4 */}
          <div className="trend-cell">{eciU4.toFixed(2)}</div>

          {/* GAP UNIT-4 */}
          <div
            style={{
              color: unit4Gap < 0 ? "#00ff00" : "red",
              fontWeight: "bold", fontSize: 20
            }}
          >
            {unit4Gap.toFixed(2)}
          </div>

        </div>

      </div>

      {/* ======================================== */}
      {/* Individual CEP SEC */}
      {/* ======================================== */}

      {/* <div className="industrial-table-container">

      
      <div className="industrial-title">
        Individual CEP SEC
      </div>


      
      <div className="industrial-header">

        <div>System</div>
        <div>Units</div>
        <div>UNIT-1</div>
        <div>UNIT-2</div>
        <div>STAGE-I (Design)</div>
        <div>UNIT-3</div>
        <div>UNIT-4</div>
        <div>STAGE-II (Design)</div>

      </div>

      
      <div className="industrial-body">

        {IndividualCepSystem.map((item, index) => {

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

            return `${tag1.toFixed(1)}/${tag2.toFixed(1)}`;
          };

          return (

            <div
              className="industrial-row"
              key={index}
            >

              
              <div className="system-cell">
                {item.title}
              </div>

              
              <div>
                {
                    item.units
                    ? item.units
                    : item.type === "ratio"
                    ? "kWh/T"
                    : "kW"
                }
                </div>

              
              <div>
                {getValue("unit1")}
              </div>

              
              <div>
                {getValue("unit2")}
              </div>

              
              <div className="design-cell">
                {item.stage1Design}
              </div>

              
              <div>
                {getValue("unit3")}
              </div>

             
              <div>
                {getValue("unit4")}
              </div>

              
              <div className="design-cell">
                {item.stage2Design}
              </div>

            </div>
          );
        })}

      </div>

<div className="industrial-row total-row">

  <div className="system-cell">
    CEP-A
  </div>

  <div>kWh/T</div>

  <div>
    {
      Number(apiData.CEP_COND_A_SEC_TPH_U1 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_A_U1 || 0) /
            Number(apiData.CEP_COND_A_SEC_TPH_U1 || 1)
          ).toFixed(2)
    }
  </div>

  <div>
    {
      Number(apiData.CEP_COND_A_SEC_TPH_U2 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_A_U2 || 0) /
            Number(apiData.CEP_COND_A_SEC_TPH_U2 || 1)
          ).toFixed(2)
    }
  </div>

  <div className="design-cell">
    {
      (
        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "CEP A"
          )?.stage1Design || 0
        ) /

        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "CEP A"
          )?.stage1Design || 1
        )

      ).toFixed(2)
    }
  </div>

  <div>
    {
      Number(apiData.CEP_COND_A_SEC_TPH_U3 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_A_U3 || 0) /
            Number(apiData.CEP_COND_A_SEC_TPH_U3 || 1)
          ).toFixed(2)
    }
  </div>

  <div>
    {
      Number(apiData.CEP_COND_A_SEC_TPH_U4 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_A_U4 || 0) /
            Number(apiData.CEP_COND_A_SEC_TPH_U4 || 1)
          ).toFixed(2)
    }
  </div>

  <div className="design-cell">
    {
      (
        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "CEP A"
          )?.stage2Design || 0
        ) /

        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "CEP A"
          )?.stage2Design || 1
        )

      ).toFixed(2)
    }
  </div>

</div>

<div className="industrial-row second-row">

  <div className="system-cell">
    CEP-B
  </div>

  <div>kWh/T</div>

  <div>
    {
      Number(apiData.CEP_COND_B_SEC_TPH_U1 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_B_U1 || 0) /
            Number(apiData.CEP_COND_B_SEC_TPH_U1 || 1)
          ).toFixed(2)
    }
  </div>

  <div>
    {
      Number(apiData.CEP_COND_B_SEC_TPH_U2 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_B_U2 || 0) /
            Number(apiData.CEP_COND_B_SEC_TPH_U2 || 1)
          ).toFixed(2)
    }
  </div>

  <div className="design-cell">
    {
      (
        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "CEP B"
          )?.stage1Design
        ) /
        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "Condensate Flow"
          )?.stage1Design
        )
      ).toFixed(2)
    }
  </div>

  <div>
    {
      Number(apiData.CEP_COND_B_SEC_TPH_U3 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_B_U3 || 0) /
            Number(apiData.CEP_COND_B_SEC_TPH_U3 || 1)
          ).toFixed(2)
    }
  </div>

  <div>
    {
      Number(apiData.CEP_COND_B_SEC_TPH_U4 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_B_U4 || 0) /
            Number(apiData.CEP_COND_B_SEC_TPH_U4 || 1)
          ).toFixed(2)
    }
  </div>

  <div className="design-cell">
    {
      (
        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "CEP B"
          )?.stage2Design
        ) /
        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "Condensate Flow"
          )?.stage2Design
        )
      ).toFixed(2)
    }
  </div>

</div>

<div className="industrial-row second-row">

  <div className="system-cell">
    CEP-C
  </div>

  <div>kWh/T</div>

  <div>
    {
      Number(apiData.CEP_COND_C_SEC_TPH_U1 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_C_U1 || 0) /
            Number(apiData.CEP_COND_C_SEC_TPH_U1 || 1)
          ).toFixed(2)
    }
  </div>

  <div>
    {
      Number(apiData.CEP_COND_C_SEC_TPH_U2 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_C_U2 || 0) /
            Number(apiData.CEP_COND_C_SEC_TPH_U2 || 1)
          ).toFixed(2)
    }
  </div>

  <div className="design-cell">
    {
      (
        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "CEP C"
          )?.stage1Design
        ) /
        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "Condensate Flow"
          )?.stage1Design
        )
      ).toFixed(2)
    }
  </div>

  <div>
    {
      Number(apiData.CEP_COND_C_SEC_TPH_U3 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_C_U3 || 0) /
            Number(apiData.CEP_COND_C_SEC_TPH_U3 || 1)
          ).toFixed(2)
    }
  </div>

  <div>
    {
      Number(apiData.CEP_COND_C_SEC_TPH_U4 || 0) < 150
        ? "-"
        : (
            Number(apiData.CEP_COND_C_U4 || 0) /
            Number(apiData.CEP_COND_C_SEC_TPH_U4 || 1)
          ).toFixed(2)
    }
  </div>

  <div className="design-cell">
    {
      (
        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "CEP C"
          )?.stage2Design
        ) /
        calculateDesignValue(
          IndividualCepSystem.find(
            item => item.title === "Condensate Flow"
          )?.stage2Design
        )
      ).toFixed(2)
    }
  </div>

</div>

    </div> */}

    </div>
  );
}