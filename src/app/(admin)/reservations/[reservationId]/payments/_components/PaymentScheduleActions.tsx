"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { DocumentDownloadDialog } from "@/components/common/DocumentDownloadDialog";
import { Button } from "@/components/ui/button";
import { useDownloadReservationSchedulePDF } from "../../../_hooks/useReservations";

interface PaymentScheduleActionsProps {
  reservationId: string;
}

export function PaymentScheduleActions({ reservationId }: PaymentScheduleActionsProps) {
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const downloadSchedulePDF = useDownloadReservationSchedulePDF();

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setOpenScheduleDialog(true)} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Descargar Cronograma PDF
        </Button>
      </div>

      {openScheduleDialog && (
        <DocumentDownloadDialog
          documentId={reservationId}
          isOpen={openScheduleDialog}
          onOpenChange={setOpenScheduleDialog}
          title="Cronograma de Pagos"
          pdfAction={downloadSchedulePDF}
          pdfFileName={`cronograma-${reservationId}.pdf`}
        />
      )}
    </>
  );
}
