"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { DownloadReservationPDF } from "../_actions/ReservationActions";
import { Skeleton } from "@/components/ui/skeleton";

export function ReservationDownloadDialog({
    isOpen,
    onOpenChange,
    reservationId,
}: {
    isOpen: boolean,
    onOpenChange: (v: boolean) => void,
    reservationId: string,
}) {
    const [, setError] = useState("");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const isLoadingRef = useRef(false);

    // Download the PDF from the backend on open
    useEffect(
        () => {
            if (!isOpen) {
                setPdfUrl(null);
                isLoadingRef.current = false;
                return;
            }

            // Prevent duplicate requests
            if (isLoadingRef.current) {
                return;
            }

            isLoadingRef.current = true;

            (async() => {
                try {
                    const [pdfBlob, error] = await DownloadReservationPDF(reservationId);
                    if (!!error) {
                        console.error(error);
                        setError(`Error cargando PDF: ${error.message}`);
                        return;
                    }

                    const dataUrl = URL.createObjectURL(pdfBlob);
                    setPdfUrl(dataUrl);
                } finally {
                    isLoadingRef.current = false;
                }
            })();
        },
        [isOpen, reservationId],
    );

    // Cleanup URL when component unmounts or URL changes
    useEffect(() => () => {
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
    }, [pdfUrl]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] w-[90vw] px-0">
                <DialogHeader className="px-4">
                    <DialogTitle className="flex items-center font-montserrat">
                        <Download className="h-5 w-5 mr-2" />
                        Descargar Documento de Separación
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
