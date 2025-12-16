import ManageStateUpdateTransaction from "./_components/page/ManageStateUpdateTransaction";

type UpdatePaymentTransactionPageProps = {
  params: Promise<{ id_reservation: string, id_payment: string }>;
};

export default async function UpdatePaymentTransactionPage({ params }: UpdatePaymentTransactionPageProps) {
    const { id_reservation: idReservation, id_payment: idPayment } = await params;

    return <ManageStateUpdateTransaction id={idReservation} idPayment={idPayment} />;
}
