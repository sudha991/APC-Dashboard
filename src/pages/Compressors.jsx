// pages/MillingSystem.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";
import { getPowerData } from "../api/piApi";
import { useTrend } from "../context/TrendContext";
import SelectableTrendCell from "../components/SelectableTrendCell";
import { comprSystem, AveragePower } from "../data/comprSystem";
import {
  getCompressorTotalPower
} from "../utils/powerCalculations";
// ========================================
// PI TAG CONFIGURATION
// ========================================

export default function CompressorSystem() {


  const [apiData, setApiData] = useState({});
  const compressorTotalPower =
    getCompressorTotalPower(
      apiData,
      comprSystem
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
  const compressorStage1Total = comprSystem
    .filter(item => item.type !== "ratio")
    .reduce((sum, item) => {
      const value = apiData[item.Stage1];

      return (
        sum +
        (isNaN(parseFloat(value))
          ? 0
          : parseFloat(value))
      );
    }, 0);

  const compressorStage2Total = comprSystem
    .filter(item => item.type !== "ratio")
    .reduce((sum, item) => {
      const value = apiData[item.Stage2];

      return (
        sum +
        (isNaN(parseFloat(value))
          ? 0
          : parseFloat(value))
      );
    }, 0);

  const stage1ECI =
    compressorStage1Total /
      (parseFloat(apiData.Compressors_St_1_Avg_Load_U1) || 1);

  const stage2ECI =
    compressorStage2Total /
      (parseFloat(apiData.Compressors_St_2_Avg_Load_U3) || 1);

  const stage1DesignECI =
    comprSystem.reduce(
        (sum, item) =>
          sum +
          calculateDesignValue(item.stage1Design),
        0
        ) /
          calculateDesignValue(
            AveragePower.find(
              item =>
              item.title === "Stage Average MW"
            )?.stage1Design || 1
          );

  const stage2DesignECI =
    comprSystem.reduce(
      (sum, item) =>
        sum +
        calculateDesignValue(item.stage2Design),
        0
      ) /
        calculateDesignValue(
          AveragePower.find(
            item =>
            item.title === "Stage Average MW"
          )?.stage2Design || 1
        );

/* Gap = Actual ECI - Design ECI */

  const gap1 =
    stage1ECI - stage1DesignECI;

  const gap2 =
    stage2ECI - stage2DesignECI;

  // For Pie Chart

  return (

    <div className="milling-page">

      {/* ======================================== */}
      {/* MAIN TABLE */}
      {/* ======================================== */}

      <div className="industrial-table-container">

        {/* TITLE */}
        <div className="industrial-title">
          Compressed Air System - Power
        </div>


        {/* HEADER */}
        <div className="industrial-header second-header">

          <div>System</div>
          <div>Units</div>

          <div>STAGE-I (Design)</div>
          <div>STAGE-I</div>
          
          <div>STAGE-II (Design)</div>
          <div>STAGE-II</div>

        </div>

        {/* BODY */}
        <div className="industrial-body">

          {AveragePower.map((item, index) => {

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
                className="industrial-row second-row"
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

                <SelectableTrendCell className="trend-cell"
                  value={getValue("Stage1")}
                  tag={item.Stage1}
                  label={`${item.title} Stage-1`}
                />

                {/* STAGE 2 DESIGN */}
                <div className="design-cell">
                  {item.stage2Design}
                </div>

                <SelectableTrendCell className="trend-cell"
                  value={getValue("Stage2")}
                  tag={item.Stage2}
                  label={`${item.title} Stage-2`}
                />

              </div>
            );
          })}


        </div>
        <div className="industrial-body">

          {comprSystem.map((item, index) => {

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
                className="industrial-row second-row"
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

                <SelectableTrendCell className="trend-cell"
                  value={getValue("Stage1")}
                  tag={item.Stage1}
                  label={`${item.title} Stage-1`}
                />

                {/* STAGE 2 DESIGN */}
                <div className="design-cell">
                  {item.stage2Design}
                </div>

                <SelectableTrendCell className="trend-cell"
                  value={getValue("Stage2")}
                  tag={item.Stage2}
                  label={`${item.title} Stage-2`}
                />

              </div>
            );
          })}


        </div>
        {/* ======================================== */}
        {/* TOTAL ROW */}
        {/* ======================================== */}

        <div className="industrial-row second-row">

          {/* TITLE */}
          <div className="system-cell">
            Total Power
          </div>

          {/* UNITS */}
          <div className="trend-cell">kW</div>

          {/* STAGE-1 DESIGN TOTAL */}
          <div className="design-cell">
            {
              (
                calculateDesignValue("270*3")
              )
            }
          </div>

          {/* UNIT-1 TOTAL */}
          <div className="design-cell">
            {compressorStage1Total.toFixed(0)}
          </div>

          {/* STAGE-2 DESIGN TOTAL */}
          <div className="design-cell">
            {
              (
                calculateDesignValue("315*3")
              )
            }
          </div>

          {/* UNIT-3 TOTAL */}
          <div className="design-cell">
            {compressorStage2Total.toFixed(0)}
          </div>

        </div>

      </div>

      <div className="industrial-table-container">

        {/* TITLE */}
        <div className="industrial-title">
          Compressed Air System - Energy Consumption Index (ECI)
        </div>


        {/* HEADER */}
        <div className="industrial-header">

          <div>System</div>
          <div>Units</div>

          <div>STAGE-I (Design)</div>
          <div>Stage-I</div>
          <div>Stage-I Gap</div>

          <div>STAGE-II (Design)</div>          
          <div>Stage-II</div>
          <div>Stage-II Gap</div>

        </div>

        {/* BODY */}

        {/* ======================================== */}
        {/* ENERGY CONSUMPTION INDEX ROW */}
        {/* ======================================== */}

        <div className="industrial-row ">

          <div className="system-cell">
            Energy Consumption Index(ECI)
          </div>

        <div className="trend-cell">kW/MW</div>

        {/* Stage-I Design */}
        <div className="design-cell">
          {stage1DesignECI.toFixed(2)}
        </div>

        {/* Stage-I */}
        <div className="trend-cell">
          {stage1ECI.toFixed(2)}
        </div>

        {/* Gap-I */}
        <div
          style={{
            color:
              gap1 < 0
              ? "#00ff00"
              : "#f80000",
            fontWeight: "700",fontSize:20
          }}
        >
        {gap1.toFixed(2)}
        </div>

        {/* Stage-II Design */}
          <div className="design-cell">
            {stage2DesignECI.toFixed(2)}
          </div>

        {/* Stage-II */}
        <div className="trend-cell">
          {stage2ECI.toFixed(2)}
        </div>

        {/* Gap-II */}
        <div
          style={{
            color:
            gap2 < 0
            ? "#00ff00"
            : "#ff0d0d",
            fontWeight: "700",fontSize:20
          }}
        >
        {gap2.toFixed(2)}
        </div>

      </div>

      </div>


    </div>
  );
}