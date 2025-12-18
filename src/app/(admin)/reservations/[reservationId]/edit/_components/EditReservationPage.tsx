"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";

import { components } from "@/types/api";
import { EditReservationSchema, editReservationSchema } from "../_schemas/editReservationSchema";
import { UpdateReservation } from "../../../_actions/ReservationActions";
import { EditReservationForm } from "./EditReservationForm";
import { Quotation } from "@/app/(admin)/quotation/_types/quotation";

type ReservationDto = components["schemas"]["ReservationDto"];

interface EditReservationPageProps {
    reservationData: ReservationDto;
    quotationData: Quotation;
}

export default function EditReservationPage({ reservationData, quotationData }: EditReservationPageProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

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
        setIsPending(true);

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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [, error] = await UpdateReservation(reservationData.id!, reservationUpdateData as any);

            if (error) {
                toast.error(`Error al actualizar la separación: ${error.message || "Error desconocido"}`);
                return;
            }

            toast.success("Separación actualizada exitosamente");
            router.push("/reservations");
        } catch (error) {
            console.error("Error updating reservation:", error);
            toast.error("Error inesperado al actualizar la separación");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <EditReservationForm
            quotationData={quotationData}
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
        />
    );
}
