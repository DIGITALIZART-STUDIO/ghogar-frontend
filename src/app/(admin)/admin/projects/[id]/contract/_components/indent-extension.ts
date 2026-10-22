import { Extension } from "@tiptap/react";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    };
  }
}

const INDENT_TYPES = ["paragraph", "heading", "listItem"];
const INDENT_STEP_PX = 24;

function parseLengthToPx(value: string): number {
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return 0;
  }

  if (value.includes("cm")) {
    return amount * 37.8;
  }
  if (value.includes("mm")) {
    return amount * 3.78;
  }
  if (value.includes("in")) {
    return amount * 96;
  }
  if (value.includes("pt")) {
    return amount * (96 / 72);
  }

  return amount;
}

function parseIndentLevel(element: HTMLElement): number {
  const raw = element.style.paddingLeft || element.style.marginLeft;
  if (!raw) {
    return 0;
  }

  return Math.min(8, Math.max(0, Math.round(parseLengthToPx(raw) / INDENT_STEP_PX)));
}

export const IndentExtension = Extension.create({
  name: "indent",

  addGlobalAttributes() {
    return [
      {
        types: INDENT_TYPES,
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => parseIndentLevel(element),
            renderHTML: (attributes) => {
              if (!attributes.indent) {
                return {};
              }

              return {
                style: `padding-left: ${attributes.indent * INDENT_STEP_PX}px`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent:
        () =>
        ({ editor, commands }) => {
          if (editor.can().sinkListItem("listItem")) {
            return commands.sinkListItem("listItem");
          }

          const type = INDENT_TYPES.find((name) => editor.isActive(name)) ?? "paragraph";
          const current = Number(editor.getAttributes(type).indent ?? 0);
          return commands.updateAttributes(type, { indent: Math.min(8, current + 1) });
        },
      outdent:
        () =>
        ({ editor, commands }) => {
          if (editor.can().liftListItem("listItem")) {
            return commands.liftListItem("listItem");
          }

          const type = INDENT_TYPES.find((name) => editor.isActive(name)) ?? "paragraph";
          const current = Number(editor.getAttributes(type).indent ?? 0);
          return commands.updateAttributes(type, { indent: Math.max(0, current - 1) });
        },
    };
  },
});
