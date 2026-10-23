"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useClaims } from "@/app/(admin)/_authorization_context";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { HeaderPage } from "@/components/common/HeaderPage";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getApiErrorMessage } from "@/lib/utils";
import {
  useContractVariables,
  useDeleteProjectContract,
  useImportProjectContract,
  useProjectContract,
  useSaveProjectContract,
} from "../../../_hooks/useProjectContract";
import { useProject } from "../../../_hooks/useProjects";
import { canDeleteProjectContract } from "../../../_utils/project-permissions";
import { ContractEditor } from "./ContractEditor";
import { ContractEmptyState } from "./ContractEmptyState";
import { ContractPageHeader } from "./ContractPageHeader";
import { normalizeImportedContractHtml } from "./normalize-contract-html";

interface ProjectContractPageProps {
  projectId: string;
}

export function ProjectContractPage({ projectId }: ProjectContractPageProps) {
  const roles = useClaims();
  const canDelete = canDeleteProjectContract(roles);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const draftHtmlRef = useRef<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const { data: project, isLoading: isLoadingProject, error: projectError } = useProject(projectId);
  const { data: contract, isLoading: isLoadingContract, error: contractError } = useProjectContract(projectId);
  const { data: variables = [] } = useContractVariables();
  const saveContract = useSaveProjectContract();
  const importContract = useImportProjectContract();
  const deleteContract = useDeleteProjectContract();

  const exists = contract?.exists === true;
  const editorContent = htmlContent ?? contract?.htmlContent ?? "";
  const showEditor = exists || isWriting || Boolean(htmlContent);

  useEffect(() => {
    if (!showEditor) {
      setIsCompact(false);
      return;
    }

    const sentinel = stickySentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCompact(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-40px 0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [showEditor]);

  const handleEditorChange = (html: string) => {
    draftHtmlRef.current = html;
    setIsDirty((current) => (current ? current : true));
  };

  const handleSave = async () => {
    const htmlToSave = draftHtmlRef.current ?? editorContent;
    const promise = saveContract.mutateAsync({
      params: { path: { id: projectId } },
      body: { htmlContent: htmlToSave },
    });

    toast.promise(promise, {
      loading: "Guardando contrato...",
      success: "Contrato guardado",
      error: (error) => getApiErrorMessage(error, "Error al guardar el contrato"),
    });

    try {
      await promise;
      setHtmlContent(htmlToSave);
      setIsWriting(false);
      setIsDirty(false);
    } catch {
      // El error ya se maneja en el toast.promise
    }
  };

  const handleUpload = async (file: File) => {
    const promise = importContract.mutateAsync({
      params: { path: { id: projectId } },
      body: { file },
    });

    toast.promise(promise, {
      loading: "Importando Word...",
      success: "Contrato importado. Revisa el formato y las variables.",
      error: (error) => getApiErrorMessage(error, "Error al importar el Word"),
    });

    try {
      const result = await promise;
      const importedHtml = normalizeImportedContractHtml(result.htmlContent ?? "");
      draftHtmlRef.current = importedHtml;
      setHtmlContent(importedHtml);
      setIsWriting(true);
      setIsDirty(false);
      setEditorKey((current) => current + 1);
    } catch {
      // El error ya se maneja en el toast.promise
    }
  };

  const handleDelete = async () => {
    const promise = deleteContract.mutateAsync({
      params: { path: { id: projectId } },
    });

    toast.promise(promise, {
      loading: "Eliminando contrato...",
      success: "Contrato eliminado",
      error: (error) => getApiErrorMessage(error, "Error al eliminar el contrato"),
    });

    await promise;
    draftHtmlRef.current = null;
    setHtmlContent(null);
    setIsWriting(false);
    setIsDirty(false);
    setEditorKey((current) => current + 1);
  };

  if (isLoadingProject || isLoadingContract) {
    return (
      <div className="space-y-6">
        <HeaderPage title="Contrato" description="Cargando proyecto..." />
        <LoadingSpinner text="Cargando contrato..." />
      </div>
    );
  }

  if (projectError || contractError || !project) {
    return (
      <div className="space-y-6">
        <HeaderPage title="Contrato" description="No se pudo cargar el contrato" />
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <Building2 className="w-12 h-12 text-red-400 mb-2" />
          <h3 className="text-lg font-semibold">Error al cargar el contrato</h3>
          <p className="text-muted-foreground">
            {getApiErrorMessage(projectError ?? contractError, "Inténtalo de nuevo.")}
          </p>
        </div>
      </div>
    );
  }

  const pageHeader = (
    <ContractPageHeader
      projectId={projectId}
      projectName={project.name ?? "Proyecto"}
      compact={isCompact}
      showActions={showEditor}
      isDirty={isDirty}
      exists={exists}
      modifiedAt={contract?.modifiedAt}
      canDelete={canDelete}
      isSaving={saveContract.isPending}
      onReplaceWord={() => fileInputRef.current?.click()}
      onDelete={() => setOpenDeleteDialog(true)}
      onSave={() => void handleSave()}
    />
  );

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleUpload(file);
          }
          event.target.value = "";
        }}
      />

      {showEditor ? (
        <>
          <div ref={stickySentinelRef} className="h-px" aria-hidden />
          <div className="relative">
            {importContract.isPending && (
              <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importando documento...
                </div>
              </div>
            )}
            <ContractEditor
              key={editorKey}
              content={editorContent}
              onChange={handleEditorChange}
              variables={variables}
              disabled={importContract.isPending}
              header={pageHeader}
              compact={isCompact}
            />
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {pageHeader}
          <ContractEmptyState
            onWrite={() => {
              draftHtmlRef.current = "<p></p>";
              setHtmlContent("<p></p>");
              setIsWriting(true);
              setIsDirty(true);
              setEditorKey((current) => current + 1);
            }}
            onUpload={(file) => void handleUpload(file)}
            isUploading={importContract.isPending}
          />
        </div>
      )}

      {canDelete && (
        <ConfirmationDialog
          title="¿Eliminar el contrato de este proyecto?"
          description="Las nuevas separaciones no podrán generar contrato hasta que se registre uno otra vez."
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="destructive"
          showTrigger={false}
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
