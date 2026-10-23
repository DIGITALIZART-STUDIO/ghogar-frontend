"use client";

import Link from "next/link";
import { FileSignature, Wallet } from "lucide-react";

import { useRouteAuthorization } from "@/app/(admin)/_authorization_context";
import { useClientContracts, useClientFinancialSummary } from "@/app/(admin)/contracts/_hooks/useContracts";
import { ContractStatusLabels, formatContractCurrency } from "@/app/(admin)/contracts/_utils/contracts.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ClientContractsPanelProps {
  clientId: string;
}

export function ClientContractsPanel({ clientId }: ClientContractsPanelProps) {
  const { data: contracts = [], isLoading } = useClientContracts(clientId);
  const { data: summary } = useClientFinancialSummary(clientId);
  const canOpenContract = useRouteAuthorization("/contracts");

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando contratos del cliente...</p>;
  }

  if (!contracts.length) {
    return null;
  }

  const balancesFromContracts = Object.values(
    contracts.reduce<
      Record<string, { currency: string; remainingAmount: number; overdueAmount: number; totalPaid: number }>
    >((acc, contract) => {
      const key = contract.currency;
      const current = acc[key] ?? {
        currency: key,
        remainingAmount: 0,
        overdueAmount: 0,
        totalPaid: 0,
      };
      current.remainingAmount += contract.remainingAmount ?? 0;
      current.totalPaid += contract.amountPaid ?? 0;
      acc[key] = current;
      return acc;
    }, {})
  );
  const balances = summary?.balances?.length ? summary.balances : balancesFromContracts;

  return (
    <div className="border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold text-sm">Contratos y saldo</span>
        </div>
        {balances.length ? (
          <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-sm font-medium">
            {balances.map((balance) => (
              <span key={balance.currency}>
                Adeudado {formatContractCurrency(balance.remainingAmount, balance.currency)}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {summary ? (
        <div className="grid gap-3 text-sm sm:grid-cols-2 md:grid-cols-4">
          <Fact label="Activos" value={String(summary.activeContracts)} />
          {balances.map((balance) => (
            <Fact
              key={`${balance.currency}-paid`}
              label={balances.length > 1 ? `Pagado (${balance.currency === "DOLARES" ? "US$" : "S/"})` : "Pagado"}
              value={formatContractCurrency(balance.totalPaid, balance.currency)}
            />
          ))}
          {balances.map((balance) => (
            <Fact
              key={`${balance.currency}-overdue`}
              label={balances.length > 1 ? `Mora (${balance.currency === "DOLARES" ? "US$" : "S/"})` : "Mora"}
              value={formatContractCurrency(balance.overdueAmount, balance.currency)}
            />
          ))}
          <Fact
            label="Próximo vencimiento"
            value={summary.nextPaymentDueDate ? new Date(summary.nextPaymentDueDate).toLocaleDateString("es-PE") : "—"}
          />
        </div>
      ) : null}
      <div className="space-y-2">
        {contracts.map((contract) => {
          const status = ContractStatusLabels[contract.status];
          return (
            <div key={contract.id} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
              <div className="min-w-0">
                <p className="font-medium truncate flex items-center gap-2">
                  <FileSignature className="h-3.5 w-3.5 text-muted-foreground" />
                  {contract.code}
                </p>
                <p className="text-xs text-muted-foreground">
                  {contract.projectName} · Mz {contract.blockName} · Lt {contract.lotNumber}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-medium">
                  {formatContractCurrency(contract.remainingAmount, contract.currency)}
                </span>
                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>
                {canOpenContract ? (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/contracts/${contract.id}`}>Ver</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
