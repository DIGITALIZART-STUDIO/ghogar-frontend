"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";

import { components } from "@/types/api";
import { useUpdateReservation } from "../../../_hooks/useReservations";
import { EditReservationForm } from "./EditReservationForm";
import { Quotation } from "@/app/(admin)/quotation/_types/quotation";
import { CreateReservationSchema, reservationSchema } from "../../../create/_schemas/createReservationSchema";

type ReservationDto = components["schemas"]["ReservationDto"];

interface EditReservationPageProps {
    reservationData: ReservationDto;
    quotationData: Quotation;
}

export default function EditReservationPage({ reservationData, quotationData }: EditReservationPageProps) {
    const router = useRouter();
    const updateReservation = useUpdateReservation();

    // Calcular el monto correcto de separación basado en la cotización
    const correctSeparationAmount = quotationData.finalPrice ? Math.round(quotationData.finalPrice * 0.10) : 0;

    const form = useForm<CreateReservationSchema>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            reservationDate: format(new Date(reservationData.reservationDate ?? ""), "yyyy-MM-dd"),
            amountPaid: correctSeparationAmount.toString(), // Usar el monto correcto calculado
            currency: reservationData.currency ?? "SOLES",
            paymentMethod: reservationData.paymentMethod ?? "CASH",
            bankName: reservationData.bankName ?? "",
            exchangeRate: reservationData.exchangeRate?.toString() ?? "3.75",
            expiresAt: format(new Date(reservationData.expiresAt ?? ""), "yyyy-MM-dd'T'HH:mm"),
            notified: reservationData.notified ?? false,
            schedule: reservationData.schedule ?? "",
            coOwners: reservationData.coOwners ? JSON.parse(reservationData.coOwners) : [],
        },
    });

    const onSubmit = async (data: CreateReservationSchema) => {
        try {
            // Prepare the reservation data
            const reservationUpdateData = {
                reservationDate: data.reservationDate,
                amountPaid: parseFloat(data.amountPaid),
                currency: data.currency as "SOLES" | "DOLARES",
                paymentMethod: data.paymentMethod as "CASH" | "BANK_DEPOSIT" | "BANK_TRANSFER",
                bankName: data.bankName ?? undefined,
                exchangeRate: parseFloat(data.exchangeRate),
                expiresAt: data.expiresAt,
                notified: data.notified,
                schedule: data.schedule ?? undefined,
                coOwners: data.coOwners && data.coOwners.length > 0 ? JSON.stringify(data.coOwners) : undefined,
            };

            await toast.promise(
                updateReservation.mutateAsync({
                    params: {
                        path: { id: reservationData.id! },
                    },
                    body: reservationUpdateData,
                }),
                {
                    loading: "Actualizando separación...",
                    success: "Separación actualizada exitosamente",
                    error: (error) => `Error al actualizar la separación: ${error.message ?? "Error desconocido"}`,
                }
            );

            router.push("/reservations");
        } catch (error) {
            console.error("Error updating reservation:", error);
        }
    };

    return (
        <EditReservationForm
            quotationData={quotationData}
            form={form}
            onSubmit={onSubmit}
            isPending={updateReservation.isPending}
        />
    );
}
