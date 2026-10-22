"use client";

import { useCallback, useRef } from "react";
import { FilePlus, FileUp, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContractEmptyStateProps {
  onWrite: () => void;
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export function ContractEmptyState({ onWrite, onUpload, isUploading = false }: ContractEmptyStateProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (files: Array<File>) => {
      const file = files[0];
      if (file) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: isUploading,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "rounded-xl border-2 border-dashed bg-card p-8 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isUploading && "opacity-70"
        )}
      >
        <input {...getInputProps()} />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Upload className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Importa el contrato en Word</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Arrastra un archivo <span className="font-medium text-foreground">.docx</span> aquí o selecciónalo. Luego
          podrás corregir el formato e insertar las variables.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onUpload(file);
            }
            event.target.value = "";
          }}
        />
        <Button type="button" className="mt-5" disabled={isUploading} onClick={() => inputRef.current?.click()}>
          <FileUp className="h-4 w-4" />
          {isUploading ? "Importando..." : isDragActive ? "Suelta el archivo aquí" : "Seleccionar archivo .docx"}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
        <span>¿Prefieres escribirlo desde cero?</span>
        <Button type="button" variant="outline" size="sm" onClick={onWrite} disabled={isUploading}>
          <FilePlus className="h-4 w-4" />
          Crear en blanco
        </Button>
      </div>
    </div>
  );
}
