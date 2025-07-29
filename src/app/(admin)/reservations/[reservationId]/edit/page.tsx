import EditReservationPageClient from "./_components/EditReservationPageClient";

interface AsyncWrapperProps {
    params: Promise<{ reservationId: string }>;
}

export default async function EditReservationPageWrapper({ params }: AsyncWrapperProps) {
    const { reservationId } = await params;
    return <EditReservationPageClient reservationId={reservationId} />;
}
