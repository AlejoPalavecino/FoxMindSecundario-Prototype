import React from "react";

interface EmptyStateAction {
  href: string;
  label: string;
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: EmptyStateAction;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className="empty-state" aria-live="polite">
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? (
        <a className="empty-state-action" href={action.href}>
          {action.label}
        </a>
      ) : null}
    </section>
  );
}
