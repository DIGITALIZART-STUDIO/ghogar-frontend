"use client";

import { useState } from "react";
import Link from "next/link";
import { Banknote, Ellipsis, FileText, List } from "lucide-react";

import { DocumentDownloadDialog } from "@/components/common/DocumentDownloadDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDownloadContractDocx,
  useDownloadContractPdf,
  useDownloadContractSchedulePdf,
} from "../../_hooks/useContracts";
import { ContractDto } from "../../_types/contract";
import { canRegisterContractPayment } from "../../_utils/contracts.utils";

interface ContractRowActionsProps {
  contract: ContractDto;
}

export function ContractRowActions({ contract }: ContractRowActionsProps) {
  const [contractDocOpen, setContractDocOpen] = useState(false);
  const [scheduleDocOpen, setScheduleDocOpen] = useState(false);
  const downloadPdf = useDownloadContractPdf();
  const downloadDocx = useDownloadContractDocx();
  const downloadSchedule = useDownloadContractSchedulePdf();
  const canRegisterPayment = canRegisterContractPayment(contract.status);

  return (
    <div onClick={(event) => event.stopPropagation()}>
      {contractDocOpen ? (
        <DocumentDownloadDialog
          isOpen={contractDocOpen}
          onOpenChange={setContractDocOpen}
          documentId={contract.id}
          title={`Contrato ${contract.code}`}
          pdfAction={downloadPdf}
          wordAction={downloadDocx}
          pdfFileName={`${contract.code}.pdf`}
          wordFileName={`${contract.code}.docx`}
        />
      ) : null}
      {scheduleDocOpen ? (
        <DocumentDownloadDialog
          isOpen={scheduleDocOpen}
          onOpenChange={setScheduleDocOpen}
          documentId={contract.id}
          title={`Cronograma ${contract.code}`}
          pdfAction={downloadSchedule}
          pdfFileName={`cronograma-${contract.code}.pdf`}
        />
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Abrir menú" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
            <Ellipsis className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuItem onSelect={() => setContractDocOpen(true)}>
            Descargar contrato
            <DropdownMenuShortcut>
              <FileText className="size-4" aria-hidden="true" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setScheduleDocOpen(true)}>
            Descargar cronograma de pagos
            <DropdownMenuShortcut>
              <List className="size-4" aria-hidden="true" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {canRegisterPayment ? (
            <DropdownMenuItem asChild>
              <Link href={`/payments-transaction/${contract.id}/create`}>
                Registrar pago
                <DropdownMenuShortcut>
                  <Banknote className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem disabled>
              Registrar pago
              <DropdownMenuShortcut>
                <Banknote className="size-4" aria-hidden="true" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
