// components/Header.jsx

import "../index.css";
import { useNavigate } from "react-router-dom";
import { useTrend } from "../context/TrendContext";

export default function Header({
  collapsed,
  setCollapsed
}) {
const navigate = useNavigate();

const {
  selectedTags,
  clearTags
} = useTrend();

  return (
    <div className="header">

  <div className="header-left">
    <button
  className="menu-icon"
  onClick={() => setCollapsed(!collapsed)}
>
  ☰
</button>

    <img
      src="/logo.PNG"
      alt="logo"
      className="header-logo"
    />

    <div className="header-title">
     
    </div>
  </div>

  <div className="header-title">
     Auxiliary Power Consumption Monitoring System
  </div>

  <div className="header-right">

   

    <button
      className="trend-btn"
      disabled={selectedTags.length === 0}
      onClick={() => {
        clearTags();

        navigate("/trends", {
          state: { selectedTags }
        });
      }}
    >
      Trend ({selectedTags.length})
    </button>

  </div>

</div>
  );
}