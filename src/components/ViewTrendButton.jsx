// src/components/ViewTrendButton.jsx

import { useNavigate } from "react-router-dom";
import { useTrend } from "../context/TrendContext";

export default function ViewTrendButton() {

  const navigate = useNavigate();

  const { selectedTags } = useTrend();

  const handleTrend = () => {

    if (selectedTags.length === 0) {
      alert("Please select at least one value");
      return;
    }

    navigate("/trends");
  };

  return (
    <button
      className="trend-btn"
      onClick={handleTrend}
    >
      View Trend ({selectedTags.length})
    </button>
  );
}