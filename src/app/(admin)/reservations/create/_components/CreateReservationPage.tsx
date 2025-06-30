"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { CreateReservationSchema, reservationSchema } from "../_schemas/createReservationSchema";
import { CreateReservation } from "../../_actions/ReservationActions";
import { ReservationForm } from "./ReservationForm";
import { SummaryQuotation } from "@/app/(admin)/quotation/_types/quotation";

interface CreateReservationPageProps {
    quotationsData: Array<SummaryQuotation>;
}

export default function CreateReservationPage({ quotationsData }: CreateReservationPageProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<CreateReservationSchema>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            quotationId: "",
            reservationDate: "",
            amountPaid: "",
            // @ts-expect-error those damn uncontrolled inputs
            currency: "",
            // @ts-expect-error those damn uncontrolled inputs
            paymentMethod: "",
            bankName: "",
            exchangeRate: "",
            expiresAt: "",
            schedule: "",
        },
    });

    const onSubmit = async (data: CreateReservationSchema) => {
        setIsPending(true);

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
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [, error] = await CreateReservation(reservationData as any);

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
            // @ts-expect-error those damn uncontrolled inputs
            form={form}
            onSubmit={onSubmit}
            isPending={isPending}
        />
    );
}
