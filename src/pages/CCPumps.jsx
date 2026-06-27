// pages/MillingSystem.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";
import { getPowerData } from "../api/piApi";
import { useTrend } from "../context/TrendContext";
import SelectableTrendCell from "../components/SelectableTrendCell";
import { ccPumpsSystemLoad, ccPumpsSystem } from "../data/ccPumpsSystem";
import {
    getCCPumpsTotalPower
} from "../utils/powerCalculations";
// ========================================
// PI TAG CONFIGURATION
// ========================================

export default function CCPumpsSystems() {


    const [apiData, setApiData] = useState({});
    const ccPumpsTotalPower =
        getCCPumpsTotalPower(
            apiData,
            ccPumpsSystem
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
    const totalUnit1 = ccPumpsSystem.reduce(
        (sum, item) =>
            sum + Number(apiData[item.unit1] || 0),
        0
    );

    const totalUnit2 = ccPumpsSystem.reduce(
        (sum, item) =>
            sum + Number(apiData[item.unit2] || 0),
        0
    );

    const totalUnit3 = ccPumpsSystem.reduce(
        (sum, item) =>
            sum + Number(apiData[item.unit3] || 0),
        0
    );

    const totalUnit4 = ccPumpsSystem.reduce(
        (sum, item) =>
            sum + Number(apiData[item.unit4] || 0),
        0
    );
    const stage1DesignTotal =
        ccPumpsSystem.reduce(
            (sum, item) =>
                sum +
                calculateDesignValue(
                    item.stage1Design
                ),
            0
        );

    const stage2DesignTotal =
        ccPumpsSystem.reduce(
            (sum, item) =>
                sum +
                calculateDesignValue(
                    item.stage2Design
                ),
            0
        );
    const ccUnit1Total = ccPumpsSystem
        .filter(item => item.type === "pump")
        .reduce((sum, item) => {
            const value = apiData[item.unit1];
            return sum + (isNaN(parseFloat(value)) ? 0 : parseFloat(value));
        }, 0);

    const ccUnit2Total = ccPumpsSystem
        .filter(item => item.type === "pump")
        .reduce((sum, item) => {
            const value = apiData[item.unit2];
            return sum + (isNaN(parseFloat(value)) ? 0 : parseFloat(value));
        }, 0);

    const ccUnit3Total = ccPumpsSystem
        .filter(item => item.type === "pump")
        .reduce((sum, item) => {
            const value = apiData[item.unit3];
            return sum + (isNaN(parseFloat(value)) ? 0 : parseFloat(value));
        }, 0);

    const ccUnit4Total = ccPumpsSystem
        .filter(item => item.type === "pump")
        .reduce((sum, item) => {
            const value = apiData[item.unit4];
            return sum + (isNaN(parseFloat(value)) ? 0 : parseFloat(value));
        }, 0);

    const stage1DesignLoad =
        calculateDesignValue(
            ccPumpsSystemLoad.find(
                item => item.title === "Load"
            )?.stage1Design || 1
        );

    const stage2DesignLoad =
        calculateDesignValue(
            ccPumpsSystemLoad.find(
                item => item.title === "Load"
            )?.stage2Design || 1
        );

    const stage1DesignECI =
        ((2 * stage1DesignTotal) - 708) /
        (2 * stage1DesignLoad);

    const stage2DesignECI =
        ((2 * stage2DesignTotal) - 700) /
        (2 * stage2DesignLoad);

    const unit1ECI =
        totalUnit1 /
        Number(apiData.CC_pumps_Average_MW_U1 || 1);

    const unit2ECI =
        totalUnit2 /
        Number(apiData.CC_pumps_Average_MW_U2 || 1);

    const unit3ECI =
        totalUnit3 /
        Number(apiData.CC_pumps_Average_MW_U3 || 1);

    const unit4ECI =
        totalUnit4 /
        Number(apiData.CC_pumps_Average_MW_U4 || 1);

    const Unit1Gap =
        unit1ECI - stage1DesignECI;
    
    const Unit2Gap =
        unit2ECI - stage1DesignECI;

    const Unit3Gap =
        unit3ECI - stage2DesignECI;
    
    const Unit4Gap =
        unit4ECI - stage2DesignECI;

    // For Pie Chart
    return (

        <div className="milling-page">

            {/* ======================================== */}
            {/* MAIN TABLE */}
            {/* ======================================== */}

            <div className="industrial-table-container">

                {/* TITLE */}
                <div className="industrial-title">
                    BCW P/Ps System - Power
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

                    {ccPumpsSystemLoad.map((item, index) => {

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
                                            : item.type === "pump"
                                                ? "kW"
                                                : "kWh/T"
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
                                    label={`${item.title} Unit-1`}
                                />

                                {/* UNIT 2 */}
                                <SelectableTrendCell className="trend-cell"
                                    value={formatValue(apiData[item.unit2])}
                                    tag={item.unit2}
                                    label={`${item.title} Unit-2`}
                                />

                                {/* STAGE 2 DESIGN */}
                                <div className="design-cell">
                                    {item.stage2Design}
                                </div>

                                {/* UNIT 3 */}
                                <SelectableTrendCell className="trend-cell"
                                    value={formatValue(apiData[item.unit3])}
                                    tag={item.unit3}
                                    label={`${item.title} Unit-3`}
                                />

                                {/* UNIT 4 */}
                                <SelectableTrendCell className="trend-cell"
                                    value={formatValue(apiData[item.unit4])}
                                    tag={item.unit4}
                                    label={`${item.title} Unit-4`}
                                />

                            </div>
                        );
                    })}


                </div>
                <div className="industrial-body">

                    {ccPumpsSystem.map((item, index) => {

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
                                            : item.type === "pump"
                                                ? "kW"
                                                : "kWh/T"
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
                            (
                                calculateDesignValue(
                                    ccPumpsSystem.find(
                                        item => item.title === "BCW-P/P A"
                                    )?.stage1Design || 0
                                ) * 2
                            ).toFixed(0)
                        }
                    </div>

                    {/* UNIT-1 TOTAL */}
                    <div className="trend-cell">
                        {ccUnit1Total.toFixed(0)}
                    </div>

                    {/* UNIT-2 TOTAL */}
                    <div className="trend-cell">
                        {ccUnit2Total.toFixed(0)}
                    </div>

                    {/* STAGE-2 DESIGN TOTAL */}
                    <div className="design-cell">
                        {
                            (
                                calculateDesignValue(
                                    ccPumpsSystem.find(
                                        item => item.title === "BCW-P/P A"
                                    )?.stage2Design || 0
                                ) * 2
                            ).toFixed(0)
                        }
                    </div>

                    {/* UNIT-3 TOTAL */}
                    <div className="trend-cell">
                        {ccUnit3Total.toFixed(0)}
                    </div>

                    {/* UNIT-4 TOTAL */}
                    <div className="trend-cell">
                        {ccUnit4Total.toFixed(0)}
                    </div>

                </div>

            </div>

            <div className="industrial-table-container">

                {/* TITLE */}
                <div className="industrial-title">
                    BCW P/Ps System - Energy Consumption Index (ECI)
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
                {/* ENERGY CONSUMPTION INDEX */}
                {/* ======================================== */}

                <div className="sec_industrial-row ">

                    <div className="system-cell">
                        Energy Consumption Index(ECI)
                    </div>

                    <div className="trend-cell" >kW/MW</div>

                    {/* STAGE-1 DESIGN */}
                    <div className="design-cell">
                        {stage1DesignECI.toFixed(2)}
                    </div>

                    {/* UNIT-1 */}
                    <div className="trend-cell">{unit1ECI.toFixed(2)}</div>

                    {/* GAP UNIT-1 */}
                    <div
                        style={{
                            color: Unit1Gap < 0 ? "#00ff00" : "red",
                            fontWeight: "bold", fontSize: 20
                        }}
                    >
                        {Unit1Gap.toFixed(2)}
                    </div>

                    {/* UNIT-2 */}
                    <div className="trend-cell">{unit2ECI.toFixed(2)}</div>

                    {/* GAP UNIT-2 */}
                    <div
                        style={{
                            color: Unit2Gap < 0 ? "#00ff00" : "red",
                            fontWeight: "bold", fontSize: 20
                        }}
                    >
                        {Unit2Gap.toFixed(2)}
                    </div>

                    {/* STAGE-2 DESIGN */}
                    <div className="design-cell">
                        {stage2DesignECI.toFixed(2)}
                    </div>

                    {/* UNIT-3 */}
                    <div className="trend-cell">{unit3ECI.toFixed(2)}</div>

                    {/* GAP STAGE-2 */}
                    <div
                        style={{
                            color: Unit3Gap < 0 ? "#00ff00" : "red",
                            fontWeight: "bold", fontSize: 20
                        }}
                    >
                        {Unit3Gap.toFixed(2)}
                    </div>

                    {/* UNIT-4 */}
                    <div className="trend-cell">{unit4ECI.toFixed(2)}</div>

                    {/* GAP STAGE-2 */}
                    <div
                        style={{
                            color: Unit4Gap < 0 ? "#00ff00" : "red",
                            fontWeight: "bold", fontSize: 20
                        }}
                    >
                        {Unit4Gap.toFixed(2)}
                    </div>

                </div>

            </div>


        </div>
    );
}