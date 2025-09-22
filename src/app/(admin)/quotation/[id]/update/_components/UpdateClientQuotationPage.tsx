"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { useUpdateQuotation } from "../../../_hooks/useQuotations";
import { Quotation } from "../../../_types/quotation";
import { QuotationForm } from "../../../create/_components/QuotationForm";
import { CreateQuotationSchema, quotationSchema } from "../../../create/_schemas/createQuotationsSchema";
import { UserGetDTO } from "@/app/(admin)/admin/users/_types/user";

interface UpdateClientQuotationPageProps {
  data: Quotation;
  userData: UserGetDTO;
}

export default function UpdateClientQuotationPage({ data, userData }: UpdateClientQuotationPageProps) {
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    // Estados para preservar las selecciones
    const [selectedProjectId, setSelectedProjectId] = useState<string>(data.projectId ?? "");
    const [selectedBlockId, setSelectedBlockId] = useState<string>(data.blockId ?? "");
    const [selectedLotId, setSelectedLotId] = useState<string>(data.lotId ?? "");

    // Hook para actualizar cotización
    const updateQuotationMutation = useUpdateQuotation();

    // Formulario react-hook-form
    const form = useForm<CreateQuotationSchema>({
        resolver: zodResolver(quotationSchema),
        defaultValues: {
            leadId: data.leadId,
            lotId: data.lotId,
            projectId: data.projectId,
            blockId: data.blockId,
            discount: (data.discount ?? 0).toString(),
            downPayment: (data.downPayment ?? 0).toString(),
            monthsFinanced: (data.monthsFinanced ?? 0).toString(),
            exchangeRate: (data.exchangeRate ?? 0).toString(),
            quotationDate: data.quotationDate,
            area: (data.areaAtQuotation ?? 0).toString(),
            pricePerM2: (data.pricePerM2AtQuotation ?? 0).toString(),
            totalPrice: (data.totalPrice ?? 0).toString(),
            finalPrice: (data.finalPrice ?? 0).toString(),
            amountFinanced: (data.amountFinanced ?? 0).toString(),
        },
    });

    // Si data puede cambiar, actualiza los estados y el formulario
    useEffect(() => {
        setSelectedProjectId(data.projectId ?? "");
        setSelectedBlockId(data.blockId ?? "");
        setSelectedLotId(data.lotId ?? "");
        form.reset({
            leadId: data.leadId,
            lotId: data.lotId,
            projectId: data.projectId,
            blockId: data.blockId,
            discount: (data.discount ?? 0).toString(),
            downPayment: (data.downPayment ?? 0).toString(),
            monthsFinanced: (data.monthsFinanced ?? 0).toString(),
            exchangeRate: (data.exchangeRate ?? 0).toString(),
            quotationDate: data.quotationDate,
            area: (data.areaAtQuotation ?? 0).toString(),
            pricePerM2: (data.pricePerM2AtQuotation ?? 0).toString(),
            totalPrice: (data.totalPrice ?? 0).toString(),
            finalPrice: (data.finalPrice ?? 0).toString(),
            amountFinanced: (data.amountFinanced ?? 0).toString(),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const onSubmit = async (input: CreateQuotationSchema) => {
        startTransition(async () => {
            const quotationData = {
                leadId: input.leadId,
                lotId: selectedLotId || input.lotId,
                projectId: selectedProjectId || input.projectId,
                blockId: selectedBlockId || input.blockId,
                discount: parseFloat(input.discount),
                downPayment: parseFloat(input.downPayment),
                monthsFinanced: parseInt(input.monthsFinanced, 10),
                exchangeRate: parseFloat(input.exchangeRate),
                quotationDate: input.quotationDate,
            };

            const promise = updateQuotationMutation.mutateAsync({
                params: {
                    path: { id: data?.id ?? "" },
                },
                body: quotationData,
            });

            toast.promise(promise, {
                loading: "Actualizando cotización...",
                success: "Cotización actualizada exitosamente",
                error: (e) => `Error al actualizar cotización: ${e.message}`,
            });

            try {
                await promise;
                setIsSuccess(true);
            } catch {
                // Error ya manejado por toast.promise
            }
        });
    };

    useEffect(() => {
        if (isSuccess) {
            router.push("/quotation");
            setIsSuccess(false);
        }
    }, [isSuccess, router]);

    return (
        <QuotationForm
            form={form}
            isPending={isPending}
            onSubmit={onSubmit}
            initialSelection={{
                projectId: selectedProjectId,
                blockId: selectedBlockId,
                lotId: selectedLotId,
            }}
            userData={userData}
        />
    );
}
