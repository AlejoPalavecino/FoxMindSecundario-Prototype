import React from "react";

export interface DataTableColumn {
  key: string;
  header: string;
}

export interface DataTableRow {
  id: string;
  [key: string]: React.ReactNode;
}

interface DataTableProps {
  caption: string;
  columns: DataTableColumn[];
  rows: DataTableRow[];
  emptyMessage?: string;
}

export function DataTable({
  caption,
  columns,
  rows,
  emptyMessage = "Sin datos disponibles"
}: DataTableProps) {
  return (
    <section className="data-table-wrap" aria-label={caption}>
      <table className="data-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={`${row.id}-${column.key}`}>{row[column.key] ?? "-"}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} aria-live="polite">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
