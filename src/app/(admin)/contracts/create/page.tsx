"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateContract } from "../_hooks/useContracts";
import { CreateContractFormData, createContractSchema } from "../_schemas/createContractSchema";
import { ContractCurrency, ContractOrigin } from "../_types/contract";
import { CreateContractForm } from "./_components/CreateContractForm";

export default function CreateContractPage() {
  const router = useRouter();
  const createContract = useCreateContract();
  const form = useForm<CreateContractFormData>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      origin: ContractOrigin.Direct,
      clientId: "",
      projectId: "",
      blockId: "",
      lotId: "",
      totalPrice: 0,
      downPaymentAmount: 0,
      monthsFinanced: 12,
      currency: ContractCurrency.SOLES,
      exchangeRate: 1,
      startDate: format(new Date(), "yyyy-MM-dd"),
      paidInstallments: 0,
    },
  });

  const onSubmit = async (data: CreateContractFormData) => {
    const promise = createContract.mutateAsync({
      origin: data.origin,
      clientId: data.clientId,
      lotId: data.lotId,
      totalPrice: data.totalPrice,
      downPaymentAmount: data.downPaymentAmount,
      monthsFinanced: data.monthsFinanced,
      currency: data.currency,
      exchangeRate: data.exchangeRate,
      startDate:
        data.origin === ContractOrigin.Legacy && data.startDate
          ? new Date(`${data.startDate}T00:00:00Z`).toISOString()
          : undefined,
      paidInstallments: data.origin === ContractOrigin.Legacy ? (data.paidInstallments ?? 0) : undefined,
    });

    toast.promise(promise, {
      loading: "Creando contrato...",
      success: (created) => `Contrato ${created.code} creado`,
      error: (e) => e?.message ?? "No se pudo crear el contrato",
    });

    const created = await promise;
    router.push(`/contracts/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/contracts">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Contratos
        </Link>
      </Button>
      <HeaderPage
        title="Nuevo contrato"
        description="Alta directa (sin cotización) o carga de un contrato legado ya firmado."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CreateContractForm form={form} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/contracts")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createContract.isPending}>
              Crear contrato
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
