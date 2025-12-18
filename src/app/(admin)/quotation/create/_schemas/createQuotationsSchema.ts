import * as z from "zod";

export const quotationSchema = z.object({
    // Claves primarias requeridas (IDs para relaciones en la base de datos)
    leadId: z.string().min(1, { message: "El cliente es requerido" }),
    lotId: z.string().min(1, { message: "El lote es requerido" }),
    advisorId: z.string().min(1, { message: "El asesor es requerido" }),
    projectId: z.string().min(1, { message: "El proyecto es requerido" }),
    blockId: z.string().min(1, { message: "La manzana es requerida" }),

    // Campos financieros - IMPORTANTE: Todos son requeridos y con default para evitar undefined
    discount: z.string().min(0, { message: "El descuento no puede ser negativo" }),
    downPayment: z.string().min(1, { message: "El porcentaje inicial es requerido" }),
    monthsFinanced: z.string().min(1, { message: "Los meses a financiar son requeridos" }),
    exchangeRate: z.string().min(1, { message: "El tipo de cambio es requerido" }),

    // Fecha de cotización
    quotationDate: z.string().min(1, "Debes seleccionar una fecha válida"),

    // Información del lote para cálculos
    area: z.string().min(1, { message: "El área es requerida" }),
    pricePerM2: z.string().min(1, { message: "El precio por m² es requerido" }),

    // Valores calculados
    totalPrice: z.string().min(1, { message: "El precio total es requerido" }),
    finalPrice: z.string().min(1, { message: "El precio final es requerido" }),
    amountFinanced: z.string().min(1, { message: "El monto a financiar es requerido" }),
});

export type CreateQuotationSchema = z.infer<typeof quotationSchema>;
