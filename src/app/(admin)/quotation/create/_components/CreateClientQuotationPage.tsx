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

    // Inicializar el formulario con useForm y el esquema de validación actualizado
    const form = useForm<CreateQuotationSchema>({
        resolver: zodResolver(quotationSchema),
        defaultValues: {
            // Claves primarias/IDs - todos vacíos excepto advisorId que viene por props
            leadId: "",
            lotId: "",
            advisorId: advisorId,
            projectId: "",
            blockId: "",

            // Campos financieros - valores iniciales
            discount: "0",
            downPayment: "20",
            monthsFinanced: "36",
            exchangeRate: "3.75",

            // Fecha - hoy por defecto
            quotationDate: new Date().toISOString()
                .split("T")[0],

            // Información del lote - inicialmente vacíos
            area: "",
            pricePerM2: "",

            // Valores calculados - inicialmente vacíos
            totalPrice: "",
            finalPrice: "",
            amountFinanced: "",
        },
    });

    const onSubmit = async (input: CreateQuotationSchema) => {
        startTransition(async () => {
            // Preparar los datos para el formato esperado por el backend
            const quotationData = {
                // Claves primarias (requeridas por el backend)
                leadId: input.leadId,
                lotId: input.lotId,
                advisorId: advisorId,

                // Campos financieros opcionales
                discount: parseFloat(input.discount),
                downPayment: parseFloat(input.downPayment),
                monthsFinanced: parseInt(input.monthsFinanced, 10),
                exchangeRate: parseFloat(input.exchangeRate),

                // Fecha
                quotationDate: input.quotationDate,
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
