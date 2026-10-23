"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Ban, Banknote, FileText, List, Pencil, ShieldCheck, User } from "lucide-react";

import { UpdateClientSheet } from "@/app/(admin)/clients/_components/update/UpdateClientsSheet";
import { useClientById } from "@/app/(admin)/clients/_hooks/useClients";
import { Client } from "@/app/(admin)/clients/_types/client";
import { DocumentDownloadDialog } from "@/components/common/DocumentDownloadDialog";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ContractPaymentScheduleTable } from "../_components/ContractPaymentScheduleTable";
import { RescindContractDialog } from "../_components/RescindContractDialog";
import { ToggleContractValidationDialog } from "../_components/ToggleContractValidationDialog";
import {
  invalidateContractQueries,
  useContractById,
  useContractSchedule,
  useDownloadContractDocx,
  useDownloadContractPdf,
  useDownloadContractSchedulePdf,
} from "../_hooks/useContracts";
import { ContractStatus } from "../_types/contract";
import {
  canEditContract,
  canRegisterContractPayment,
  canToggleContractValidation,
  ContractOriginLabels,
  ContractStatusLabels,
  formatContractCurrency,
} from "../_utils/contracts.utils";

export default function ContractDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data: contract, isLoading, isError } = useContractById(id);
  const { data: schedule, isLoading: isScheduleLoading } = useContractSchedule(id);
  const downloadPdf = useDownloadContractPdf();
  const downloadDocx = useDownloadContractDocx();
  const downloadSchedule = useDownloadContractSchedulePdf();
  const queryClient = useQueryClient();
  const [contractDocOpen, setContractDocOpen] = useState(false);
  const [scheduleDocOpen, setScheduleDocOpen] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [editClientOpen, setEditClientOpen] = useState(false);
  const [rescindOpen, setRescindOpen] = useState(false);
  const { data: client } = useClientById(contract?.clientId);

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Contrato" description="Cargando ficha..." />
        <LoadingSpinner text="Cargando contrato..." />
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div>
        <HeaderPage title="Contrato" description="No se pudo cargar el contrato" />
        <ErrorGeneral />
      </div>
    );
  }

  const status = ContractStatusLabels[contract.status];
  const origin = ContractOriginLabels[contract.origin];
  const StatusIcon = status.icon;
  const OriginIcon = origin.icon;
  const canToggle = canToggleContractValidation(contract.status);
  const canRegisterPayment = canRegisterContractPayment(contract.status);
  const canEdit = canEditContract(contract.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/contracts">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Contratos
          </Link>
        </Button>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <HeaderPage title={contract.code} description={`${contract.clientName} · ${contract.projectName}`} />
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={origin.className}>
            <OriginIcon className="mr-1 h-3.5 w-3.5" />
            {origin.label}
          </Badge>
          <Badge variant="outline" className={status.className}>
            <StatusIcon className="mr-1 h-3.5 w-3.5" />
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {canEdit ? (
          <Button variant="outline" asChild>
            <Link href={`/contracts/${contract.id}/edit`}>
              <Pencil className="mr-1 h-4 w-4" />
              Editar contrato
            </Link>
          </Button>
        ) : null}
        {client ? (
          <Button variant="outline" onClick={() => setEditClientOpen(true)}>
            <User className="mr-1 h-4 w-4" />
            Editar cliente
          </Button>
        ) : null}
        {canRegisterPayment ? (
          <Button asChild>
            <Link href={`/payments-transaction/${contract.id}/create`}>
              <Banknote className="mr-1 h-4 w-4" />
              Registrar pago
            </Link>
          </Button>
        ) : null}
        {canToggle ? (
          <Button variant="outline" onClick={() => setToggleOpen(true)}>
            <ShieldCheck className="mr-1 h-4 w-4" />
            {contract.status === ContractStatus.Active ? "Marcar pendiente" : "Validar contrato"}
          </Button>
        ) : null}
        <Button variant="outline" onClick={() => setContractDocOpen(true)}>
          <FileText className="mr-1 h-4 w-4" />
          Contrato PDF
        </Button>
        <Button variant="outline" onClick={() => setScheduleDocOpen(true)}>
          <List className="mr-1 h-4 w-4" />
          Cronograma PDF
        </Button>
        {canEdit ? (
          <Button variant="destructive" onClick={() => setRescindOpen(true)}>
            <Ban className="mr-1 h-4 w-4" />
            Anular contrato
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Lote" value={`Mz ${contract.blockName} · Lt ${contract.lotNumber}`} />
        <Fact label="Precio" value={formatContractCurrency(contract.totalPrice, contract.currency)} />
        <Fact label="Inicial" value={formatContractCurrency(contract.downPaymentAmount, contract.currency)} />
        <Fact
          label="Financiado"
          value={`${formatContractCurrency(contract.amountFinanced, contract.currency)} · ${contract.monthsFinanced} meses`}
        />
      </div>

      {contract.quotationCode ? (
        <p className="text-sm text-muted-foreground">
          Cotización {contract.quotationCode}
          {contract.reservationId ? " · proviene de una separación" : null}
        </p>
      ) : null}

      {isScheduleLoading ? (
        <LoadingSpinner text="Cargando cronograma..." />
      ) : (
        <ContractPaymentScheduleTable data={schedule ?? []} currency={contract.currency} />
      )}

      {toggleOpen ? (
        <ToggleContractValidationDialog contract={contract} open={toggleOpen} onOpenChange={setToggleOpen} />
      ) : null}
      {editClientOpen && client ? (
        <UpdateClientSheet
          client={client as Client}
          open={editClientOpen}
          onOpenChange={(open) => {
            setEditClientOpen(open);
            if (!open) {
              invalidateContractQueries(queryClient);
            }
          }}
        />
      ) : null}
      {rescindOpen ? (
        <RescindContractDialog contract={contract} open={rescindOpen} onOpenChange={setRescindOpen} />
      ) : null}
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
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
