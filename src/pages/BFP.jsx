// pages/MillingSystem.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";
import { getPowerData } from "../api/piApi";
import { useTrend } from "../context/TrendContext";
import SelectableTrendCell from "../components/SelectableTrendCell";
import { bfpSystem } from "../data/bfpSystem";
import {
  getBFPTotalPower
} from "../utils/powerCalculations";

// ========================================
// PI TAG CONFIGURATION
// ========================================



export default function BfpSystems() {


  const [apiData, setApiData] = useState({});
  const bfpTotalPower =
    getBFPTotalPower(apiData);
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
  const unit1ECI =
    Number(apiData.BFP_MDBFP_U1 || 0) /
    Number(apiData.BFP_Average_MW_U1 || 1);

  const unit2ECI =
    Number(apiData.BFP_MDBFP_U2 || 0) /
    Number(apiData.BFP_Average_MW_U2 || 1);

  const unit3ECI =
    Number(apiData.BFP_MDBFP_U3 || 0) /
    Number(apiData.BFP_Average_MW_U3 || 1);

  const unit4ECI =
    Number(apiData.BFP_MDBFP_U4 || 0) /
    Number(apiData.BFP_Average_MW_U4 || 1);

  const stage1DesignECI =
    calculateDesignValue(
      bfpSystem.find(
        item => item.title === "MDBFP"
      )?.stage1Design || 0
    ) /
    calculateDesignValue(
      bfpSystem.find(
        item => item.title === "Load"
      )?.stage1Design || 1
    );

  const stage2DesignECI =
    calculateDesignValue(
      bfpSystem.find(
        item => item.title === "MDBFP"
      )?.stage2Design || 0
    ) /
    calculateDesignValue(
      bfpSystem.find(
        item => item.title === "Load"
      )?.stage2Design || 1
    );

  const gap1 =
    (unit1ECI + unit2ECI) -
    2 * stage1DesignECI;

  const gap2 =
    (unit3ECI + unit4ECI) -
    2 * stage2DesignECI;
  return (

    <div className="milling-page">

      {/* ======================================== */}
      {/* MAIN TABLE */}
      {/* ======================================== */}

      

      <div className="industrial-table-container">

        {/* TITLE */}
        <div className="industrial-title">
          {/*Power & Specific energy consumption (SEC) - BFP System*/}
          BFP System - Power
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

          {bfpSystem.filter(
            item => item.title !== "MDBFP Suction Flow"
            )
            .map((item, index) => {


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
        {/* SEC ROW */}
        {/* ======================================== */}

        {/*

        <div className="industrial-row total-row">

          <div className="system-cell">
            SEC
          </div>

          <div className="trend-cell">kWh/T</div>

          
          <div className="trend-cell">
            {
              (
                Number(apiData.BFP_MDBFP_U1 || 0) < 100
                  ? 0
                  : (
                    Number(apiData.BFP_MDBFP_U1 || 0) /
                    Number(apiData.BFP_MDBFP_Suction_Flow_U1 || 1)
                  )
              ).toFixed(2)
            }
          </div>

          
          <div className="trend-cell">
            {
              (
                Number(apiData.BFP_MDBFP_U2 || 0) < 100
                  ? 0
                  : (
                    Number(apiData.BFP_MDBFP_U2 || 0) /
                    Number(apiData.BFP_MDBFP_Suction_Flow_U2 || 1)
                  )
              ).toFixed(2)
            }
          </div>

          
          <div className="design-cell">
            {
              (
                calculateDesignValue(
                  bfpSystem.find(
                    item => item.title === "MDBFP"
                  )?.stage1Design || 0
                ) /

                calculateDesignValue(
                  bfpSystem.find(
                    item => item.title === "MDBFP Suction Flow"
                  )?.stage1Design || 1
                )

              ).toFixed(2)
            }
          </div>

          
          <div className="trend-cell">
            {
              (
                Number(apiData.BFP_MDBFP_U3 || 0) /
                Number(apiData.BFP_MDBFP_Suction_Flow_U3 || 1)
              ).toFixed(2)
            }
          </div>

          
          <div className="trend-cell">
            {
              (
                Number(apiData.BFP_MDBFP_U4 || 0) /
                Number(apiData.BFP_MDBFP_Suction_Flow_U4 || 1)
              ).toFixed(2)
            }
          </div>

          
          <div className="design-cell">
            {
              (
                calculateDesignValue(
                  bfpSystem.find(
                    item => item.title === "MDBFP"
                  )?.stage2Design || 0
                ) /

                calculateDesignValue(
                  bfpSystem.find(
                    item => item.title === "MDBFP Suction Flow"
                  )?.stage2Design || 1
                )

              ).toFixed(2)
            }
          </div>

        </div>
        */}
       

      </div>

      {/*

      <div className="industrial-table-container">

        
        <div className="industrial-title">
          Energy Consumption Index (ECI) - BFP System
        </div>


        
        <div className="sec_industrial-header ">

          <div>System</div>
          <div>Units</div>

          <div>UNIT-1</div>
          <div>UNIT-2</div>
          <div>Gap</div>
          <div>STAGE-I (Design)</div>

          <div>UNIT-3</div>
          <div>UNIT-4</div>
          <div>Gap</div>
          <div>STAGE-II (Design)</div>

        </div>

        

        <div className="sec_industrial-row ">

          <div className="system-cell">
            Energy Consumption Index(ECI)
          </div>

          <div className="trend-cell">kW/MW</div>

          
          <div className="trend-cell">
            {
              (
                Number(apiData.BFP_MDBFP_U1 || 0) /
                Number(apiData.BFP_Average_MW_U1 || 1)
              ).toFixed(2)
            }
          </div>

          
          <div className="trend-cell">
            {
              (
                Number(apiData.BFP_MDBFP_U2 || 0) /
                Number(apiData.BFP_Average_MW_U2 || 1)
              ).toFixed(2)
            }
          </div>

          
          <div style={{
            color: gap1 < 0 ? "#00ff00" : "#c62828",
            fontWeight: "700", fontSize: 20
          }}
          >
            {gap1.toFixed(2)}
          </div>

          
          <div className="design-cell">
            {
              (
                calculateDesignValue(
                  bfpSystem.find(
                    item => item.title === "MDBFP"
                  )?.stage1Design || 0
                ) /

                calculateDesignValue(
                  bfpSystem.find(
                    item => item.title === "Load"
                  )?.stage1Design || 1
                )

              ).toFixed(2)
            }
          </div>

          
          <div className="trend-cell">
            {
              (
                Number(apiData.BFP_MDBFP_U3 || 0) /
                Number(apiData.BFP_Average_MW_U3 || 1)
              ).toFixed(2)
            }
          </div>

          
          <div className="trend-cell">
            {
              (
                Number(apiData.BFP_MDBFP_U4 || 0) /
                Number(apiData.BFP_Average_MW_U4 || 1)
              ).toFixed(2)
            }
          </div>

          
          <div style={{
            color: gap2 < 0 ? "#00ff00" : "#c62828",
            fontWeight: "700", fontSize: 20,
          }}
          >
            {gap2.toFixed(2)}
          </div>

          
          <div className="design-cell">
            {
              (
                calculateDesignValue(
                  bfpSystem.find(
                    item => item.title === "MDBFP"
                  )?.stage2Design || 0
                ) /

                calculateDesignValue(
                  bfpSystem.find(
                    item => item.title === "Load"
                  )?.stage2Design || 1
                )

              ).toFixed(2)
            }
          </div>

        </div>

      </div>
      */}

    </div>
  );
}