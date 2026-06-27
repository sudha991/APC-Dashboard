// pages/MillingSystem.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";
import { getPowerData } from "../api/piApi";
import { useTrend } from "../context/TrendContext";
import SelectableTrendCell from "../components/SelectableTrendCell";
import {
  millSystems,
  millOtherData,
} from "../data/millSystems";
import {
  getMillingSystemTotalPower
} from "../utils/powerCalculations";
// ========================================
// PI TAG CONFIGURATION
// ========================================



export default function MillingSystem() {
  const [apiData, setApiData] = useState({});
  const millingSystemTotalPower =
    getMillingSystemTotalPower(
      apiData,
      millSystems
    );
  // ========================================
  // FORMAT VALUE
  // ========================================

  const formatValue = (value) => {

    console.log("Raw Value:", value);

    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "NA"
    ) {
      return "NA";
    }

    const num = parseFloat(value);

    if (isNaN(num)) {
      return "NA";
    }

    return num.toFixed(0);
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

  const calculateSEC = (power, feedRate) => {
    const kw = Number(power || 0);
    const tph = Number(feedRate || 0);

    if (kw < 10 || tph <= 0) {
      return "-";
    }

    return (kw / tph).toFixed(2);
  };
  // ========================================
  // UI
  // ========================================
  const millingUnit1Total = millSystems
    .filter(m => m.title !== "Total Power")
    .reduce(
      (sum, m) => sum + Number(apiData[m.unit1] || 0),
      0
    );

  const millingUnit2Total = millSystems
    .filter(m => m.title !== "Total Power")
    .reduce(
      (sum, m) => sum + Number(apiData[m.unit2] || 0),
      0
    );

  const millingUnit3Total = millSystems
    .filter(m => m.title !== "Total Power")
    .reduce(
      (sum, m) => sum + Number(apiData[m.unit3] || 0),
      0
    );

  const millingUnit4Total = millSystems
    .filter(m => m.title !== "Total Power")
    .reduce(
      (sum, m) => sum + Number(apiData[m.unit4] || 0),
      0
    );

  return (

    <div className="milling-page">


      {/* ======================================== */}
      {/* MAIN TABLE */}
      {/* ======================================== */}
      <div className="otherdata">
        <div className="industrial-table-container">
          <div className="industrial-title">
            Milling System - Specific Energy Consumption (SEC)
          </div>
          {/* HEADER */}
          <div className="sec_industrial-header ">

            <div>System</div>
            <div>Units</div>

            <div>Unit-1</div>
            <div>Unit-1 Gap</div>
            <div>Unit-2</div>
            <div>Unit-2 Gap</div>
            <div>SEC</div>
            <div>Unit-3</div
            ><div>Unit-3 Gap</div>
            <div>Unit-4</div>
            <div>Unit-4 Gap</div>
            <div>SEC</div>

          </div>

          {/* BODY */}
          <div className="industrial-body">

            {millOtherData.map((item, index) => {


              const millPower = millSystems.find(
                m => m.title === item.title
              );

              const secU1 = calculateSEC(
                apiData[millPower?.unit1],
                apiData[item.unit1]
              );

              const secU2 = calculateSEC(
                apiData[millPower?.unit2],
                apiData[item.unit2]
              );

              const secU3 = calculateSEC(
                apiData[millPower?.unit3],
                apiData[item.unit3]
              );

              const secU4 = calculateSEC(
                apiData[millPower?.unit4],
                apiData[item.unit4]
              );

              const toNumber = (value) => {
                if (
                  value === "-" ||
                  value === "" ||
                  value == null ||
                  isNaN(value)
                ) {
                  return 0;
                }

                return Number(value);
              };

              const gap1 =
                toNumber(secU1) +
                toNumber(secU2) -
                (2 * toNumber(item.sec1));

              const gap2 =
                toNumber(secU3) +
                toNumber(secU4) -
                (2 * toNumber(item.sec2));

              const SecGap1 =
                toNumber(secU1) - 8;
              const SecGap2 =
                toNumber(secU2) - 8;
              const SecGap3 =
                toNumber(secU3) - 8.1;
              const SecGap4 =
                toNumber(secU4) - 8.1;

              return (

                <div
                  className="sec_industrial-row "
                  key={index}
                >

                  {/* SYSTEM */}
                  <div className="system-cell">
                    {item.title}
                  </div>

                  {/* UNIT */}
                  <div className="trend-cell">kWh/T</div>

                  {/* UNIT 1 */}
                  <div className="trend-cell">{secU1}</div>
                  <div className={
                    SecGap1 < 0
                      ? "gap-negative"
                      : "gap-positive"
                  }
                  >
                    {SecGap1.toFixed(2)}
                  </div>
                  {/* UNIT 2 */}
                  <div className="trend-cell">{secU2}</div>
                  <div className={
                    SecGap2 < 0
                      ? "gap-negative"
                      : "gap-positive"
                  }
                  >
                    {SecGap2.toFixed(2)}
                  </div>


                  {/* SEC 1 */}
                  <div className="design-cell">
                    {item.sec1}
                  </div>
                  {/*GAP-1*
                  <div className={
                    gap1 < 0
                      ? "gap-negative"
                      : "gap-positive"
                  }
                  >
                    {gap1.toFixed(2)}
                  </div>/}

                  {/* UNIT 3 */}
                  <div className="trend-cell">{secU3}</div>

                  <div className={
                    SecGap3 < 0
                      ? "gap-negative"
                      : "gap-positive"
                  }
                  >
                    {SecGap3.toFixed(2)}
                  </div>
                  {/* UNIT 4 */}
                  <div className="trend-cell">{secU4}</div>
                  <div className={
                    SecGap4 < 0
                      ? "gap-negative"
                      : "gap-positive"
                  }
                  >
                    {SecGap4.toFixed(2)}
                  </div>


                  {/* SEC 2 */}
                  <div className="design-cell">
                    {item.sec2}
                  </div>
                  {/*GAP-1
                  <div className={
                    gap2 < 0
                      ? "gap-negative"
                      : "gap-positive"
                  }
                  >
                    {gap2.toFixed(2)}
                  </div>*/}

                </div>
              );
            })}

          </div>

        </div>
      </div>

      <div className="industrial-table-container">

        {/* TABLE TITLE */}
        <div className="industrial-title">
          Milling Systems - Power
        </div>

        {/* HEADER */}
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

        {/* BODY */}
        <div className="industrial-body">

          {millSystems.map((item, index) => {

            // ========================================
            // PI VALUES
            // ========================================


            const unit1 = Number(
              apiData[item.unit1] || 0
            );

            const unit2 = Number(
              apiData[item.unit2] || 0
            );

            const unit3 = Number(
              apiData[item.unit3] || 0
            );

            const unit4 = Number(
              apiData[item.unit4] || 0
            );
            let displayUnit1, displayUnit2, displayUnit3, displayUnit4;

            if (item.title === "Total Power") {
              displayUnit1 = millingUnit1Total;
              displayUnit2 = millingUnit2Total;
              displayUnit3 = millingUnit3Total;
              displayUnit4 = millingUnit4Total;
            } else {
              displayUnit1 = apiData[item.unit1];
              displayUnit2 = apiData[item.unit2];
              displayUnit3 = apiData[item.unit3];
              displayUnit4 = apiData[item.unit4];
            }

            return (

              <div
                className="industrial-row"
                key={index}
              >

                {/* SYSTEM */}
                <div className="system-cell">
                  {item.title}
                </div>
                <div className="trend-cell">kW</div>
                {/* UNIT 1 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(displayUnit1)}
                  tag={item.unit1}
                  label={`${item.title} Unit-1`}
                />

                {/* UNIT-2 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(displayUnit2)}
                  tag={item.unit2}
                  label={`${item.title} Unit-2`}
                />

                {/* STAGE 1 DESIGN */}
                <div className="design-cell">
                  {item.stage1Design}
                </div>

                {/* UNIT 3 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(displayUnit3)}
                  tag={item.unit3}
                  label={`${item.title} Unit-3`}
                />

                {/* UNIT-4 */}
                <SelectableTrendCell className="trend-cell"
                  value={formatValue(displayUnit4)}
                  tag={item.unit4}
                  label={`${item.title} Unit-4`}
                />


                {/* STAGE 2 DESIGN */}
                <div className="design-cell">
                  {item.stage2Design}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* ======================================== */}
      {/* SECOND TABLE */}
      {/* ======================================== */}
      <div className="otherdata">
        <div className="industrial-table-container">
          <div className="industrial-title">
            Milling System - Feed rate
          </div>
          {/* HEADER */}
          <div className="industrial-header second-header">

            <div>System</div>
            <div>Units</div>


            <div>Unit-1</div>

            <div>Unit-2</div>



            <div>Unit-3</div>

            <div>Unit-4</div>

          </div>

          {/* BODY */}
          <div className="industrial-body">

            {millOtherData.map((item, index) => {

              const unit1 = Number(
                apiData[item.unit1] || 0
              );

              const unit2 = Number(
                apiData[item.unit2] || 0
              );

              const unit3 = Number(
                apiData[item.unit3] || 0
              );

              const unit4 = Number(
                apiData[item.unit4] || 0
              );

              return (

                <div
                  className="industrial-row second-row"
                  key={index}
                >

                  {/* UNIT NAME */}
                  <div className="system-cell">
                    {item.title}
                  </div>
                  <div className="trend-cell">TPH
                  </div>

                  {/* UNIT 1 */}
                  <SelectableTrendCell className="trend-cell"
                    value={formatValue(apiData[item.unit1])}
                    tag={item.unit1}
                    label={`${item.system} Unit-1`}
                  />

                  {/* UNIT-2 */}
                  <SelectableTrendCell className="trend-cell"
                    value={formatValue(apiData[item.unit2])}
                    tag={item.unit2}
                    label={`${item.system} Unit-2`}
                  />



                  {/* UNIT 3 */}
                  <SelectableTrendCell className="trend-cell"
                    value={formatValue(apiData[item.unit3])}
                    tag={item.unit3}
                    label={`${item.system} Unit-3`}
                  />

                  {/* UNIT-4 */}
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
      </div>
    </div>
  );
}