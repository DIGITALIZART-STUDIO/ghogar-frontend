"use client";

import { useCallback, useEffect, useState } from "react";
import { Download } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDownloadQuotationPDF } from "../../_hooks/useQuotations";

export function QuotationDownloadDialog({
  isOpen,
  onOpenChange,
  quotationId,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  quotationId: string;
}) {
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const downloadQuotationPDF = useDownloadQuotationPDF();

  const fetchPdf = useCallback(async () => {
    try {
      const pdfBlob = await downloadQuotationPDF(quotationId);
      const dataUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(dataUrl);
      setError("");
    } catch (error) {
      console.error("Error loading PDF:", error);
      setError(`Error cargando PDF: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotationId]);

  // Download the PDF from the backend on open
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    fetchPdf();
  }, [isOpen, fetchPdf]);

  // Cleanup URL when component unmounts or URL changes
  useEffect(
    () => () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    },
    [pdfUrl]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] w-[90vw] px-0">
        <DialogHeader className="px-4">
          <DialogTitle className="flex items-center font-montserrat">
            <Download className="h-5 w-5 mr-2" />
            Descargar Cotización
          </DialogTitle>
        </DialogHeader>
        <div className="px-6">
          {error ? (
            <div className="flex items-center justify-center w-full max-h-[80vh] h-[500px] border border-red-200 rounded bg-red-50">
              <div className="text-center">
                <p className="text-red-600 font-medium">Error al cargar el PDF</p>
                <p className="text-red-500 text-sm mt-2">{error}</p>
              </div>
            </div>
          ) : !!pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              className="inline-block w-full max-h-[80vh] h-[500px] pdf-viewer"
            />
          ) : (
            <Skeleton className="w-full max-h-[80vh] h-[500px] rounded" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
