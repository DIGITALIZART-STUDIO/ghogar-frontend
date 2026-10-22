import { Extension } from "@tiptap/react";

const DASH_VALUES = new Set(["dash", "-", "- ", '"-"', '"- "', "'-'", "'- '"]);

function parseListStyle(element: HTMLElement, fallback: string) {
  const dataValue = element.getAttribute("data-list-style");
  const typeAttr = element.getAttribute("type");
  const cssValue = element.style.listStyleType;
  const raw = (dataValue ?? cssValue ?? typeAttr ?? fallback).trim().toLowerCase();

  if (DASH_VALUES.has(raw) || raw === "-") {
    return "dash";
  }

  return raw || fallback;
}

export const ListStyleExtension = Extension.create({
  name: "listStyle",

  addGlobalAttributes() {
    return [
      {
        types: ["bulletList"],
        attributes: {
          listStyle: {
            default: "disc",
            parseHTML: (element) => parseListStyle(element, "disc"),
            renderHTML: (attributes) => {
              const listStyle = attributes.listStyle === "dash" ? "dash" : (attributes.listStyle ?? "disc");
              const cssValue = listStyle === "dash" ? '"- "' : listStyle;

              return {
                "data-list-style": listStyle,
                style: `list-style-type: ${cssValue}`,
              };
            },
          },
        },
      },
      {
        types: ["orderedList"],
        attributes: {
          listStyle: {
            default: "decimal",
            parseHTML: (element) => parseListStyle(element, "decimal"),
            renderHTML: (attributes) => {
              const listStyle = attributes.listStyle ?? "decimal";

              return {
                "data-list-style": listStyle,
                style: `list-style-type: ${listStyle}`,
              };
            },
          },
        },
      },
    ];
  },
});
