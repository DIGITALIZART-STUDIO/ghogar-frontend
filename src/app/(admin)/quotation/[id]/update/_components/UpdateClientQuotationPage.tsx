"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SummaryLead } from "@/app/(admin)/leads/_types/lead";
import { toastWrapper } from "@/types/toasts";
import { UpdateQuotation } from "../../../_actions/QuotationActions";
import { Quotation } from "../../../_types/quotation";
import { QuotationForm } from "../../../create/_components/QuotationForm";
import { CreateQuotationSchema, quotationSchema } from "../../../create/_schemas/createQuotationsSchema";

interface UpdateClientQuotationPageProps {
  leadsData: Array<SummaryLead>;
  advisorId: string;
  data: Quotation;
}

export default function UpdateClientQuotationPage({ leadsData, advisorId, data }: UpdateClientQuotationPageProps) {
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    // Inicializar el formulario con los datos existentes de la cotización
    const form = useForm<CreateQuotationSchema>({
        resolver: zodResolver(quotationSchema),
        defaultValues: {
            leadId: data.leadId,
            projectName: data.projectName,
            totalPrice: (data.totalPrice ?? 0).toString(),
            discount: (data.discount ?? 0).toString(),
            finalPrice: (data.finalPrice ?? 0).toString(),
            downPayment: (data.downPayment ?? 0).toString(),
            amountFinanced: (data.amountFinanced ?? 0).toString(),
            monthsFinanced: (data.monthsFinanced ?? 0).toString(),
            block: data.block,
            lotNumber: data.lotNumber,
            area: (data.area ?? 0).toString(),
            pricePerM2: (data.pricePerM2 ?? 0).toString(),
            exchangeRate: (data.exchangeRate ?? 0).toString(),
            quotationDate: data.quotationDate,
        },
    });

    const onSubmit = async(input: CreateQuotationSchema) => {
        startTransition(async() => {
            // Preparar los datos para el formato esperado por el backend
            const quotationData = {
                leadId: input.leadId,
                projectName: input.projectName,
                totalPrice: Number.parseFloat(input.totalPrice),
                discount: Number.parseFloat(input.discount ?? "0"),
                finalPrice: Number.parseFloat(input.finalPrice),
                downPayment: Number.parseFloat(input.downPayment),
                amountFinanced: Number.parseFloat(input.amountFinanced),
                monthsFinanced: Number.parseInt(input.monthsFinanced, 10),
                block: input.block,
                lotNumber: input.lotNumber,
                area: Number.parseFloat(input.area),
                pricePerM2: Number.parseFloat(input.pricePerM2),
                exchangeRate: Number.parseFloat(input.exchangeRate),
                quotationDate: input.quotationDate,
                advisorId,
            };

            const [, error] = await toastWrapper(UpdateQuotation(data?.id ?? "", quotationData), {
                loading: "Actualizando cotización...",
                success: "Cotización actualizada exitosamente",
                error: (e) => `Error al actualizar cotización: ${e.message}`,
            });

            if (!error) {
                setIsSuccess(true);
            }
        });
    };

    useEffect(() => {
        if (isSuccess) {
            router.push("/quotation");
            setIsSuccess(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    return <QuotationForm leadsData={leadsData} form={form} isPending={isPending} onSubmit={onSubmit} />;
}
