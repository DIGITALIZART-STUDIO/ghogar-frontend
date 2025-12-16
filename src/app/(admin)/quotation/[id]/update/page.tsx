import UpdateQuotationPageClient from "../../_components/_page/UpdateQuotationPageClient";

export default async function UpdateQuotationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <UpdateQuotationPageClient quotationId={id} />;
}
