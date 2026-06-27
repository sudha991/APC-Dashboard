import { useTrend } from "../context/TrendContext";

export default function SelectableTrendCell({
  value,
  tag,
  label
}) {
  const { selectedTags, toggleTag } = useTrend();

  const selected = selectedTags.some(
    (x) => x.tag === tag
  );

  const handleClick = () => {
    console.log("Clicked:", tag, label);
    toggleTag(tag, label);
  };

  return (
    <div
      className={`trend-cell ${
        selected ? "selected" : ""
      }`}
      onClick={handleClick}
    >
      {value}
    </div>
  );
}