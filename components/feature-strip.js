export default function FeatureStrip({ features }) {
  return (
    <div className="stack-list compact">
      {features.map((feature) => (
        <article className="list-card" key={feature.title}>
          <div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
          <span className={`pill ${feature.priorityTone}`}>{feature.badge}</span>
        </article>
      ))}
    </div>
  );
}
