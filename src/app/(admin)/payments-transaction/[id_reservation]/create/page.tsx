import React from "react";
import ManageStateCreateTransaction from "./_components/page/ManageStateCreateTransaction";

type CreatePaymentTransactionPageProps = {
  params: Promise<{ id_reservation: string }>;
};

export default async function CreatePaymentTransactionPage({ params }: CreatePaymentTransactionPageProps) {
    const { id_reservation: idReservation } = await params;

    return <ManageStateCreateTransaction id={idReservation} />;
}
