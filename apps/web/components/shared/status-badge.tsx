import React from "react";

type RawStatus = "ok" | "warning" | "blocked";
export type StatusBadgeTone = "success" | "warning" | "danger";

interface StatusBadgeValue {
  label: string;
  tone: StatusBadgeTone;
}

const STATUS_VALUES: Record<RawStatus, StatusBadgeValue> = {
  ok: { label: "Operativo", tone: "success" },
  warning: { label: "Atención", tone: "warning" },
  blocked: { label: "Bloqueado", tone: "danger" }
};

export function resolveStatusBadge(status: RawStatus): StatusBadgeValue {
  return STATUS_VALUES[status];
}

export function StatusBadge({ status }: { status: RawStatus }) {
  const badge = resolveStatusBadge(status);
  return (
    <span className={`status-badge status-${badge.tone}`} aria-label={`Estado: ${badge.label}`}>
      {badge.label}
    </span>
  );
}
