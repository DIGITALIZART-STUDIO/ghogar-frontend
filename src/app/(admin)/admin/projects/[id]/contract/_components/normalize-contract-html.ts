const PRESERVED_STYLE_PROPERTIES = new Set([
  "list-style-type",
  "list-style",
  "margin-left",
  "margin-right",
  "padding-left",
  "padding-right",
  "text-align",
  "text-indent",
  "font-weight",
  "font-style",
  "text-decoration",
  "font-size",
  "text-transform",
]);

const DASH_LIST_TYPES = new Set(["dash", "-", "- ", '"-"', '"- "', "'-'", "'- '"]);

function parseCssRules(cssText: string): Array<{ selector: string; declarations: string }> {
  return cssText
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("}")
    .map((block) => block.trim())
    .filter(Boolean)
    .flatMap((block) => {
      const openIndex = block.indexOf("{");
      if (openIndex < 0) {
        return [];
      }

      const selectorGroup = block.slice(0, openIndex).trim();
      const declarations = filterDeclarations(block.slice(openIndex + 1));
      if (!selectorGroup || !declarations || selectorGroup.startsWith("@")) {
        return [];
      }

      return selectorGroup.split(",").map((selector) => ({
        selector: selector.trim(),
        declarations,
      }));
    });
}

function filterDeclarations(raw: string): string {
  return raw
    .split(";")
    .map((item) => item.trim())
    .filter((item) => {
      const property = item.split(":")[0]?.trim().toLowerCase();
      return Boolean(property && PRESERVED_STYLE_PROPERTIES.has(property));
    })
    .join("; ");
}

function mergeStyles(current: string, incoming: string): string {
  const styles = new Map<string, string>();

  for (const chunk of `${current};${incoming}`.split(";")) {
    const [property, ...rest] = chunk.split(":");
    const name = property?.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (name && value) {
      styles.set(name, value);
    }
  }

  return [...styles.entries()].map(([property, value]) => `${property}: ${value}`).join("; ");
}

function normalizeListStyleType(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase().replace(/['"]/g, "");
  if (DASH_LIST_TYPES.has(normalized) || normalized === "-") {
    return "dash";
  }

  if (
    [
      "disc",
      "circle",
      "square",
      "decimal",
      "decimal-leading-zero",
      "lower-alpha",
      "upper-alpha",
      "lower-latin",
      "upper-latin",
      "lower-roman",
      "upper-roman",
    ].includes(normalized)
  ) {
    return normalized;
  }

  return null;
}

function applyListStyleAttribute(element: Element) {
  const inlineType = element.getAttribute("style")?.match(/list-style-type\s*:\s*([^;]+)/i)?.[1];
  const typeAttr = element.getAttribute("type");
  const listStyle = normalizeListStyleType(inlineType) ?? normalizeListStyleType(typeAttr);

  if (!listStyle) {
    return;
  }

  element.setAttribute("data-list-style", listStyle);
  const cssValue = listStyle === "dash" ? '"- "' : listStyle;
  const current = element.getAttribute("style") ?? "";
  element.setAttribute("style", mergeStyles(current, `list-style-type: ${cssValue}`));
}

export function normalizeImportedContractHtml(html: string): string {
  if (!html.trim() || typeof window === "undefined") {
    return html;
  }

  const document = new DOMParser().parseFromString(html, "text/html");
  const styleTags = [...document.querySelectorAll("style")];
  const cssText = styleTags.map((tag) => tag.textContent ?? "").join("\n");
  const rules = parseCssRules(cssText);

  for (const rule of rules) {
    let matches: NodeListOf<Element>;
    try {
      matches = document.querySelectorAll(rule.selector);
    } catch {
      continue;
    }

    matches.forEach((element) => {
      element.setAttribute("style", mergeStyles(element.getAttribute("style") ?? "", rule.declarations));
    });
  }

  styleTags.forEach((tag) => tag.remove());

  document.querySelectorAll("[align]").forEach((element) => {
    const align = element.getAttribute("align");
    if (align && !(element as HTMLElement).style.textAlign) {
      (element as HTMLElement).style.textAlign = align;
    }
    element.removeAttribute("align");
  });

  document.querySelectorAll("center").forEach((element) => {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = element.innerHTML;
    paragraph.style.textAlign = "center";
    element.replaceWith(paragraph);
  });

  document.querySelectorAll("ul, ol").forEach(applyListStyleAttribute);

  return document.body.innerHTML;
}
