"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SummaryLead } from "@/app/(admin)/leads/_types/lead";
import { toastWrapper } from "@/types/toasts";
import { CreateQuotationSchema, quotationSchema } from "../_schemas/createQuotationsSchema";
import { CreateQuotation } from "../../_actions/QuotationActions";
import { QuotationForm } from "./QuotationForm";

interface CreateClientQuotationPageProps {
  leadsData: Array<SummaryLead>;
  advisorId: string;
}

export default function CreateClientQuotationPage({ leadsData, advisorId }: CreateClientQuotationPageProps) {
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    // Inicializar el formulario con useForm y el esquema de validación
    const form = useForm<CreateQuotationSchema>({
        resolver: zodResolver(quotationSchema),
        defaultValues: {
            leadId: "",
            projectName: "",
            totalPrice: "",
            discount: "0",
            finalPrice: "",
            downPayment: "20",
            amountFinanced: "",
            monthsFinanced: "36",
            block: "",
            lotNumber: "",
            area: "",
            pricePerM2: "",
            exchangeRate: "3.75",
            quotationDate: "",
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

            const [, error] = await toastWrapper(CreateQuotation(quotationData), {
                loading: "Creando cotización...",
                success: "Cotización creada exitosamente",
                error: (e) => `Error al crear cotización: ${e.message}`,
            });

            if (!error) {
                setIsSuccess(true);
            }
        });
    };

    useEffect(() => {
        if (isSuccess) {
            form.reset();
            router.push("/quotation");
            setIsSuccess(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, form]);

    return <QuotationForm leadsData={leadsData} form={form} isPending={isPending} onSubmit={onSubmit} />;
}
