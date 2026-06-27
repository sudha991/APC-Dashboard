// pages/MillingSystem.jsx

import {
  useEffect,
  useState
} from "react";
import "../index.css";
import { getPowerData } from "../api/piApi";
import { useNavigate } from "react-router-dom";
import { useTrend } from "../context/TrendContext";
import SelectableTrendCell from "../components/SelectableTrendCell";
import {cwPumpsSystem, cwPumpsAverage} from "../data/cwPumpsSystem";
import {
  getCWPumpsTotalPower
} from "../utils/powerCalculations";

// ========================================
// PI TAG CONFIGURATION
// ========================================



export default function CWPumps() {


  const [apiData, setApiData] = useState({});
  const cwPumpsTotalPower =
  getCWPumpsTotalPower(
    apiData,
    cwPumpsSystem
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

    return Number(value).toFixed(2);
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
  const navigate = useNavigate();

  const { selectedTags, toggleTag } = useTrend();

  // ========================================
  // CHECKBOX HANDLER
  // ========================================
  const cwStage1Total = cwPumpsSystem
    .filter(item => item.type !== "ratio")
    .reduce((sum, item) => {
      const value = apiData[item.stage1];

      return (
        sum +
        (isNaN(parseFloat(value))
          ? 0
          : parseFloat(value))
      );
    }, 0);

  const cwStage2Total = cwPumpsSystem
    .filter(item => item.type !== "ratio")
    .reduce((sum, item) => {
      const value = apiData[item.stage2];

      return (
        sum +
        (isNaN(parseFloat(value))
          ? 0
          : parseFloat(value))
      );
    }, 0);
    
  const stage1ECI = 
    cwStage1Total /
    (2*
      (parseFloat(apiData.CW_pumps_Average_MW_U1) || 1)
    );

  const stage1DesignECI =
    (calculateDesignValue(cwPumpsSystem[0]?.stage1Design) * 2) /
      calculateDesignValue(
      cwPumpsAverage.find(
        item => item.title === "Load"
      )?.stage1Design || 1
    );

  const stage2ECI =
    cwStage2Total /
      (2*
        (parseFloat(apiData.CW_pumps_Average_MW_U3) || 1)
      );

  const stage2DesignECI =
    (calculateDesignValue(cwPumpsSystem[0]?.stage2Design) * 2) /
      calculateDesignValue(
      cwPumpsAverage.find(
        item => item.title === "Load"
      )?.stage2Design || 1
    );

  const gap1 = stage1ECI - 2* stage1DesignECI;
  const gap2 = stage2ECI - 2* stage2DesignECI;


  return (

    <div className="milling-page">


      <div className="industrial-table-container">

        {/* TITLE */}
        <div className="industrial-title">
          CW P/Ps System - Power
        </div>

        {/* HEADER */}
        <div className="industrial-header second-header">

          <div>System</div>
          <div>Units</div>

          <div>STAGE-I (Design)</div>
          <div>Stage-I</div>
          
          <div>STAGE-II (Design)</div>
          <div>Stage-II</div>

        </div>

        {/* BODY */}
        <div className="industrial-body">

          {cwPumpsAverage.map((item, index) => {

            // ========================================
            // VALUE FUNCTION
            // ========================================

            const getValue = (unitKey) => {

              // ========================================
              // AVERAGE CALCULATION
              // ========================================

              if (item.stage1Tags && unitKey === "stage1") {

                const total = item.stage1Tags.reduce(
                  (sum, tag) =>
                    sum + Number(apiData[tag] || 0),
                  0
                );

                return total.toFixed(0);
              }
              // ========================================
              // LOAD TOTAL STAGE-2
              // ========================================

              if (item.stage2Tags && unitKey === "stage2") {

                const total = item.stage2Tags.reduce(
                  (sum, tag) =>
                    sum + Number(apiData[tag] || 0),
                  0
                );

                return total.toFixed(0);
              }

              // ========================================
              // SINGLE VALUE
              // ========================================

              if (item.type !== "ratio") {

                return Number(
                  apiData[item[unitKey]] || 0
                ).toFixed(0);
              }

              // ========================================
              // RATIO VALUE
              // ========================================

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
                  {calculateDesignValue(item.stage1Design).toFixed(0)}
                </div>

                {/* UNIT 1 */}
                <div 
                  className={`trend-cell ${selectedTags.includes(item.stage1)
                    ? "selected-cell"
                    : ""
                    }`}
                  onClick={() => handleCellClick(item.stage1)}
                >
                  {getValue("stage1")}
                </div>

                {/* UNIT 2 */}
                
                {/* STAGE 2 DESIGN */}
                <div className="design-cell">
                  {calculateDesignValue(item.stage2Design).toFixed(0)}
                </div>

                {/* UNIT 3 */}
                <div 
                  className={`trend-cell ${selectedTags.includes(item.stage2)
                    ? "selected-cell"
                    : ""
                    }`}
                  onClick={() => handleCellClick(item.stage2)}
                >
                  {getValue("stage2")}
                </div>

                {/* UNIT 4 */}

              </div>
            );
          })}

        </div>
        <div className="industrial-body">

          {cwPumpsSystem.map((item, index) => {

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
                  {calculateDesignValue(item.stage1Design).toFixed(0)}
                </div>

                {/* UNIT 1 */}
                <SelectableTrendCell className="trend-cell"
                  value={getValue("stage1")}
                  tag={item.stage1}
                  label={`${item.title} Stage-1`}
                />

                {/* UNIT 2 */}

                {/* STAGE 2 DESIGN */}
                <div className="design-cell">
                  {calculateDesignValue(item.stage2Design).toFixed(0)}
                </div>

                {/* UNIT 3 */}
                <SelectableTrendCell className="trend-cell"
                  value={getValue("stage2")}
                  tag={item.stage2}
                  label={`${item.title} Stage-2`}
                />

                {/* UNIT 4 */}


              </div>
            );
          })}

        </div>
        { /* ========= Averate MW ==========*/}

        {/* ======================================== */}
        {/* TOTAL ROW */}
        {/* ======================================== */}

        <div className="industrial-row second-row">

          {/* TITLE */}
          <div className="system-cell">
            Total
          </div>

          {/* UNITS */}
          <div className="trend-cell">kW</div>

          {/* STAGE-1 DESIGN TOTAL */}
          <div className="design-cell">
            {
              (calculateDesignValue(cwPumpsSystem[0]?.stage1Design) * 2).toFixed(0)
            }
          </div>

          {/* UNIT-1 TOTAL */}
          <div className="trend-cell">
            {cwStage1Total.toFixed(0)}
          </div>

          {/* STAGE-2 DESIGN TOTAL */}
          <div className="design-cell">
            {
              (calculateDesignValue(cwPumpsSystem[0]?.stage2Design) * 2).toFixed(0)
            }
          </div>

          {/* UNIT-2 TOTAL */}
          <div className="trend-cell">
            {cwStage2Total.toFixed(0)}
          </div>

        </div>

      </div>

      <div className="industrial-table-container">

        {/* TITLE */}
        <div className="industrial-title">
          CW P/Ps System - Energy Consumption Index (ECI)
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

        <div className="industrial-row total-row">

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

        {/* Gap-1 */}
          <div style={{
            color: gap1 < 0 ? "#00ff00" : "#c62828",
            fontSize:20, fontWeight:700
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

        {/* Gap-2 */}
          <div style={{
            color: gap2 < 0 ? "#00ff00" : "#c62828",
            fontSize:20, fontWeight:700
            }}
          >
            {gap2.toFixed(2)}
          </div>

        </div>

      </div>
    </div>
  );
}