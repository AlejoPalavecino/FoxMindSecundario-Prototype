import React from "react";

type StatCardTone = "neutral" | "success" | "warning" | "danger";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  tone?: StatCardTone;
}

export function StatCard({
  title,
  value,
  description,
  tone = "neutral"
}: StatCardProps) {
  return (
    <article className={`stat-card stat-card-${tone}`} aria-label={`Métrica: ${title}`}>
      <h3>{title}</h3>
      <p className="stat-card-value">{value}</p>
      {description ? <p className="stat-card-description">{description}</p> : null}
    </article>
  );
}
