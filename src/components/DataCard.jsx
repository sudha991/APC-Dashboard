// components/DataCard.jsx
import "../index.css";

export default function DataCard({ title, value }) {
  return (
    <div className="data-card">
      <div className="card-title">{title}</div>

      <div className="card-value">{value}</div>
    </div>
  );
}