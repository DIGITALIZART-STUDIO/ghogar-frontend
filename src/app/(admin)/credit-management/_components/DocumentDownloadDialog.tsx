"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, Eye } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
interface DocumentDownloadDialogProps {
    isOpen: boolean;
    onOpenChange: (v: boolean) => void;
    documentId: string;
    title: string;
    pdfAction: (id: string) => Promise<Blob>;
    wordAction?: (id: string) => Promise<Blob>;
    pdfFileName?: string;
    wordFileName?: string;
}

export function DocumentDownloadDialog({
    isOpen,
    onOpenChange,
    documentId,
    title,
    pdfAction,
    wordAction,
    pdfFileName = `documento-${documentId}.pdf`,
    wordFileName = `documento-${documentId}.docx`,
}: DocumentDownloadDialogProps) {
    const [error, setError] = useState("");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const isLoadingRef = useRef(false);

    // Download the PDF from the backend on open for preview
    useEffect(
        () => {
            if (!isOpen) {
                setPdfUrl(null);
                isLoadingRef.current = false;
                setError("");
                return;
            }

            // Prevent duplicate requests
            if (isLoadingRef.current) {
                return;
            }

            isLoadingRef.current = true;

            (async() => {
                try {
                    const pdfBlob = await pdfAction(documentId);
                    const dataUrl = URL.createObjectURL(pdfBlob);
                    setPdfUrl(dataUrl);
                } catch (error) {
                    console.error("Error loading PDF:", error);
                    setError(`Error cargando PDF: ${error instanceof Error ? error.message : "Error desconocido"}`);
                } finally {
                    isLoadingRef.current = false;
                }
            })();
        },
        [isOpen, documentId, pdfAction],
    );

    // Cleanup URL when component unmounts or URL changes
    useEffect(() => () => {
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
    }, [pdfUrl]);

    const handleDownloadPdf = async () => {
        try {
            const pdfBlob = await pdfAction(documentId);
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = pdfFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            setError(`Error descargando PDF: ${error instanceof Error ? error.message : "Error desconocido"}`);
        }
    };

    const handleDownloadWord = async () => {
        if (!wordAction) {
            return;
        }

        try {
            const wordBlob = await wordAction(documentId);
            const url = URL.createObjectURL(wordBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = wordFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading Word:", error);
            setError(`Error descargando Word: ${error instanceof Error ? error.message : "Error desconocido"}`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] w-[90vw] px-0">
                <DialogHeader className="px-4">
                    <DialogTitle className="flex items-center font-montserrat">
                        <Eye className="h-5 w-5 mr-2" />
                        {title}
                    </DialogTitle>
                </DialogHeader>

                {error && (
                    <div className="px-4 py-2 text-red-600 text-sm bg-red-50 mx-4 rounded">
                        {error}
                    </div>
                )}

                <div className="px-6">
                    {!!pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            title="PDF Preview"
                            className="inline-block w-full max-h-[80vh] h-[500px] pdf-viewer"
                        />
                    ) : (
                        <Skeleton className="w-full max-h-[80vh] h-[500px] rounded" />
                    )}
                </div>

                <div className="flex justify-end gap-2 px-6 pb-4">
                    <Button
                        onClick={handleDownloadPdf}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Descargar PDF
                    </Button>

                    {wordAction && (
                        <Button
                            onClick={handleDownloadWord}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            Descargar Word
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
