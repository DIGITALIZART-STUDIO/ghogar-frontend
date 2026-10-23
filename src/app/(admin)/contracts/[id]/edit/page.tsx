"use client";

import { useMemo, useRef } from "react";
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
import {
  useContractById,
  useContractSchedule,
  usePreviewContractSchedule,
  useUpdateContractSchedule,
} from "../../_hooks/useContracts";
import { UpdateContractFormData, updateContractSchema } from "../../_schemas/updateContractSchema";
import { ContractScheduleTerms } from "../../_types/contract";
import {
  buildContractSchedulePreviewPayload,
  buildUpdateContractSchedulePayload,
  canEditContract,
  installmentsFromSchedule,
  parseContractCoOwners,
  pickContractScheduleTerms,
  scheduleTermsChanged,
} from "../../_utils/contracts.utils";
import { EditContractForm } from "./_components/EditContractForm";

export default function EditContractPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { data: contract, isLoading, isError } = useContractById(id);
  const { data: schedule, isLoading: isScheduleLoading, isError: isScheduleError } = useContractSchedule(id);
  const previewSchedule = usePreviewContractSchedule();
  const updateSchedule = useUpdateContractSchedule();

  const defaultValues = useMemo<UpdateContractFormData | null>(() => {
    if (!contract || !schedule) {
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
      applyRecalculatedSchedule: false,
      installments: installmentsFromSchedule(schedule),
    };
  }, [contract, schedule]);

  if (isLoading || isScheduleLoading) {
    return (
      <div>
        <HeaderPage title="Editar contrato" description="Cargando..." />
        <LoadingSpinner text="Cargando contrato..." />
      </div>
    );
  }

  if (isError || isScheduleError || !contract || !defaultValues) {
    return (
      <div>
        <HeaderPage title="Editar contrato" description="No se pudo cargar el contrato" />
        <ErrorGeneral />
      </div>
    );
  }

  const locked = !canEditContract(contract.status);
  const paidInstallments = defaultValues.installments.filter((installment) => installment.locked).length;

  return (
    <EditContractPageForm
      id={contract.id}
      code={contract.code}
      currency={contract.currency}
      locked={locked}
      paidInstallments={paidInstallments}
      defaultValues={defaultValues}
      isSaving={updateSchedule.isPending}
      isPreviewing={previewSchedule.isPending}
      onCancel={() => router.push(`/contracts/${contract.id}`)}
      onPreview={async (data) => {
        const preview = await previewSchedule.mutateAsync({
          id: contract.id,
          payload: buildContractSchedulePreviewPayload(data),
        });
        return installmentsFromSchedule(preview);
      }}
      onSave={async (data) => {
        const promise = updateSchedule.mutateAsync({
          id: contract.id,
          payload: buildUpdateContractSchedulePayload(data),
        });
        toast.promise(promise, {
          loading: "Guardando cronograma...",
          success: (updated) => `Cronograma de ${updated.code} actualizado`,
          error: (error) => getApiErrorMessage(error, "No se pudo guardar el cronograma"),
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
  currency,
  locked,
  paidInstallments,
  defaultValues,
  isSaving,
  isPreviewing,
  onCancel,
  onPreview,
  onSave,
}: {
  id: string;
  code: string;
  currency: string;
  locked: boolean;
  paidInstallments: number;
  defaultValues: UpdateContractFormData;
  isSaving: boolean;
  isPreviewing: boolean;
  onCancel: () => void;
  onPreview: (data: UpdateContractFormData) => Promise<UpdateContractFormData["installments"]>;
  onSave: (data: UpdateContractFormData) => Promise<void>;
}) {
  const termsBaselineRef = useRef<ContractScheduleTerms>(pickContractScheduleTerms(defaultValues));
  const form = useForm<UpdateContractFormData>({
    resolver: zodResolver(updateContractSchema),
    defaultValues,
  });
  const totalPrice = form.watch("totalPrice");
  const downPaymentAmount = form.watch("downPaymentAmount");
  const monthsFinanced = form.watch("monthsFinanced");
  const startDate = form.watch("startDate");
  const applyRecalculatedSchedule = form.watch("applyRecalculatedSchedule");
  const needsRecalculate = scheduleTermsChanged(
    pickContractScheduleTerms({
      totalPrice,
      downPaymentAmount,
      monthsFinanced,
      startDate,
    }),
    termsBaselineRef.current
  );

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
        description="Puedes cambiar las fechas de las cuotas pendientes. Si cambias precio, inicial, plazo o fecha de inicio, recalcula para ver cómo quedarían."
      />
      {locked ? (
        <p className="text-sm text-muted-foreground">Este contrato está cerrado y ya no se puede editar.</p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              if (needsRecalculate) {
                toast.error("Recalcula las cuotas antes de guardar.");
                return;
              }
              await onSave(data);
            })}
            className="space-y-6"
          >
            <EditContractForm
              form={form}
              paidInstallments={paidInstallments}
              currency={currency}
              isPreview={applyRecalculatedSchedule && !needsRecalculate}
            />
            {needsRecalculate ? (
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Cambiaste precio, inicial, plazo o fecha de inicio. Recalcula las cuotas para ver cómo quedarían antes
                de guardar.
              </p>
            ) : null}
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isPreviewing || isSaving}
                onClick={async () => {
                  const isTermsValid = await form.trigger([
                    "totalPrice",
                    "downPaymentAmount",
                    "monthsFinanced",
                    "startDate",
                  ]);
                  if (!isTermsValid) {
                    return;
                  }
                  const data = form.getValues();
                  const promise = onPreview(data);
                  toast.promise(promise, {
                    loading: "Recalculando cuotas...",
                    success: "Vista previa lista. Revisa las fechas antes de guardar.",
                    error: (error) => getApiErrorMessage(error, "No se pudo recalcular el cronograma"),
                  });
                  try {
                    const installments = await promise;
                    form.setValue("installments", installments, { shouldDirty: true, shouldValidate: true });
                    form.setValue("applyRecalculatedSchedule", true);
                    termsBaselineRef.current = pickContractScheduleTerms(data);
                  } catch {
                    // toast.promise already surfaced the error
                  }
                }}
              >
                Recalcular cuotas
              </Button>
              <Button type="submit" disabled={isSaving || isPreviewing || needsRecalculate}>
                Guardar cronograma
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
