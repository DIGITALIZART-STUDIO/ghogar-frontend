"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";

import { components } from "@/types/api";
import { CreateReservationSchema, reservationSchema } from "../_schemas/createReservationSchema";
import { CreateReservation } from "../../_actions/ReservationActions";
import { ReservationForm } from "./ReservationForm";

type QuotationDTO = components["schemas"]["QuotationDTO"];

interface CreateReservationPageProps {
  quotationsData: Array<QuotationDTO>;
}

export default function CreateReservationPage({ quotationsData }: CreateReservationPageProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<CreateReservationSchema>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            quotationId: "",
            reservationDate: format(new Date(), "yyyy-MM-dd"),
            amountPaid: "",
            currency: "SOLES",
            paymentMethod: "CASH",
            bankName: "",
            exchangeRate: "3.75", // Default exchange rate
            expiresAt: "",
            schedule: "",
        },
    });

    const onSubmit = async (data: CreateReservationSchema) => {
        setIsPending(true);
        
        try {
            // Find the selected quotation to get the client ID
            const selectedQuotation = quotationsData.find(q => q.id === data.quotationId);
            
            if (!selectedQuotation || !selectedQuotation.leadId) {
                toast.error("Error: No se pudo obtener el cliente de la cotización seleccionada");
                return;
            }

            // Prepare the reservation data with client ID from quotation's lead
            const reservationData: components["schemas"]["ReservationCreateDto"] = {
                clientId: selectedQuotation.leadId, // Auto-filled from selected quotation's lead ID
                quotationId: data.quotationId,
                reservationDate: data.reservationDate,
                amountPaid: parseFloat(data.amountPaid),
                currency: data.currency as "SOLES" | "DOLARES",
                paymentMethod: data.paymentMethod as "CASH" | "BANK_DEPOSIT" | "BANK_TRANSFER",
                bankName: data.bankName || undefined,
                exchangeRate: parseFloat(data.exchangeRate),
                expiresAt: data.expiresAt,
                schedule: data.schedule || undefined,
            };

            const [result, error] = await CreateReservation(reservationData);

            if (error) {
                toast.error(`Error al crear la separación: ${error.message || "Error desconocido"}`);
                return;
            }

            toast.success("Separación creada exitosamente");
            router.push("/reservations");
        } catch (error) {
            console.error("Error creating reservation:", error);
            toast.error("Error inesperado al crear la separación");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <ReservationForm
            quotationsData={quotationsData}
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
        />
    );
} 