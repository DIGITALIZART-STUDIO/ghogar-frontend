import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UserGetDTO } from "@/app/(admin)/admin/users/_types/user";
import { CreateQuotationSchema, quotationSchema } from "../_schemas/createQuotationsSchema";
import { useCreateQuotation } from "../../_hooks/useQuotations";
import { QuotationForm } from "./QuotationForm";

interface CreateClientQuotationPageProps {
  userData: UserGetDTO;
}

export default function CreateClientQuotationPage({ userData }: CreateClientQuotationPageProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Hook de React Query para crear cotización
  const createQuotationMutation = useCreateQuotation();

  const form = useForm<CreateQuotationSchema>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      leadId: "",
      lotId: "",
      projectId: "",
      blockId: "",
      discount: "0",
      downPayment: "20",
      monthsFinanced: "36",
      exchangeRate: "3.75",
      quotationDate: new Date().toISOString().split("T")[0],
      area: "",
      pricePerM2: "",
      totalPrice: "",
      finalPrice: "",
      amountFinanced: "",
    },
  });

  const onSubmit = async (input: CreateQuotationSchema) => {
    // Prepara los datos para el backend
    const quotationData = {
      leadId: input.leadId,
      lotId: input.lotId,
      discount: parseFloat(input.discount),
      downPayment: parseFloat(input.downPayment),
      monthsFinanced: parseInt(input.monthsFinanced, 10),
      exchangeRate: parseFloat(input.exchangeRate),
      quotationDate: input.quotationDate,
    };

    // Usa el mutation del hook
    const promise = createQuotationMutation.mutateAsync({
      body: quotationData,
    });

    toast.promise(promise, {
      loading: "Creando cotización...",
      success: "Cotización creada exitosamente",
      error: (e) => `Error al crear cotización: ${e.message}`,
    });

    try {
      await promise;
      setIsSuccess(true);
    } catch {
      // Error ya manejado por toast.promise
    }
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      router.push("/quotation");
      setIsSuccess(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, form]);

  return (
    <QuotationForm form={form} isPending={createQuotationMutation.isPending} onSubmit={onSubmit} userData={userData} />
  );
}
