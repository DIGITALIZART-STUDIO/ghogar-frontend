"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Braces,
  Indent,
  List,
  ListOrdered,
  Outdent,
  Search,
  Table,
  Underline as UnderlineIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ContractVariable } from "../../../_types/project-contract";
import { ContractVariableExtension } from "./contract-variable-extension";
import { IndentExtension } from "./indent-extension";
import { ListStyleExtension } from "./list-style-extension";
import { normalizeImportedContractHtml } from "./normalize-contract-html";

import "./contract-editor.css";

interface ContractEditorProps {
  content: string;
  onChange: (html: string) => void;
  variables: Array<ContractVariable>;
  disabled?: boolean;
  header?: ReactNode;
  compact?: boolean;
}

export function ContractEditor({
  content,
  onChange,
  variables,
  disabled = false,
  header,
  compact = false,
}: ContractEditorProps) {
  const onChangeRef = useRef(onChange);
  const canEmitUpdates = useRef(false);
  const initialContentRef = useRef(normalizeImportedContractHtml(content || "<p></p>"));

  onChangeRef.current = onChange;

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TableKit.configure({
        table: { resizable: false },
      }),
      Placeholder.configure({
        placeholder: "Escribe el contrato o inserta una variable donde la necesites...",
      }),
      ContractVariableExtension,
      IndentExtension,
      ListStyleExtension,
    ],
    []
  );

  const editorProps = useMemo(
    () => ({
      attributes: {
        class: "contract-editor-content px-8 py-8 text-[15px] leading-7 sm:px-12 sm:py-10",
      },
    }),
    []
  );

  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: true,
      extensions,
      content: initialContentRef.current,
      editable: !disabled,
      editorProps,
      onCreate: () => {
        queueMicrotask(() => {
          canEmitUpdates.current = true;
        });
      },
      onUpdate: ({ editor: currentEditor }) => {
        if (!canEmitUpdates.current) {
          return;
        }

        const html = currentEditor.getHTML();
        queueMicrotask(() => {
          onChangeRef.current(html);
        });
      },
    },
    []
  );

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) {
    return (
      <div>
        {header}
        <div className="min-h-[560px] rounded-xl border bg-muted/30" />
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "sticky top-32 z-20 -mx-4 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/90 lg:top-0",
          compact && "border-b shadow-sm"
        )}
      >
        {header}
        <div className="overflow-hidden rounded-t-xl border border-b-0 bg-card">
          <EditorToolbar disabled={disabled} editor={editor} variables={variables} />
          <div className={cn("border-b bg-muted/20 px-4 text-xs text-muted-foreground", compact ? "hidden" : "py-2")}>
            Coloca el cursor donde deba ir el dato y usa{" "}
            <span className="font-medium text-foreground">Insertar variable</span>. Las etiquetas azules se reemplazan
            al generar cada contrato.
          </div>
        </div>
      </div>

      <div className="rounded-b-xl border border-t-0 bg-muted/30 p-3 sm:p-5">
        <div className="mx-auto max-w-4xl overflow-x-auto rounded-md border bg-white shadow-sm dark:bg-card">
          <EditorContent editor={editor} className="contract-editor" />
        </div>
      </div>
    </div>
  );
}

function EditorToolbar({
  editor,
  variables,
  disabled,
}: {
  editor: Editor;
  variables: Array<ContractVariable>;
  disabled: boolean;
}) {
  const applyBulletList = (listStyle: "disc" | "dash") => {
    const currentStyle = editor.getAttributes("bulletList").listStyle ?? "disc";
    if (editor.isActive("bulletList") && currentStyle === listStyle) {
      editor.chain().focus().toggleBulletList().run();
      return;
    }

    if (editor.isActive("bulletList")) {
      editor.chain().focus().updateAttributes("bulletList", { listStyle }).run();
      return;
    }

    editor.chain().focus().toggleBulletList().updateAttributes("bulletList", { listStyle }).run();
  };

  return (
    <div className="flex items-center gap-1 border-b bg-card">
      <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-1 overflow-x-auto p-2 [scrollbar-width:thin] [&>*]:shrink-0">
        <ToolbarButton
          active={editor.isActive("bold")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Negrita"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          label="Subrayado"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          active={editor.isActive("bulletList") && editor.getAttributes("bulletList").listStyle !== "dash"}
          disabled={disabled}
          onClick={() => applyBulletList("disc")}
          label="Viñetas con puntos"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList") && editor.getAttributes("bulletList").listStyle === "dash"}
          disabled={disabled}
          onClick={() => applyBulletList("dash")}
          label="Viñetas con guiones"
        >
          <span className="flex h-4 w-4 flex-col items-center justify-center gap-[3px] text-[10px] leading-none">
            <span>—</span>
            <span>—</span>
          </span>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          disabled={disabled}
          onClick={() => editor.chain().focus().indent().run()}
          label="Aumentar sangría"
        >
          <Indent className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          disabled={disabled}
          onClick={() => editor.chain().focus().outdent().run()}
          label="Reducir sangría"
        >
          <Outdent className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          active={editor.isActive({ textAlign: "left" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          label="Alinear a la izquierda"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "center" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          label="Centrar"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "right" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          label="Alinear a la derecha"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive({ textAlign: "justify" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          label="Justificar"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          disabled={disabled}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          label="Insertar tabla"
        >
          <Table className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <div className="shrink-0 p-2 pl-0">
        <VariableInsertMenu disabled={disabled} editor={editor} variables={variables} />
      </div>
    </div>
  );
}

function VariableInsertMenu({
  editor,
  variables,
  disabled,
}: {
  editor: Editor;
  variables: Array<ContractVariable>;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const groupedVariables = useMemo(() => {
    const query = search.trim().toLowerCase();

    return variables.reduce<Record<string, Array<ContractVariable>>>((groups, variable) => {
      const matches =
        !query ||
        variable.label.toLowerCase().includes(query) ||
        variable.key.toLowerCase().includes(query) ||
        variable.group.toLowerCase().includes(query);

      if (!matches) {
        return groups;
      }

      const group = variable.group ?? "Otros";
      groups[group] ??= [];
      groups[group].push(variable);
      return groups;
    }, {});
  }, [search, variables]);

  const insertVariable = (key: string) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "contractVariable",
        attrs: { key },
      })
      .run();
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setSearch("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button type="button" size="sm" className="h-8" disabled={disabled}>
          <Braces className="h-4 w-4" />
          Insertar variable
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b p-2">
          <div className="relative">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar variable..."
              className="h-9 pl-8"
            />
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {Object.keys(groupedVariables).length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No hay variables para esa búsqueda.</p>
          ) : (
            Object.entries(groupedVariables).map(([group, items]) => (
              <div key={group} className="mb-1">
                <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{group}</p>
                {items.map((variable) => (
                  <button
                    key={variable.key}
                    type="button"
                    className="flex w-full flex-col rounded-md px-2 py-1.5 text-left hover:bg-accent"
                    onClick={() => insertVariable(variable.key)}
                  >
                    <span className="text-sm">{variable.label}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{variable.key}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ToolbarDivider() {
  return <Separator orientation="vertical" className="mx-1 h-5" />;
}

function ToolbarButton({
  children,
  onClick,
  active = false,
  disabled = false,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={cn("h-8 w-8", active && "bg-accent text-accent-foreground")}
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
