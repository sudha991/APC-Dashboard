// components/SystemTable.jsx

import "../index.css";

const systems = [
  ["MILLING SYSTEM", "1,312", "4,641"],
  ["DRAFT SYSTEM", "11,017", "18,936"],
  ["ESP SYSTEM", "1,759", "3,339"],
  ["CONDENSATE SYSTEM", "1,727", "4,903"],
  ["CW SYSTEM", "5,099", "16,990"],
  ["CT-LT-TRANSFORMER", "", "1,055"],
  ["AW-FF-TRANSFORMER", "", "819"],
  ["B.F PUMP SYSTEM (STAGE-1)", "", "8,203"],
  ["ASH SLURRY (STAGE-1)", "", "490"],
  ["ASH SLURRY (STAGE-2)", "", "1,377"],
  ["ASH SLURRY (STAGE-3)", "", "660"],
  ["CHP (CRUSHER)", "", "88"],
  ["CHP (CONVEYOR)", "", "306"],
  ["RAW WATER PUMPS", "", "668"],
  ["CLARIFIED WATER PUMPS", "", "570"],
  ["PLANT AIR COMP.", "", "1,312"],
  ["INSTRUMENT AIR COMP.", "", "1,120"],
];

export default function SystemTable() {
  return (
    <div className="table-container right-table">
      <div className="table-title">STAGE WISE (kW)</div>

      <div className="header-row stage-header">
        <div>System</div>
        <div>STAGE-I</div>
        <div>STAGE-II</div>
      </div>

      {systems.map((item, index) => (
        <div className="table-row stage-grid" key={index}>
          <div className="system-name">{item[0]}</div>
          <div>{item[1]}</div>
          <div>{item[2]}</div>
        </div>
      ))}
    </div>
  );
}