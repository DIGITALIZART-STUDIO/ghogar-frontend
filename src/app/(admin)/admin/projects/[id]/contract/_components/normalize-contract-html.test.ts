import { describe, expect, it } from "vitest";

import { normalizeImportedContractHtml } from "./normalize-contract-html";

describe("normalizeImportedContractHtml", () => {
  it("returns empty or whitespace input unchanged", () => {
    expect(normalizeImportedContractHtml("")).toBe("");
    expect(normalizeImportedContractHtml("   ")).toBe("   ");
  });

  it("inlines preserved CSS from style tags and then removes them", () => {
    const html = `
      <style>
        p.intro { text-align: center; color: red; }
      </style>
      <p class="intro">Contrato</p>
    `;

    const result = normalizeImportedContractHtml(html);

    expect(result).not.toContain("<style");
    expect(result).toContain("text-align: center");
    expect(result).not.toContain("color: red");
    expect(result).toContain("Contrato");
  });

  it("converts align attributes into text-align styles", () => {
    const result = normalizeImportedContractHtml('<p align="right">Firma</p>');

    expect(result).toContain("text-align");
    expect(result.toLowerCase()).toContain("right");
    expect(result).not.toContain("align=");
  });

  it("replaces center tags with centered paragraphs", () => {
    const result = normalizeImportedContractHtml("<center>Título</center>");

    expect(result).toContain("<p");
    expect(result).toContain("text-align: center");
    expect(result).toContain("Título");
    expect(result).not.toContain("<center");
  });

  it("marks dash lists so the editor can keep the Word bullet style", () => {
    const result = normalizeImportedContractHtml("<ul style=\"list-style-type: '- '\"><li>Cláusula</li></ul>");

    expect(result).toContain('data-list-style="dash"');
    expect(result).toContain("Cláusula");
  });

  it("keeps standard ordered list types", () => {
    const result = normalizeImportedContractHtml('<ol style="list-style-type: upper-roman"><li>Primero</li></ol>');

    expect(result).toContain('data-list-style="upper-roman"');
    expect(result).toContain("list-style-type: upper-roman");
  });
});
