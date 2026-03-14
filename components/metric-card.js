export default function MetricCard({ label, value, delta, detail, tone }) {
  return (
    <article className={`metric-card ${tone || ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{delta}</em>
      <p>{detail}</p>
    </article>
  );
}
