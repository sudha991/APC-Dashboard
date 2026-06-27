import { useEffect, useState } from "react";
import "../index.css";
import { getPowerData } from "../api/piApi";
import SelectableTrendCell from "../components/SelectableTrendCell";
import ViewTrendButton from "../components/ViewTrendButton";
import { useNavigate } from "react-router-dom";
import { useTrend } from "../context/TrendContext";

export default function Dashboard() {
  const [apiData, setApiData] = useState({});
  const navigate = useNavigate();

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
  // =========================
  // FETCH API DATA
  // =========================
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

    // AUTO REFRESH EVERY 5 SECONDS
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    // CLEANUP
    return () => clearInterval(interval);

  }, []);

  // =========================
  // KEEP SAME DESIGN STRUCTURE
  // =========================
  const stage1 =
    Number(apiData.UNIT_1 || 0) +
    Number(apiData.UNIT_2 || 0);

  const stage2 =
    Number(apiData.UNIT_3 || 0) +
    Number(apiData.UNIT_4 || 0);

  const unitDataLeft = [
    { title: "UNIT-1 (MW)", key: "UNIT_1" },
    { title: "UNIT-2 (MW)", key: "UNIT_2" },
    { title: "STAGE-1 (MW)", value: stage1 },
    { title: "STG-1 DESIGN (MW)", value: "1000" },
  ];

  const unitDataRight = [
    { title: "UNIT-3 (MW)", key: "UNIT_3" },
    { title: "UNIT-4 (MW)", key: "UNIT_4" },
    { title: "STAGE-2 (MW)", value: stage2 },
    { title: "STG-2 DESIGN (MW)", value: "1000" },
  ];

  const stageSystems = [
    ["MILLING SYSTEM", "1,312", "4,641"],
    ["DRAFT SYSTEM", "11,017", "18,936"],
    ["ESP SYSTEM", "1,759", "3,339"],
    ["CONDENSATE SYSTEM", "1,727", "4,903"],
    ["CW SYSTEM", "5,099", "16,990"],
  ];
  // =========================
  // live Table Data DESIGN STRUCTURE
  // =========================

  const Load = [
    {
      system: "LOAD (MW)",
      type: "single",

      unit1: "UNIT_1",

      unit2: "UNIT_2",

      unit3: "UNIT_3",

      unit4: "UNIT_4",

      stage1Design: "500",

      stage2Design: "500",
    },
  ]; const CoalFlow = [
    {
      system: "Coal Flow (TPH)",
      type: "flow",
      unit1: "Coal_Flow_u1",
      unit2: "Coal_Flow_u2",
      unit3: "Coal_Flow_u3",
      unit4: "Coal_Flow_u4",
      stage1Design: "339",
      stage2Design: "347",
    },
  ];
  const DSspecificCoal = [
    {
      system: "Specific Coal",
      type: "ratio",
      unit1Tag1: "Coal_Flow_u1",
      unit1Tag2: "DS_LOAD_u1",

      unit2Tag1: "Coal_Flow_u2",
      unit2Tag2: "DS_LOAD_u2",

      unit3Tag1: "Coal_Flow_u3",
      unit3Tag2: "DS_LOAD_u3",

      unit4Tag1: "Coal_Flow_u4",
      unit4Tag2: "DS_LOAD_u4",
      stage1Design: "0.67",
      stage2Design: "0.69",
    },];
  const TotalAirFlow = [


    {
      system: "Total Air Flow (TPH)",
      type: "flow",
      unit1: "DS_TotalAirFlow_u1",
      unit2: "DS_TotalAirFlow_u2",
      unit3: "DS_TotalAirFlow_u3",
      unit4: "DS_TotalAirFlow_u4",
      stage1Design: "1623",
      stage2Design: "1653",
    },

    {
      system: "Excess Air",
      unit1: "Excess_Air_U1",
      unit2: "Excess_Air_U2",
      unit3: "Excess_Air_U3",
      unit4: "Excess_Air_U4",
      stage1Design: "20 %",
      stage2Design: "20 %",
    },
  ]; const liveTableData = [
    {
      system: "PA FAN-A",
      unit1: "PA_FAN_A_U1",
      unit2: "PA_FAN_A_U2",
      unit3: "PA_FAN_A_U3",
      unit4: "PA_FAN_A_U4",
      stage1Design: "1817",
      stage2Design: "2990",
    },

    {
      system: "PA FAN-B",
      unit1: "PA_FAN_B_U1",
      unit2: "PA_FAN_B_U2",
      unit3: "PA_FAN_B_U3",
      unit4: "PA_FAN_B_U4",
      stage1Design: "1817",
      stage2Design: "2990",
    },

    {
      system: "FD FAN-A",
      unit1: "FD_FAN_A_U1",
      unit2: "FD_FAN_A_U2",
      unit3: "FD_FAN_A_U3",
      unit4: "FD_FAN_A_U4",
      stage1Design: "1175",
      stage2Design: "1528",
    },

    {
      system: "FD FAN-B",
      unit1: "FD_FAN_B_U1",
      unit2: "FD_FAN_B_U2",
      unit3: "FD_FAN_B_U3",
      unit4: "FD_FAN_B_U4",
      stage1Design: "1175",
      stage2Design: "1528",
    },

    {
      system: "ID FAN-A CH-1",
      unit1: "ID_FAN_A_CH_1_U1",
      unit2: "ID_FAN_A_CH_1_U2",
      unit3: "ID_FAN_A_CH_1_U3",
      unit4: "ID_FAN_A_CH_1_U4",
      stage1Design: "1825",
      stage2Design: "2000",
    },

    {
      system: "ID FAN-A CH-2",
      unit1: "ID_FAN_A_CH_2_U1",
      unit2: "ID_FAN_A_CH_2_U2",
      unit3: "ID_FAN_A_CH_2_U3",
      unit4: "ID_FAN_A_CH_2_U4",
      stage1Design: "1825",
      stage2Design: "2000",
    },

    {
      system: "ID FAN-B CH-1",
      unit1: "ID_FAN_B_CH_1_U1",
      unit2: "ID_FAN_B_CH_1_U2",
      unit3: "ID_FAN_B_CH_1_U3",
      unit4: "ID_FAN_B_CH_1_U4",
      stage1Design: "1825",
      stage2Design: "2000",
    },

    {
      system: "ID FAN-B CH-2",
      unit1: "ID_FAN_B_CH_2_U1",
      unit2: "ID_FAN_B_CH_2_U2",
      unit3: "ID_FAN_B_CH_2_U3",
      unit4: "ID_FAN_B_CH_2_U4",
      stage1Design: "1825",
      stage2Design: "2000",
    },

    {
      system: "MILL-A",
      unit1: "Mill_A_U1",
      unit2: "Mill_A_U2",
      unit3: "Mill_A_U3",
      unit4: "Mill_A_U4",
      stage1Design: "525",
      stage2Design: "525",
    },

    {
      system: "MILL-B",
      unit1: "Mill_B_U1",
      unit2: "Mill_B_U2",
      unit3: "Mill_B_U3",
      unit4: "Mill_B_U4",
      stage1Design: "525",
      stage2Design: "525",
    },

    {
      system: "MILL-C",
      unit1: "Mill_C_U1",
      unit2: "Mill_C_U2",
      unit3: "Mill_C_U3",
      unit4: "Mill_C_U4",
      stage1Design: "525",
      stage2Design: "525",
    },

    {
      system: "MILL-D",
      unit1: "Mill_D_U1",
      unit2: "Mill_D_U2",
      unit3: "Mill_D_U3",
      unit4: "Mill_D_U4",
      stage1Design: "525",
      stage2Design: "525",
    },

    {
      system: "MILL-E",
      unit1: "Mill_E_U1",
      unit2: "Mill_E_U2",
      unit3: "Mill_E_U3",
      unit4: "Mill_E_U4",
      stage1Design: "525",
      stage2Design: "525",
    },

    {
      system: "MILL-F",
      unit1: "Mill_F_U1",
      unit2: "Mill_F_U2",
      unit3: "Mill_F_U3",
      unit4: "Mill_F_U4",
      stage1Design: "525",
      stage2Design: "525",
    },

    {
      system: "MILL-G",
      unit1: "Mill_G_U1",
      unit2: "Mill_G_U2",
      unit3: "Mill_G_U3",
      unit4: "Mill_G_U4",
      stage1Design: "525",
      stage2Design: "525",
    },

    {
      system: "MILL-H",
      unit1: "Mill_H_U1",
      unit2: "Mill_H_U2",
      unit3: "Mill_H_U3",
      unit4: "Mill_H_U4",
      stage1Design: "525",
      stage2Design: "525",
    },

    {
      system: "MILL-J",
      unit1: "Mill_J_U1",
      unit2: "Mill_J_U2",
      unit3: "Mill_J_U3",
      unit4: "Mill_J_U4",
      stage1Design: "525",
      stage2Design: "525",
    },

    {
      system: "MILL-K",
      unit1: "Mill_K_U1",
      unit2: "Mill_K_U2",
      unit3: "Mill_K_U3",
      unit4: "Mill_K_U4",
      stage1Design: "525",
      stage2Design: "525",
    },



    {
      system: "BFP-C",
      unit1: "BFP_C_U1",
      unit2: "BFP_C_U2",
      unit3: "BFP_C_U3",
      unit4: "BFP_C_U4",
      stage1Design: "10,000",
      stage2Design: "10,000",
    },

    {
      system: "CEP-A",
      unit1: "CEP_A_U1",
      unit2: "CEP_A_U2",
      unit3: "CEP_A_U3",
      unit4: "CEP_A_U4",
      stage1Design: "763",
      stage2Design: "962",
    },

    {
      system: "CEP-B",
      unit1: "CEP_B_U1",
      unit2: "CEP_B_U2",
      unit3: "CEP_B_U3",
      unit4: "CEP_B_U4",
      stage1Design: "763",
      stage2Design: "962",
    },

    {
      system: "CEP-C",
      unit1: "CEP_C_U1",
      unit2: "CEP_C_U2",
      unit3: "CEP_C_U3",
      unit4: "CEP_C_U4",
      stage1Design: "763",
      stage2Design: "962",
    },

    {
      system: "BCW PP-A",
      unit1: "BCW_PP_A_U1",
      unit2: "BCW_PP_A_U2",
      unit3: "BCW_PP_A_U3",
      unit4: "BCW_PP_A_U4",
      stage1Design: "354",
      stage2Design: "354",
    },

    {
      system: "BCW PP-B",
      unit1: "BCW_PP_B_U1",
      unit2: "BCW_PP_B_U2",
      unit3: "BCW_PP_B_U3",
      unit4: "BCW_PP_B_U4",
      stage1Design: "354",
      stage2Design: "354",
    },

    {
      system: "BCW PP-C",
      unit1: "BCW_PP_C_U1",
      unit2: "BCW_PP_C_U2",
      unit3: "BCW_PP_C_U3",
      unit4: "BCW_PP_C_U4",
      stage1Design: "354",
      stage2Design: "354",
    },

    {
      system: "DMCW ECW-A",
      unit1: "DMCW_ECW_A_U1",
      unit2: "DMCW_ECW_A_U2",
      unit3: "DMCW_ECW_A_U3",
      unit4: "DMCW_ECW_A_U4",
      stage1Design: "355",
      stage2Design: "180/417",
    },

    {
      system: "DMCW ECW-B",
      unit1: "DMCW_ECW_B_U1",
      unit2: "DMCW_ECW_B_U2",
      unit3: "DMCW_ECW_B_U2",
      unit4: "DMCW_ECW_B_U4",
      stage1Design: "355",
      stage2Design: "180/417",
    },

    {
      system: "DMCW ECW-C",
      unit1: "DMCW_ECW_C_U1",
      unit2: "DMCW_ECW_C_U2",
      unit3: "DMCW_ECW_C_U3",
      unit4: "DMCW_ECW_C_U4",
      stage1Design: "355",
      stage2Design: "180",
    },

    {
      system: "ARCW PP-A",
      unit1: "ARCW_PP_A_U1",
      unit2: "ARCW_PP_A_U2",
      unit3: "ARCW_PP_A_U3",
      unit4: "ARCW_PP_A_U4",
      stage1Design: "110",
      stage2Design: "160",
    },

    {
      system: "ARCW PP-B",
      unit1: "ARCW_PP_B_U1",
      unit2: "ARCW_PP_B_U2",
      unit3: "ARCW_PP_B_U3",
      unit4: "ARCW_PP_B_U4",
      stage1Design: "110",
      stage2Design: "160",
    },

    {
      system: "ARCW PP-C",
      unit1: "ARCW_PP_C_U1",
      unit2: "ARCW_PP_C_U2",
      unit3: "ARCW_PP_C_U3",
      unit4: "ARCW_PP_C_U4",
      stage1Design: "110",
      stage2Design: "160",
    },

  ];

  const stagewiseSystems_CW = [

    {
      system: "CW PP-1",
      unit1: "St_I_CW_PP_1_U1",
      unit2: "St_I_CW_PP_1_U2",
      unit3: "St_II_CW_PP_1_U3",
      unit4: "St_II_CW_PP_1_U4",
      stage1Design: "3170",
      stage2Design: "3350",
    },

    {
      system: "CW PP-2",
      unit1: "St_I_CW_PP_2_U1",
      unit2: "St_I_CW_PP_2_U2",
      unit3: "St_II_CW_PP_2_U3",
      unit4: "St_II_CW_PP_2_U4",
      stage1Design: "3170",
      stage2Design: "3350",
    },

    {
      system: "CW PP-3",
      unit1: "St_I_CW_PP_3_U1",
      unit2: "St_I_CW_PP_3_U2",
      unit3: "St_II_CW_PP_3_U3",
      unit4: "St_II_CW_PP_3_U4",
      stage1Design: "3170",
      stage2Design: "3350",
    },

    {
      system: "CW PP-4",
      unit1: "St_I_CW_PP_4_U1",
      unit2: "St_I_CW_PP_4_U2",
      unit3: "St_II_CW_PP_4_U3",
      unit4: "St_II_CW_PP_4_U4",
      stage1Design: "3170",
      stage2Design: "3350",
    },

    {
      system: "CW PP-5",
      unit1: "St_I_CW_PP_5_U1",
      unit2: "St_I_CW_PP_5_U2",
      unit3: "St_II_CW_PP_5_U3",
      unit4: "St_II_CW_PP_5_U4",
      stage1Design: "3170",
      stage2Design: "3350",
    },
  ];

  const stagewiseSystems_Compressor = [
    {
      system: "IAC-1",
      stage1: "Compressors_Instrument_air_compressor_1_S1",
      stage2: "Compressors_Instrument_air_compressor_1_S2",
      stage1Design: "270",
      stage2Design: "315",
    },

    {
      system: "IAC-2",
      stage1: "Compressors_Instrument_air_compressor_2_S1",
      stage2: "Compressors_Instrument_air_compressor_2_S2",
      stage1Design: "270",
      stage2Design: "315",
    },

    {
      system: "IAC-3",
      stage1: "Compressors_Instrument_air_compressor_3_S1",
      stage2: "Compressors_Instrument_air_compressor_3_S2",
      stage1Design: "270",
      stage2Design: "315",
    },

    {
      system: "PAC-1",
      stage1: "Compressors_Plant_air_compressor_1_S1",
      stage2: "Compressors_Plant_air_compressor_1_S2",
      stage1Design: "270",
      stage2Design: "315",
    },

    {
      system: "PAC-2",
      stage1: "Compressors_Plant_air_compressor_2_S1",
      stage2: "Compressors_Plant_air_compressor_2_S2",
      stage1Design: "270",
      stage2Design: "315",
    },

  ];

  const { selectedTags, clearTags } = useTrend();

  const calculateRatio = (tag1, tag2) => {

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

    return (value1 / value2).toFixed(2);
  };

  return (
    <div className="dashboard">

      <div className="main-top">

        {/* RIGHT LIVE TABLE */}
        <div className="live-table-wrapper">

          <div className="table-heading">
            UNIT WISE
          </div>

          <div className="unit-table-header">
            <div>SYSTEM</div>
            <div>UNITS</div>
            <div>STAGE-I (Design)</div>
            <div>UNIT-1</div>
            <div>UNIT-2</div>
            <div>STAGE-II (Design)</div>
            <div>UNIT-3</div>
            <div>UNIT-4</div>

          </div>
          <div className="live-table">

            {Load.map((item, index) => {

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

                return (Number(tag1.toFixed(1)) / (tag2.toFixed(1))).toFixed(2);
              };

              return (

                <div
                  className="live-row"
                  key={index}
                >

                  {/* SYSTEM */}
                  <div className="live-name">
                    {item.system}
                  </div>
                  <div className="trend-cell">
                    {item.type === "ratio"
                      ? "kg/kW"
                      : item.type === "single"
                        ? "MW"
                        : item.type === "dash"
                          ? "-"
                          : item.type === "flow"
                            ? "TPH"
                            : "KW"
                    }
                  </div>
                  {/* UNITS */}
                  {/* STAGE 1 DESIGN */}
                  <div className="trend-cell">
                    {item.stage1Design}
                  </div>

                  {/* UNIT 1 */}
                  <SelectableTrendCell
                    value={formatValue(apiData[item.unit1])}
                    tag={item.unit1}
                    label={`${item.system} Unit-1`}
                  />

                  {/* UNIT-2 */}
                  <SelectableTrendCell
                    value={formatValue(apiData[item.unit2])}
                    tag={item.unit2}
                    label={`${item.system} Unit-2`}
                  />
                  {/* STAGE-1 
                  <div className="trend-cell">
                    {formatValue(stage1)}
                  </div>*/}


                  {/* STAGE 2 DESIGN */}
                  <div className="trend-cell">
                    {item.stage2Design}
                  </div>

                  {/* UNIT 3 */}
                  <SelectableTrendCell
                    value={formatValue(apiData[item.unit3])}
                    tag={item.unit3}
                    label={`${item.system} Unit-3`}
                  />

                  {/* UNIT-4 */}
                  <SelectableTrendCell
                    value={formatValue(apiData[item.unit4])}
                    tag={item.unit4}
                    label={`${item.system} Unit-4`}
                  />
                  {/* <div className="trend-cell">
                    {formatValue(stage2)}
                  </div> */}



                </div>
              );
            })}
            <div className="industrial-body">

              {CoalFlow.map((item, index) => {

                const stage1Value =
                  Number(apiData[item.unit1] || 0) +
                  Number(apiData[item.unit2] || 0);

                const stage2Value =
                  Number(apiData[item.unit3] || 0) +
                  Number(apiData[item.unit4] || 0);

                const formatValue = (value, tag = "") => {

                  if (
                    value === undefined ||
                    value === null
                  ) {
                    console.log("Missing Tag:", tag);
                    return "NA";
                  }

                  return Number(value).toFixed(0);
                };

                return (

                  <div
                    className="live-row"
                    key={index}
                  >

                    {/* SYSTEM */}
                    <div className="live-name">
                      {item.system}
                    </div>
                    <div className="trend-cell">
                      {item.type === "ratio"
                        ? "kg/kW"
                        : item.type === "single"
                          ? "MW"
                          : item.type === "flow"
                            ? "TPH"
                            : "KW"
                      }
                    </div>
                    {/* STAGE 1 DESIGN */}
                    <div className="trend-cell">
                      {item.stage1Design}
                    </div>
                    {/* UNIT 1 */}
                    <SelectableTrendCell
                      value={formatValue(apiData[item.unit1])}
                      tag={item.unit1}
                      label={`${item.system} Unit-1`}
                    />

                    {/* UNIT-2 */}
                    <SelectableTrendCell
                      value={formatValue(apiData[item.unit2])}
                      tag={item.unit2}
                      label={`${item.system} Unit-2`}
                    />
                    {/* STAGE-1 */}
                    {/*  <div className="trend-cell">
                    {formatValue(stage1Value)}
                    </div> */}

                    {/* STAGE 2 DESIGN */}
                    <div className="trend-cell">
                      {item.stage2Design}
                    </div>
                    {/* UNIT 3 */}
                    <SelectableTrendCell
                      value={formatValue(apiData[item.unit3])}
                      tag={item.unit3}
                      label={`${item.system} Unit-3`}
                    />

                    {/* UNIT-4 */}
                    <SelectableTrendCell
                      value={formatValue(apiData[item.unit4])}
                      tag={item.unit4}
                      label={`${item.system} Unit-4`}
                    />
                    {/*  <div className="trend-cell">
                      {formatValue(stage2Value)}
                    </div> */}


                  </div>
                );
              })}

            </div>
            <div className="industrial-body">

              {DSspecificCoal.map((item, index) => {
                const calculateStageRatio = (
                  tag1a,
                  tag2a,
                  tag1b,
                  tag2b
                ) => {

                  const numerator =
                    Number(apiData[tag1a] || 0) +
                    Number(apiData[tag1b] || 0);

                  const denominator =
                    Number(apiData[tag2a] || 0) +
                    Number(apiData[tag2b] || 0);

                  if (denominator === 0) {
                    return "NA";
                  }

                  return (numerator / denominator).toFixed(2);
                };
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
                    className="live-row"
                    key={index}
                  >

                    {/* SYSTEM */}
                    <div className="live-name">
                      {item.system}
                    </div>

                    <div className="trend-cell">
                      {item.type === "ratio"
                        ? "kg/kW"
                        : item.type === "single"
                          ? "MW"
                          : item.type === "dash"
                            ? "-"
                            : item.type === "flow"
                              ? "TPH"
                              : "KW"
                      }
                    </div>
                    {/* STAGE-1 DESIGN */}
                    <div className="trend-cell">
                      {item.stage1Design}
                    </div>
                    {/* UNIT-1 */}
                    <div className="trend-cell">
                      {item.type === "ratio"
                        ? calculateRatio(
                          item.unit1Tag1,
                          item.unit1Tag2
                        )
                        : formatValue(
                          apiData[item.unit1],
                          item.unit1
                        )}
                    </div>

                    {/* UNIT-2 */}
                    <div className="trend-cell">
                      {item.type === "ratio"
                        ? calculateRatio(
                          item.unit2Tag1,
                          item.unit2Tag2
                        )
                        : formatValue(
                          apiData[item.unit2],
                          item.unit2
                        )}
                    </div>
                    {/* STAGE-1 */}
                    {/* <div className="trend-cell">
                      {calculateStageRatio(
                        item.unit1Tag1,
                        item.unit1Tag2,
                        item.unit2Tag1,
                        item.unit2Tag2
                      )}
                    </div> */}


                    {/* STAGE-2 DESIGN */}
                    <div className="trend-cell">
                      {item.stage2Design}
                    </div>

                    {/* UNIT-3 */}
                    <div className="trend-cell">
                      {item.type === "ratio"
                        ? calculateRatio(
                          item.unit3Tag1,
                          item.unit3Tag2
                        )
                        : formatValue(
                          apiData[item.unit3],
                          item.unit3
                        )}
                    </div>

                    {/* UNIT-4 */}
                    <div className="trend-cell">
                      {item.type === "ratio"
                        ? calculateRatio(
                          item.unit4Tag1,
                          item.unit4Tag2
                        )
                        : formatValue(
                          apiData[item.unit4],
                          item.unit4
                        )}
                    </div>
                    {/* <div className="trend-cell">
                    {calculateStageRatio(
                      item.unit3Tag1,
                      item.unit3Tag2,
                      item.unit4Tag1,
                      item.unit4Tag2
                    )}
                  </div> */}


                  </div>
                );
              })}

            </div>
            {TotalAirFlow.map((item, index) => {

              let unit1Value = Number(apiData[item.unit1] || 0);
              let unit2Value = Number(apiData[item.unit2] || 0);
              let unit3Value = Number(apiData[item.unit3] || 0);
              let unit4Value = Number(apiData[item.unit4] || 0);

              // =====================================
              // EXCESS AIR CALCULATION
              // =====================================
              if (item.system === "Excess Air") {

                const avgU1 =
                  (
                    Number(apiData.Excess_Air_U1_L1 || 0) +
                    Number(apiData.Excess_Air_U1_L2 || 0) +
                    Number(apiData.Excess_Air_U1_R1 || 0) +
                    Number(apiData.Excess_Air_U1_R2 || 0)
                  ) / 4;

                const avgU2 =
                  (
                    Number(apiData.Excess_Air_U2_L1 || 0) +
                    Number(apiData.Excess_Air_U2_L2 || 0) +
                    Number(apiData.Excess_Air_U2_R1 || 0) +
                    Number(apiData.Excess_Air_U2_R2 || 0)
                  ) / 4;

                const avgU3 =
                  (
                    Number(apiData.Excess_Air_U3_L1 || 0) +
                    Number(apiData.Excess_Air_U3_L2 || 0) +
                    Number(apiData.Excess_Air_U3_R1 || 0) +
                    Number(apiData.Excess_Air_U3_R2 || 0)
                  ) / 4;

                const avgU4 =
                  (
                    Number(apiData.Excess_Air_U4_L1 || 0) +
                    Number(apiData.Excess_Air_U4_L2 || 0) +
                    Number(apiData.Excess_Air_U4_R1 || 0) +
                    Number(apiData.Excess_Air_U4_R2 || 0)
                  ) / 4;

                unit1Value = (avgU1 * 100) / (21 - avgU1);
                unit2Value = (avgU2 * 100) / (21 - avgU2);
                unit3Value = (avgU3 * 100) / (21 - avgU3);
                unit4Value = (avgU4 * 100) / (21 - avgU4);
              }

              // =====================================
              // STAGE CALCULATIONS
              // =====================================
              const stage1 = unit1Value + unit2Value;
              const stage2 = unit3Value + unit4Value;

              return (
                <div className="live-row" key={index}>

                  <div className="live-name">
                    {item.system}
                  </div>
                  <div className="trend-cell">
                    {item.type === "ratio"
                      ? "kg/kW"
                      : item.type === "single"
                        ? "MW"
                        : item.type === "flow"
                          ? "TPH"
                          : "KW"
                    }
                  </div>
                  <div className="trend-cell">
                    {item.stage1Design}
                  </div>
                  <SelectableTrendCell
                    value={formatValue(unit1Value)}
                    tag={item.unit1}
                    label={`${item.system} Unit-1`}
                  />

                  <SelectableTrendCell
                    value={formatValue(unit2Value)}
                    tag={item.unit2}
                    label={`${item.system} Unit-2`}
                  />

                  {/* <div className="trend-cell">
        {formatValue(stage1)}
      </div> */}
                  <div className="trend-cell">
                    {item.stage2Design}
                  </div>


                  <SelectableTrendCell
                    value={formatValue(unit3Value)}
                    tag={item.unit3}
                    label={`${item.system} Unit-3`}
                  />

                  <SelectableTrendCell
                    value={formatValue(unit4Value)}
                    tag={item.unit4}
                    label={`${item.system} Unit-4`}
                  />

                  {/*   <div className="trend-cell">
                    {formatValue(stage2)}
                  </div> */}



                </div>
              );
            })}


            {liveTableData.map((item, index) => {

              let unit1Value = Number(apiData[item.unit1] || 0);
              let unit2Value = Number(apiData[item.unit2] || 0);
              let unit3Value = Number(apiData[item.unit3] || 0);
              let unit4Value = Number(apiData[item.unit4] || 0);

              // =====================================
              // EXCESS AIR CALCULATION
              // =====================================
              if (item.system === "Excess Air") {

                const avgU1 =
                  (
                    Number(apiData.Excess_Air_U1_L1 || 0) +
                    Number(apiData.Excess_Air_U1_L2 || 0) +
                    Number(apiData.Excess_Air_U1_R1 || 0) +
                    Number(apiData.Excess_Air_U1_R2 || 0)
                  ) / 4;

                const avgU2 =
                  (
                    Number(apiData.Excess_Air_U2_L1 || 0) +
                    Number(apiData.Excess_Air_U2_L2 || 0) +
                    Number(apiData.Excess_Air_U2_R1 || 0) +
                    Number(apiData.Excess_Air_U2_R2 || 0)
                  ) / 4;

                const avgU3 =
                  (
                    Number(apiData.Excess_Air_U3_L1 || 0) +
                    Number(apiData.Excess_Air_U3_L2 || 0) +
                    Number(apiData.Excess_Air_U3_R1 || 0) +
                    Number(apiData.Excess_Air_U3_R2 || 0)
                  ) / 4;

                const avgU4 =
                  (
                    Number(apiData.Excess_Air_U4_L1 || 0) +
                    Number(apiData.Excess_Air_U4_L2 || 0) +
                    Number(apiData.Excess_Air_U4_R1 || 0) +
                    Number(apiData.Excess_Air_U4_R2 || 0)
                  ) / 4;

                unit1Value = (avgU1 * 100) / (21 - avgU1);
                unit2Value = (avgU2 * 100) / (21 - avgU2);
                unit3Value = (avgU3 * 100) / (21 - avgU3);
                unit4Value = (avgU4 * 100) / (21 - avgU4);
              }

              // =====================================
              // STAGE CALCULATIONS
              // =====================================
              const stage1 = unit1Value + unit2Value;
              const stage2 = unit3Value + unit4Value;

              return (
                <div className="live-row" key={index}>

                  <div className="live-name">
                    {item.system}
                  </div>
                  <div className="trend-cell">
                    {item.type === "ratio"
                      ? "kg/kW"
                      : item.type === "single"
                        ? "MW"
                        : item.type === "flow"
                          ? "TPH"
                          : "KW"
                    }
                  </div>
                  <div className="trend-cell">
                    {item.stage1Design}
                  </div>
                  <SelectableTrendCell
                    value={formatValue(unit1Value)}
                    tag={item.unit1}
                    label={`${item.system} Unit-1`}
                  />

                  <SelectableTrendCell
                    value={formatValue(unit2Value)}
                    tag={item.unit2}
                    label={`${item.system} Unit-2`}
                  />
                  {/*  <div className="trend-cell">
                    {formatValue(stage1)}
                  </div> */}

                  <div className="trend-cell">
                    {item.stage2Design}
                  </div>
                  <SelectableTrendCell
                    value={formatValue(unit3Value)}
                    tag={item.unit3}
                    label={`${item.system} Unit-3`}
                  />

                  <SelectableTrendCell
                    value={formatValue(unit4Value)}
                    tag={item.unit4}
                    label={`${item.system} Unit-4`}
                  />

                  {/*  <div className="trend-cell">
                    {formatValue(stage2)}
                  </div> */}
                </div>
              );
            })}

          </div>
        </div>

      </div>

      {/* BOTTOM DASHBOARD */}
      <div className="bottom-dashboard">
        {/* STAGE TABLE */}
        <div className="stage-table">
          <div className="table-heading">
            STAGE WISE
          </div>
          {/* HEADER */}
          <div className="unit-table-header">
            <div>STAGE WISE</div>
            <div>UNITS</div>
            <div>STAGE-I</div>
            <div>STG-I Design</div>
            <div>STAGE-II</div>
            <div>STG-II Design</div>
          </div>

          {/* ROWS */}
          {stagewiseSystems_CW.map((item, index) => {

            const value1 = parseFloat(apiData[item.unit1]) || 0;
            const value2 = parseFloat(apiData[item.unit2]) || 0;
            const value3 = parseFloat(apiData[item.unit3]) || 0;
            const value4 = parseFloat(apiData[item.unit4]) || 0;

            const stage1 = value1 + value2;
            const stage2 = value3 + value4;

            return (

              <div className="stagewise-row" key={index}>

                {/* SYSTEM */}
                <div className="live-name">
                  {item.system}
                </div>
                <div className="trend-cell">
                  {item.type === "ratio"
                    ? "kg/kW"
                    : item.type === "single"
                      ? "MW"
                      : item.type === "flow"
                        ? "TPH"
                        : "KW"
                  }
                </div>
                {/* STAGE-1 */}
                <div className="trend-cell">
                  {formatValue(stage1)}
                </div>

                {/* STAGE-1 DESIGN */}
                <div className="trend-cell">
                  {item.stage1Design}
                </div>



                {/* STAGE-2 */}
                <div className="trend-cell">
                  {formatValue(stage2)}
                </div>

                {/* STAGE-2 DESIGN */}
                <div className="trend-cell">
                  {item.stage2Design}
                </div>

              </div>
            );
          })}
          {stagewiseSystems_Compressor.map((item, index) => {

            const stage1 = parseFloat(apiData[item.stage1]) || 0;
            const stage2 = parseFloat(apiData[item.stage2]) || 0;

            return (

              <div className="stagewise-row" key={index}>

                {/* SYSTEM */}
                <div className="live-name">
                  {item.system}
                </div>
                <div className="trend-cell">
                {item.type === "ratio"
                  ? "kg/kW"
                  : item.type === "single"
                  ? "MW"
                  : item.type === "dash"
                  ? "-"
                  : item.type === "flow"
                  ? "TPH"
                  : "KW"
                }
              </div>
                {/* STAGE-1 */}
                <div className="trend-cell">
                  {formatValue(stage1)}
                </div>

                {/* STAGE-1 DESIGN */}
                <div className="trend-cell">
                  {item.stage1Design}
                </div>



                {/* STAGE-2 */}
                <div className="trend-cell">
                  {formatValue(stage2)}
                </div>

                {/* STAGE-2 DESIGN */}
                <div className="trend-cell">
                  {item.stage2Design}
                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}