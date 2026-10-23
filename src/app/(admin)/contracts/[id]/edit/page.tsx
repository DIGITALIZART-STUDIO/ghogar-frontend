"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getApiErrorMessage } from "@/lib/utils";
import { useContractById, useContractSchedule, useUpdateContract } from "../../_hooks/useContracts";
import { UpdateContractFormData, updateContractSchema } from "../../_schemas/updateContractSchema";
import { PaymentType } from "../../_types/contract";
import { canEditContract, parseContractCoOwners } from "../../_utils/contracts.utils";
import { EditContractForm } from "./_components/EditContractForm";

export default function EditContractPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { data: contract, isLoading, isError } = useContractById(id);
  const { data: schedule } = useContractSchedule(id);
  const updateContract = useUpdateContract();

  const paidInstallments =
    schedule?.filter((payment) => payment.type === PaymentType.Installment && payment.paid).length ?? 0;

  const defaultValues = useMemo<UpdateContractFormData | null>(() => {
    if (!contract) {
      return null;
    }
    return {
      totalPrice: contract.totalPrice,
      downPaymentAmount: contract.downPaymentAmount,
      monthsFinanced: contract.monthsFinanced,
      exchangeRate: contract.exchangeRate,
      startDate: contract.startDate
        ? format(parseISO(contract.startDate), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      coOwners: parseContractCoOwners(contract.coOwners),
    };
  }, [contract]);

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Editar contrato" description="Cargando..." />
        <LoadingSpinner text="Cargando contrato..." />
      </div>
    );
  }

  if (isError || !contract || !defaultValues) {
    return (
      <div>
        <HeaderPage title="Editar contrato" description="No se pudo cargar el contrato" />
        <ErrorGeneral />
      </div>
    );
  }

  const locked = !canEditContract(contract.status);

  return (
    <EditContractPageForm
      id={contract.id}
      code={contract.code}
      locked={locked}
      paidInstallments={paidInstallments}
      defaultValues={defaultValues}
      isSaving={updateContract.isPending}
      onCancel={() => router.push(`/contracts/${contract.id}`)}
      onSave={async (data) => {
        const promise = updateContract.mutateAsync({
          id: contract.id,
          payload: {
            totalPrice: data.totalPrice,
            downPaymentAmount: data.downPaymentAmount,
            monthsFinanced: data.monthsFinanced,
            exchangeRate: data.exchangeRate,
            startDate: new Date(`${data.startDate}T00:00:00Z`).toISOString(),
            coOwners: JSON.stringify(data.coOwners ?? []),
          },
        });
        toast.promise(promise, {
          loading: "Guardando contrato...",
          success: (updated) => `Contrato ${updated.code} actualizado`,
          error: (error) => getApiErrorMessage(error, "No se pudo actualizar el contrato"),
        });
        await promise;
        router.push(`/contracts/${contract.id}`);
      }}
    />
  );
}

function EditContractPageForm({
  id,
  code,
  locked,
  paidInstallments,
  defaultValues,
  isSaving,
  onCancel,
  onSave,
}: {
  id: string;
  code: string;
  locked: boolean;
  paidInstallments: number;
  defaultValues: UpdateContractFormData;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (data: UpdateContractFormData) => Promise<void>;
}) {
  const form = useForm<UpdateContractFormData>({
    resolver: zodResolver(updateContractSchema),
    defaultValues,
  });

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/contracts/${id}`}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Volver al contrato
        </Link>
      </Button>
      <HeaderPage
        title={`Editar ${code}`}
        description="Puedes cambiar precio, inicial, plazo, fecha, tipo de cambio y copropietarios. Las cuotas pagadas se conservan."
      />
      {locked ? (
        <p className="text-sm text-muted-foreground">Este contrato está cerrado y ya no se puede editar.</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            <EditContractForm form={form} paidInstallments={paidInstallments} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                Guardar cambios
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
