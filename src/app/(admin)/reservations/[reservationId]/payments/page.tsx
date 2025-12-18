import PaymentSchedulePageClient from "./_components/PaymentSchedulePageClient";

interface PaymentSchedulePageProps {
  params: Promise<{
    reservationId: string;
  }>;
}

export default async function PaymentSchedulePage({ params }: PaymentSchedulePageProps) {
  const { reservationId } = await params;

  return <PaymentSchedulePageClient reservationId={reservationId} />;
}
