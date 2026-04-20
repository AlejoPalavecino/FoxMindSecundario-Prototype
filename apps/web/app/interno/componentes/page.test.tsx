import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import InternalComponentsShowcasePage from "./page";

describe("internal components showcase page", () => {
  it("renders base components showcase sections", () => {
    const html = renderToStaticMarkup(<InternalComponentsShowcasePage />);

    expect(html).toContain("Showcase interno de componentes");
    expect(html).toContain("PageHeader");
    expect(html).toContain("EmptyState");
    expect(html).toContain("StatusBadge");
    expect(html).toContain("StatCard");
    expect(html).toContain("DataTable");
    expect(html).toContain("Skeletons por módulo");
  });
});
