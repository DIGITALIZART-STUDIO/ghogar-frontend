"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useCreateReservation } from "../../_hooks/useReservations";
import { ReservationForm } from "./ReservationForm";
import type { components } from "@/types/api";
import { CreateReservationSchema, reservationSchema } from "../_schemas/createReservationSchema";

type QuotationSummary = components["schemas"]["QuotationSummaryDTO"];

interface CreateReservationPageProps {
    quotationsData: Array<QuotationSummary>;
}

export default function CreateReservationPage({ quotationsData }: CreateReservationPageProps) {
    const router = useRouter();
    const createReservation = useCreateReservation();

    const form = useForm<CreateReservationSchema>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            quotationId: "",
            reservationDate: "",
            amountPaid: "", // Se calculará automáticamente cuando se seleccione una cotización
            currency: undefined,
            paymentMethod: undefined,
            bankName: "",
            exchangeRate: "",
            expiresAt: "",
            schedule: "",
            coOwners: [],
        },
    });

    const onSubmit = async (data: CreateReservationSchema) => {
        try {
            // Prepare the reservation data - backend will extract client ID from quotation's lead
            const reservationData = {
                quotationId: data.quotationId,
                reservationDate: data.reservationDate,
                amountPaid: parseFloat(data.amountPaid),
                currency: data.currency as "SOLES" | "DOLARES",
                paymentMethod: data.paymentMethod as "CASH" | "BANK_DEPOSIT" | "BANK_TRANSFER",
                bankName: data.bankName ?? undefined,
                exchangeRate: parseFloat(data.exchangeRate),
                expiresAt: data.expiresAt,
                schedule: data.schedule ?? undefined,
                coOwners: data.coOwners && data.coOwners.length > 0 ? JSON.stringify(data.coOwners) : undefined,
            };

            await toast.promise(
                createReservation.mutateAsync({
                    body: reservationData,
                }),
                {
                    loading: "Creando separación...",
                    success: "Separación creada exitosamente",
                    error: (error) => `Error al crear la separación: ${error.message ?? "Error desconocido"}`,
                }
            );

            router.push("/reservations");
        } catch (error) {
            console.error("Error creating reservation:", error);
        }
    };

    return (
        <ReservationForm
            quotationsData={quotationsData}
            form={form}
            onSubmit={onSubmit}
            isPending={createReservation.isPending}
        />
    );
}
