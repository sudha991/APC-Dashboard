// components/UnitTable.jsx
import "../index.css";

const rows = [
  ["MILLING SYS.", "645", "667", "0", "1693"],
  ["DRAFT STAGE", "4260", "4107", "570", "6511"],
  ["ESP SYSTEM", "700", "490", "570", "417"],
  ["CONDENSATE SYS", "596", "611", "521", "1437"],
];

export default function UnitTable() {
  return (
    <div className="table-container large">
      <div className="table-title">UNIT WISE</div>

      <div className="header-row">
        <div>System</div>
        <div>Unit-1</div>
        <div>Unit-2</div>
        <div>Unit-3</div>
        <div>Unit-4</div>
      </div>

      {rows.map((row, index) => (
        <div className="table-row grid" key={index}>
          {row.map((cell, i) => (
            <div key={i}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}