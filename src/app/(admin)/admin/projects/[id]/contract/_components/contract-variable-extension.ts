import { mergeAttributes, Node } from "@tiptap/react";

export const ContractVariableExtension = Node.create({
  name: "contractVariable",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      key: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-variable"),
        renderHTML: (attributes) => {
          if (!attributes.key) {
            return {};
          }

          return {
            "data-variable": attributes.key,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-variable]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "contract-variable",
        "data-variable": node.attrs.key,
      }),
      node.attrs.key ?? "",
    ];
  },

  renderText({ node }) {
    return node.attrs.key ?? "";
  },
});
