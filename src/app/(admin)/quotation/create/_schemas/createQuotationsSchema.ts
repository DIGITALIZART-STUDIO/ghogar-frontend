import * as z from "zod";

export const quotationSchema = z.object({
    leadId: z.string().min(1, { message: "El cliente es requerido" }),
    projectName: z.string().min(1, { message: "El proyecto es requerido" }),
    totalPrice: z.string().min(1, { message: "El precio total es requerido" }),
    discount: z.string().optional(),
    finalPrice: z.string().min(1, { message: "El precio final es requerido" }),
    downPayment: z.string().min(1, { message: "El porcentaje inicial es requerido" }),
    amountFinanced: z.string().min(1, { message: "El monto a financiar es requerido" }),
    monthsFinanced: z.string().min(1, { message: "Los meses a financiar son requeridos" }),
    block: z.string().min(1, { message: "La manzana es requerida" }),
    lotNumber: z.string().min(1, { message: "El número de lote es requerido" }),
    area: z.string().min(1, { message: "El área es requerida" }),
    pricePerM2: z.string().min(1, { message: "El precio por m² es requerido" }),
    exchangeRate: z.string().min(1, { message: "El tipo de cambio es requerido" }),
    quotationDate: z
        .string({
            required_error: "La fecha de cotización es obligatoria",
        })
        .min(1, "Debes seleccionar una fecha válida"),
});

export type CreateQuotationSchema = z.infer<typeof quotationSchema>;
