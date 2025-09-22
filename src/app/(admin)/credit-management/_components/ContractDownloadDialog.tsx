"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDownloadContractPDF } from "../../reservations/_hooks/useReservations";

export function ContractDownloadDialog({
    isOpen,
    onOpenChange,
    ContractId,
}: {
	isOpen: boolean,
	onOpenChange: (v: boolean) => void,
	ContractId: string,
}) {
    const [, setError] = useState("");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const downloadContractPDF = useDownloadContractPDF();

    // Download the PDF from the backend on open
    useEffect(
        () => {
            if (!isOpen) {
                return;
            }

            (async () => {
                try {
                    const pdfBlob = await downloadContractPDF(ContractId);
                    const dataUrl = URL.createObjectURL(pdfBlob);
                    setPdfUrl(dataUrl);
                } catch (error) {
                    console.error(error);
                    setError(`Error cargando PDF: ${error instanceof Error ? error.message : "Error desconocido"}`);
                }
            })();

            return () => {
                if (pdfUrl) {
                    URL.revokeObjectURL(pdfUrl);
                }
            };

        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isOpen, ContractId],
    );

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] w-[90vw] px-0">
                <DialogHeader className="px-4">
                    <DialogTitle className="flex items-center font-montserrat">
                        <Download className="h-5 w-5 mr-2" />
                        Descargar Documento
                    </DialogTitle>
                </DialogHeader>
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
            </DialogContent>
        </Dialog>
    );
}

