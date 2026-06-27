import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart,Pie,Cell,Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { getPowerData } from "../api/piApi";
import { draftSystems, DSspecificCoal, DSLoad } from "../data/draftSystems";
import { millSystems } from "../data/millSystems";
import { cwPumpsSystem } from "../data/cwPumpsSystem";
import { ccPumpsSystem } from "../data/ccPumpsSystem";
import { cepSystem } from "../data/cepSystem";
import { comprSystem } from "../data/comprSystem";

import {
  getDraftSystemTotalPower,
  getMillingSystemTotalPower,
  getCWPumpsTotalPower,
  getCCPumpsTotalPower,
  getBFPTotalPower,
  getCEPTotalPower,
  getCompressorTotalPower
} from "../utils/powerCalculations";

import "../index.css";


export default function PowerDistribution() {
  console.log("PowerDistribution Loaded");
  const [apiData, setApiData] = useState({});

  useEffect(() => {

    // Initial Load
    fetchData();

    // Auto Refresh Every 10 Seconds
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    // Cleanup
    return () => clearInterval(interval);

  }, []);

  const navigate = useNavigate();
  const pageRoutes = {
    "Draft System": "/draftsystem",
    "Milling System": "/millingsystem",
    "CW Pumps": "/cwpumps",
    "CC Pumps": "/ccpumps",
    "CEP": "/cep",
    "Compressor": "/Compressors",
    "BFP": "/bfp"
  };
  const fetchData = async () => {
    console.log("Fetching PI Data...");

    try {
      const response = await getPowerData();

      console.log("Received Data");

      setApiData(response.data.value);

    } catch (error) {
      console.error(error);
    }
  };

  const draftPower =
    getDraftSystemTotalPower(
      apiData,
      draftSystems
    );

  const millingPower =
    getMillingSystemTotalPower(
      apiData,
      millSystems
    );

  const cwPower =
    getCWPumpsTotalPower(
      apiData,
      cwPumpsSystem
    );

  const ccPower =
    getCCPumpsTotalPower(
      apiData,
      ccPumpsSystem
    );



  const cepPower =
    getCEPTotalPower(
      apiData,
      cepSystem
    );

  const compressorPower =
    getCompressorTotalPower(
      apiData,
      comprSystem
    );

  const pieData = [
    {
      name: "Draft System",
      value: draftPower
    },
    {
      name: "Milling System",
      value: millingPower
    },
    {
      name: "CW Pumps",
      value: cwPower
    },
    {
      name: "CC Pumps",
      value: ccPower
    },


    {
      name: "CEP",
      value: cepPower
    },
    {
      name: "Compressor",
      value: compressorPower
    }
  ];

  const COLORS = [
    "#f70776", // Purple
    "#00bbf0", // Pink
    "#ff6f3c", // Orange
    "#d59bf6", // Violet
    "#cbf078", // Hot Pink 
    "#5be7a9", // Purple Blue 
    "#feffdf"  // Orange 
  ];

  return (
    <div className="piemilling-page">
      <div className="power-distribution-container">

        {/* RIGHT SIDE - PIE CHART */}
        <div className="power-chart-section">
          <div className="chart-title-container">
            <h2 className="chart-title">
              Auxiliary Power Distribution
            </h2>

            <div className="chart-subtitle">
              Real-Time Auxiliary Consumption by System
            </div>
          </div>
          <ResponsiveContainer width="100%" height={750}>
            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={250}
                innerRadius={80}
                paddingAngle={3}
                isAnimationActive={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(1)}%`
                }
                labelLine={true}
                onClick={(data) => {
                  const route = pageRoutes[data.name];

                  if (route) {
                    navigate(route);
                  }
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    style={{ cursor: "pointer" }}
                    stroke="#f8ecec30"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  Number(value).toFixed(2)
                }
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #8a458a",
                  borderRadius: "10px",
                  fontWeight:700,
                  color: "#fff"
                }}
              />
              <Pie
                data={[{ value: 0 }]}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={18}
                fill="#2b0045"
                isAnimationActive={true}
              />
              

              <Legend />

            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div >
  );
}