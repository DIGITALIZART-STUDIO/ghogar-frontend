"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";

import { components } from "@/types/api";
import { EditReservationSchema, editReservationSchema } from "../_schemas/editReservationSchema";
import { useUpdateReservation } from "../../../_hooks/useReservations";
import { EditReservationForm } from "./EditReservationForm";
import { Quotation } from "@/app/(admin)/quotation/_types/quotation";

type ReservationDto = components["schemas"]["ReservationDto"];

interface EditReservationPageProps {
    reservationData: ReservationDto;
    quotationData: Quotation;
}

export default function EditReservationPage({ reservationData, quotationData }: EditReservationPageProps) {
    const router = useRouter();
    const updateReservation = useUpdateReservation();

    const form = useForm<EditReservationSchema>({
        resolver: zodResolver(editReservationSchema),
        defaultValues: {
            reservationDate: format(new Date(reservationData.reservationDate ?? ""), "yyyy-MM-dd"),
            amountPaid: reservationData.amountPaid?.toString() ?? "",
            currency: reservationData.currency ?? "SOLES",
            status: reservationData.status ?? "ISSUED",
            paymentMethod: reservationData.paymentMethod ?? "CASH",
            bankName: reservationData.bankName ?? "",
            exchangeRate: reservationData.exchangeRate?.toString() ?? "3.75",
            expiresAt: format(new Date(reservationData.expiresAt ?? ""), "yyyy-MM-dd'T'HH:mm"),
            notified: reservationData.notified ?? false,
            schedule: reservationData.schedule ?? "",
        },
    });

    const onSubmit = async (data: EditReservationSchema) => {
        try {
            // Prepare the reservation data
            const reservationUpdateData = {
                reservationDate: data.reservationDate,
                amountPaid: parseFloat(data.amountPaid),
                currency: data.currency as "SOLES" | "DOLARES",
                status: data.status as "ISSUED" | "CANCELED" | "ANULATED",
                paymentMethod: data.paymentMethod as "CASH" | "BANK_DEPOSIT" | "BANK_TRANSFER",
                bankName: data.bankName ?? undefined,
                exchangeRate: parseFloat(data.exchangeRate),
                expiresAt: data.expiresAt,
                notified: data.notified,
                schedule: data.schedule ?? undefined,
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
