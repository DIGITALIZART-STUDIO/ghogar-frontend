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

    // Estados para preservar las selecciones
    const [selectedProjectId, setSelectedProjectId] = useState<string>(data.projectId ?? "");
    const [selectedBlockId, setSelectedBlockId] = useState<string>(data.blockId ?? "");
    const [selectedLotId, setSelectedLotId] = useState<string>(data.lotId ?? "");

    // Inicializar el formulario con los datos existentes de la cotización
    const form = useForm<CreateQuotationSchema>({
        resolver: zodResolver(quotationSchema),
        defaultValues: {
            // Claves primarias/IDs
            leadId: data.leadId,
            lotId: data.lotId,
            advisorId: data.advisorId,
            projectId: data.projectId,
            blockId: data.blockId,

            // Campos financieros como string (para formulario)
            discount: (data.discount ?? 0).toString(),
            downPayment: (data.downPayment ?? 0).toString(),
            monthsFinanced: (data.monthsFinanced ?? 0).toString(),
            exchangeRate: (data.exchangeRate ?? 0).toString(),

            // Fecha
            quotationDate: data.quotationDate,

            // Información del lote
            area: (data.areaAtQuotation ?? 0).toString(),
            pricePerM2: (data.pricePerM2AtQuotation ?? 0).toString(),

            // Valores calculados
            totalPrice: (data.totalPrice ?? 0).toString(),
            finalPrice: (data.finalPrice ?? 0).toString(),
            amountFinanced: (data.amountFinanced ?? 0).toString(),
        },
    });
    // Efectos para cargar datos necesarios al inicializar
    useEffect(() => {
        const loadInitialData = async () => {
            // Cargar datos de proyectos, bloques y lotes para establecer los estados seleccionados
            if (data.projectId) {
                setSelectedProjectId(data.projectId);

                if (data.blockId) {
                    setSelectedBlockId(data.blockId);

                    if (data.lotId) {
                        setSelectedLotId(data.lotId);
                    }
                }
            }
        };

        loadInitialData();
    }, [data.projectId, data.blockId, data.lotId]);

    const onSubmit = async (input: CreateQuotationSchema) => {
        startTransition(async () => {
            // Preparar los datos para el formato esperado por el backend
            const quotationData = {
                // Claves primarias (requeridas por el backend)
                leadId: input.leadId,
                lotId: selectedLotId || input.lotId,
                advisorId: advisorId,

                // IDs de proyecto y bloque
                projectId: selectedProjectId || input.projectId,
                blockId: selectedBlockId || input.blockId,

                // Campos financieros opcionales
                discount: parseFloat(input.discount),
                downPayment: parseFloat(input.downPayment),
                monthsFinanced: parseInt(input.monthsFinanced, 10),
                exchangeRate: parseFloat(input.exchangeRate),

                // Fecha
                quotationDate: input.quotationDate,
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

    return (
        <QuotationForm
            leadsData={leadsData}
            form={form}
            isPending={isPending}
            onSubmit={onSubmit}
            // Pasar estados iniciales al componente QuotationForm
            initialSelection={{
                projectId: selectedProjectId,
                blockId: selectedBlockId,
                lotId: selectedLotId,
            }}
        />
    );
}
