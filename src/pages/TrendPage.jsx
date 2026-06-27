import React, {
  useEffect,
  useState
} from "react";

import {
  useLocation
} from "react-router-dom";

import {
  getTrendData
} from "../api/piApi";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const TrendPage = () => {

  // =====================================================
  // LOCATION STATE
  // =====================================================

  const location = useLocation();

  const selectedTags =
    location.state?.selectedTags || [];

  const tags =
    selectedTags.map(item => item.tag);

  const tagLabels = selectedTags.reduce(
    (acc, item) => {
      acc[item.tag] = item.label;
      return acc;
    },
    {}
  );

  // =====================================================
  // STATE
  // =====================================================

  const [chartData, setChartData] =
    useState([]);

  const [avgData, setAvgData] = useState({});

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // COLORS
  // =====================================================

  const colors = [
    "#f70776", // Purple
    "#00bbf0", // Pink
    "#ff6f3c", // Orange
    "#d59bf6", // Violet
    "#cbf078", // Hot Pink 
    "#5be7a9", // Purple Blue 
    "#feffdf"  
  ];
  // =====================================================
  // FETCH TREND DATA
  // =====================================================

  const fetchTrend = async (mode = "range") => {

    if (tags.length === 0)
      return;

    setLoading(true);

    try {

      // =========================================
      // FETCH ALL TAGS
      // =========================================

      const responses = await Promise.all(
        tags.map(tag => {

          // Custom Range
          if (
            mode === "custom" &&
            startDate &&
            endDate
          ) {
            return getTrendData(
              tag,
              startDate,
              endDate
            );
          }

          // Dropdown Range
          const end = new Date();
          const start = new Date();

          switch (range) {
            case "h1":
              start.setHours(end.getHours() - 1);
              break;

            case "h6":
              start.setHours(end.getHours() - 6);
              break;

            case "h12":
              start.setHours(end.getHours() - 12);
              break;

            case "d1":
              start.setDate(end.getDate() - 1);
              break;

            case "d7":
              start.setDate(end.getDate() - 7);
              break;

            case "d30":
              start.setDate(end.getDate() - 30);
              break;

            default:
              start.setHours(end.getHours() - 1);
          }

          return getTrendData(
            tag,
            start.toISOString(),
            end.toISOString()
          );

        })
      );
      console.log(
        "FIRST TAG SAMPLE",
        JSON.stringify(responses[0][0], null, 2)
      );
      console.log("RESPONSES", responses);

      const averages = {};

      responses.forEach((response, index) => {

        const tag = tags[index];

        const trendArray = Array.isArray(response)
          ? response
          : [];

        if (trendArray.length === 0) {
          averages[tag] = 0;
          return;
        }

        const sum = trendArray.reduce(
          (acc, item) =>
            acc + Number(item.Value || 0),
          0
        );

        averages[tag] = Number(
          (sum / trendArray.length).toFixed(2)
        );

      });

      setAvgData(averages);
      // =========================================
      // FIND MAX DATA LENGTH
      // =========================================

      const maxLength = Math.max(
        ...responses.map(r =>
          Array.isArray(r)
            ? r.length
            : 0
        )
      );

      const merged = {};

      for (let i = 0; i < maxLength; i++) {

        merged[i] = {};

        responses.forEach((response, index) => {

          const tag = tags[index];

          const trendArray =
            Array.isArray(response)
              ? response
              : [];

          if (!trendArray[i]) return;

          if (index === 0) {
            merged[i].time =
              trendArray[i].Time;
          }

          const currentValue =
            Number(
              trendArray[i].Value || 0
            );

          merged[i][tag] =
            Number(
              currentValue.toFixed(2)
            );
        });
      }

      const finalData =
        Object.values(merged);

      console.log(
        "FINAL DATA",
        finalData.slice(0, 5)
      );

      setChartData(finalData);

    }
    catch (error) {

      console.log(
        "Trend API Error:",
        error
      );

      setChartData([]);

    }
    finally {

      setLoading(false);

    }

  };
  const [range, setRange] = useState("h1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  const isCustomRange = isCustomMode;
  // =====================================================
  // USE EFFECT
  // =====================================================


  useEffect(() => {

    fetchTrend("range");

  }, [range]);

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="trend-page">

      {/* HEADER */}
      <div className="trend-header">
        {/* RANGE */}
        <div className="datetime-filter">
          <div className="range-dropdown">

            <select
              value={range}
              onChange={(e) => {

                setRange(e.target.value);

                setIsCustomMode(false);

                setStartDate("");
                setEndDate("");

              }}
              className="modern-select"
            >
              <option value="m1">1 Minute</option>
              <option value="m5">5 Minutes</option>
              <option value="m15">15 Minutes</option>
              <option value="h1">1 Hour</option>
              <option value="h6">6 Hours</option>
              <option value="h12">12 Hours</option>
              <option value="h24">24 Hours</option>
              <option value="d7">7 Days</option>
              <option value="d30">30 Days</option>
              <option value="d365">1 Year</option>
            </select>
          </div>
          <div className="modern-datetime">
            <span className="date-icon">📅</span>

            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setIsCustomMode(true);
              }}
              title="Start Date & Time"
            />
          </div>

          <div className="modern-datetime">
            <span className="date-icon">📅</span>

            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setIsCustomMode(true);
              }}
              title="End Date & Time"
            />
          </div>

          <button
            className="search-btn"
            onClick={() => {
              if (!startDate || !endDate) {
                alert("Please select Start Date and End Date");
                return;
              }

              if (new Date(startDate) >= new Date(endDate)) {
                alert("Start Date must be less than End Date");
                return;
              }

              fetchTrend("custom");
            }}
          >
            Search
          </button>
        </div>
        <div className="stats-grid">
          {Object.entries(avgData).map(([tag, avg], index) => (
            <div
              className="stat-card"
              key={tag}
              style={{
                "--card-color": colors[index % colors.length]
              }}
            >
              <h4>{tagLabels[tag] || tag}</h4>

              <div className="stat-value">
                {avg}
              </div>

              <span>Average Value</span>
            </div>
          ))}
        </div>
      </div>



      {/* LOADING */}
      {
        loading && (
          <h3>
            Loading Trend...
          </h3>
        )
      }

      {/* CHART */}
      <div className="chart-card">

        <ResponsiveContainer
          width="99%"
          height={550}
        >

          <LineChart
            data={chartData}
          >

            <CartesianGrid
              stroke="#2f3b52"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
              stroke="#9ca3af"
              tick={{ fontSize: 10 }}
              tick={{ fill: "#9ca3af" }}
              minTickGap={60}
              tickFormatter={(value) => {

                const date = new Date(value);

                if (isNaN(date.getTime()))
                  return "";

                return (
                  date.toLocaleDateString("en-GB") +
                  " " +
                  date.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  })
                );

              }}
            />

            <YAxis
              tick={{ fontSize: 10 }}
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af" }}
              domain={[
                dataMin => dataMin * 0.98,
                dataMax => dataMax * 1.02
              ]}
            />

            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
                borderRadius: "10px",
                color: "#fff"
              }}
              formatter={(value, name) => [
                Number(value).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }
                ),
                tagLabels[name] || name
              ]}
            />

            <Legend
              wrapperStyle={{
                color: "#fff"
              }}
              formatter={(value) =>
                tagLabels[value] || value
              }
            />

            {
              tags.map(
                (tag, index) => (

                  <Line
                    key={tag}
                    name={tagLabels[tag] || tag}
                    type="monotone"
                    dataKey={tag}
                    strokeWidth={3}
                    stroke={
                      colors[
                      index %
                      colors.length
                      ]
                    }

                    dot={false}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}

                    isAnimationActive={false}

                    connectNulls={true}
                  />

                ))
            }

          </LineChart>


        </ResponsiveContainer>

      </div>
    </div>
  );
};

export default TrendPage;