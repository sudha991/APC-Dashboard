import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "../App.css";
import "../index.css"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";


const units = [
  {
    id: "Unit1",
    file: "/unit1.xlsx",
  },
  {
    id: "Unit2",
    file: "/unit2.xlsx",
  },
  {
    id: "Unit3",
    file: "/unit3.xlsx",
  },
  {
    id: "Unit4",
    file: "/unit4.xlsx",
  },
];

const TestTrend = () => {
  const [selectedUnit, setSelectedUnit] =
    useState("Unit1");

  const [chartData, setChartData] =
    useState([]);

  const [allData, setAllData] =
    useState([]);

  const [availableDates, setAvailableDates] =
    useState([]);

  const [avgPLF, setAvgPLF] =
    useState("0");

  const [avgAPC, setAvgAPC] =
    useState("0");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  useEffect(() => {
    const unitObj = units.find(
      (u) => u.id === selectedUnit
    );

    if (unitObj) {
      loadExcel(unitObj.file);
    }
  }, [selectedUnit]);

  const calculateAverages = (
    filteredData
  ) => {
    const plfValues = filteredData
      .map((x) => x.PLF)
      .filter(
        (x) =>
          x !== null &&
          !isNaN(x)
      );

    const apcValues = filteredData
      .map((x) => x.APC)
      .filter(
        (x) =>
          x !== null &&
          !isNaN(x)
      );

    const plfAvg =
      plfValues.length > 0
        ? plfValues.reduce(
            (a, b) => a + b,
            0
          ) / plfValues.length
        : 0;

    const apcAvg =
      apcValues.length > 0
        ? apcValues.reduce(
            (a, b) => a + b,
            0
          ) / apcValues.length
        : 0;

    setAvgPLF(
      plfAvg.toFixed(2)
    );

    setAvgAPC(
      apcAvg.toFixed(2)
    );
  };

  const loadExcel = async (
    fileName
  ) => {
    console.log("Loading file:", fileName);

    try {
      const response =
        await fetch(fileName);
          console.log("Status:", response.status);
          console.log(
            "Content-Type:",
            response.headers.get("content-type")
          );
      const arrayBuffer =
        await response.arrayBuffer();

      const workbook = XLSX.read(
        arrayBuffer,
        {
          type: "array",
        }
      );

      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const rows =
        XLSX.utils.sheet_to_json(
          sheet,
          {
            header: 1,
            defval: "",
          }
        );

      const dateRow = rows.find(
        (r) =>
          r[0] === "Report Dates"
      );

      const plfRow = rows.find(
        (r) =>
          String(
            r[0]
          ).includes(
            "PLF Day"
          )
      );

      const apcRow = rows.find(
        (r) =>
          String(
            r[0]
          ).includes(
            "APC Day"
          )
      );

      if (
        !dateRow ||
        !plfRow ||
        !apcRow
      ) {
        alert(
          "Required rows not found"
        );
        return;
      }

      const dates =
        dateRow.slice(1).map(
          (d) => {
            if (
              typeof d ===
              "number"
            ) {
              const excelDate =
                XLSX.SSF.parse_date_code(
                  d
                );

              return `${String(
                excelDate.d
              ).padStart(
                2,
                "0"
              )}-${String(
                excelDate.m
              ).padStart(
                2,
                "0"
              )}-${excelDate.y}`;
            }

            return d;
          }
        );

      const data =
        dates.map(
          (
            date,
            index
          ) => ({
            date,
            PLF:
              Number(
                plfRow[
                  index + 1
                ]
              ) || null,
            APC:
              Number(
                apcRow[
                  index + 1
                ]
              ) || null,
          })
        );

      setAllData(data);
      setChartData(data);
      setAvailableDates(dates);

      if (
        dates.length > 0
      ) {
        setStartDate(
          dates[0]
        );

        setEndDate(
          dates[
            dates.length -
              1
          ]
        );
      }

      calculateAverages(
        data
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch =
    () => {
      const startIndex =
        availableDates.indexOf(
          startDate
        );

      const endIndex =
        availableDates.indexOf(
          endDate
        );

      if (
        startIndex === -1 ||
        endIndex === -1
      )
        return;

      const filtered =
        allData.slice(
          Math.min(
            startIndex,
            endIndex
          ),
          Math.max(
            startIndex,
            endIndex
          ) + 1
        );

      setChartData(
        filtered
      );

      calculateAverages(
        filtered
      );
    };
useEffect(() => {
  console.log("Selected Unit =", selectedUnit);

  const unitObj = units.find(
    (u) => u.id === selectedUnit
  );

  if (unitObj) {
    loadExcel(unitObj.file);
  }
}, [selectedUnit]);

  return (
    <div className="trend-page">
      <div className="trend-header">
      <div className="datetime-filter">
      <h2 className="trend-title">
        PLF & APC Trend Analysis
      </h2>
    </div>
    <div className="trend-toolbar">

        {/* Left Side */}
        <div className="datetime-filter">

          <div >
            <label>Start Date</label>

            <select className="modern-select"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
            >
              {availableDates.map((date) => (
                <option
                  key={date}
                  value={date}
                >
                  {date}
                </option>
              ))}
            </select>
          </div>

          <div >
            <label>End Date</label>

            <select className="modern-select"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
            >
              {availableDates.map((date) => (
                <option
                  key={date}
                  value={date}
                >
                  {date}
                </option>
              ))}
            </select>
          </div>

          <button
            className="search-btn"
            onClick={handleSearch}
          >
            Search
          </button>

        </div>

        {/* Right Side */}
        <div className="unit-tabs">
          {units.map((unit) => (
            <button
              className={`unit-card ${
                selectedUnit === unit.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedUnit(unit.id)
              }
            >

              <span className="unit-name">
                {unit.id}
              </span>
            </button>
          ))}
        </div>

      </div>
      <div className="kpi-container">
        <div className="kpi-card plf-card">
          <div className="kpi-title">
            Average PLF
          </div>

          <div className="kpi-value">
            {avgPLF}%
          </div>
        </div>

        <div className="kpi-card apc-card">
          <div className="kpi-title">
            Average APC
          </div>

          <div className="kpi-value">
            {avgAPC}%
          </div>
        </div>
      </div>
      </div>

     

      <div className="chart-card">
        <ResponsiveContainer
          width="100%"
          height={600}
        >
          <LineChart
            data={
              chartData
            }
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={90}
              interval={15}
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="PLF"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="APC"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TestTrend;