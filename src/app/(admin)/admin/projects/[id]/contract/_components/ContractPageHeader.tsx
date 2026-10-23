"use client";

import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileUp, Save, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContractPageHeaderProps {
  projectId: string;
  projectName: string;
  compact?: boolean;
  showActions?: boolean;
  isDirty?: boolean;
  exists?: boolean;
  modifiedAt?: string | null;
  canDelete?: boolean;
  isSaving?: boolean;
  onReplaceWord?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
}

export function ContractPageHeader({
  projectId,
  projectName,
  compact = false,
  showActions = false,
  isDirty = false,
  exists = false,
  modifiedAt,
  canDelete = false,
  isSaving = false,
  onReplaceWord,
  onDelete,
  onSave,
}: ContractPageHeaderProps) {
  return (
    <div className={cn("flex flex-col", compact ? "gap-2 py-2.5" : "gap-3 py-3")}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/admin/projects">Proyectos</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href={`/admin/projects/${projectId}/blocks`}>{projectName}</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Contrato</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1
            className={cn(
              "font-bold text-gray-900 dark:text-white",
              compact ? "truncate text-xl" : "text-2xl sm:text-3xl"
            )}
          >
            Contrato de {projectName}
          </h1>
          <p className={cn("text-sm text-muted-foreground", compact ? "hidden" : "mt-1")}>
            Plantilla que se usará al generar el contrato de cada separación.
          </p>
          {showActions && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {isDirty ? (
                <Badge variant="outline">Cambios sin guardar</Badge>
              ) : exists ? (
                <Badge variant="secondary">Guardado</Badge>
              ) : null}
              {modifiedAt && (
                <span className={cn("text-xs text-muted-foreground", compact && "hidden sm:inline")}>
                  Última edición {format(new Date(modifiedAt), "d MMM yyyy, HH:mm", { locale: es })}
                </span>
              )}
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size={compact ? "sm" : "default"} onClick={onReplaceWord}>
              <FileUp className="h-4 w-4" />
              Reemplazar Word
            </Button>
            {canDelete && exists && (
              <Button type="button" variant="destructive" size={compact ? "sm" : "default"} onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            )}
            <Button type="button" size={compact ? "sm" : "default"} onClick={onSave} disabled={isSaving || !isDirty}>
              <Save className="h-4 w-4" />
              Guardar contrato
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
