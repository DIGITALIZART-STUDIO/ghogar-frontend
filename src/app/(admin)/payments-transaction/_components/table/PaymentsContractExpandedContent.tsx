"use client";

import type { ReactNode } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";

import { ContractDto } from "@/app/(admin)/contracts/_types/contract";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { usePaymentScheduleByContract, usePaymentTransactionsByContract } from "../../_hooks/usePaymentTransactions";
import { PaymentSchedulePanel } from "./resizable-panels/PaymentSchedulePanel";
import { PaymentTransactionsPanel } from "./resizable-panels/PaymentTransactionsPanel";

interface PaymentsContractExpandedContentProps {
  contract: ContractDto;
}

export function PaymentsContractExpandedContent({ contract }: PaymentsContractExpandedContentProps) {
  const { data: payments = [], isLoading, error } = usePaymentScheduleByContract(contract.id);
  const {
    data: transactions = [],
    isLoading: isLoadingTx,
    error: errorTx,
  } = usePaymentTransactionsByContract(contract.id);

  return (
    <div className="p-6">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[500px] rounded-xl border-2 border-gray-200/60 dark:border-gray-800 overflow-hidden"
      >
        <ResizablePanel defaultSize={50} minSize={25}>
          {isLoading ? (
            <PanelState
              icon={<LoaderCircle className="animate-spin text-blue-600 w-8 h-8" />}
              title="Cargando cronograma"
            />
          ) : error ? (
            <PanelState icon={<AlertCircle className="text-red-600 w-8 h-8" />} title="Error al cargar el cronograma" />
          ) : (
            <PaymentSchedulePanel payments={payments} currency={contract.currency} />
          )}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={25}>
          {isLoadingTx ? (
            <PanelState
              icon={<LoaderCircle className="animate-spin text-green-600 w-8 h-8" />}
              title="Cargando transacciones"
            />
          ) : errorTx ? (
            <PanelState
              icon={<AlertCircle className="text-red-600 w-8 h-8" />}
              title="Error al cargar las transacciones"
            />
          ) : (
            <PaymentTransactionsPanel transactions={transactions} currency={contract.currency} parentId={contract.id} />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function PanelState({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="p-4 bg-white dark:bg-gray-950 rounded-full mb-4">{icon}</div>
      <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
    </div>
  );
}
