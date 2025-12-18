"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, CreditCard, DollarSign, FileText, MapPin, RefreshCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { UserGetDTO } from "@/app/(admin)/admin/users/_types/user";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CreateQuotationSchema } from "../_schemas/createQuotationsSchema";
import InformationQuotationForm from "./InformationQuotationForm";

interface QuotationFormProps {
  form: UseFormReturn<CreateQuotationSchema>;
  onSubmit: (data: CreateQuotationSchema) => void;
  isPending: boolean;
  initialSelection?: {
    projectId?: string;
    blockId?: string;
    lotId?: string;
  };
  userData: UserGetDTO;
  // Props opcionales para el modo de edición
  projectName?: string;
  blockName?: string;
  lotNumber?: string;
  selectedLead?: { name: string; code: string } | null;
  setProjectName?: (name: string) => void;
  setBlockName?: (name: string) => void;
  setLotNumber?: (number: string) => void;
  setSelectedLead?: (lead: { name: string; code: string } | null) => void;
}

export function QuotationForm({
  form,
  onSubmit,
  isPending,
  initialSelection,
  userData,
  // Props opcionales para el modo de edición
  projectName: propProjectName,
  blockName: propBlockName,
  lotNumber: propLotNumber,
  selectedLead: propSelectedLead,
  setProjectName: propSetProjectName,
  setBlockName: propSetBlockName,
  setLotNumber: propSetLotNumber,
  setSelectedLead: propSetSelectedLead,
}: QuotationFormProps) {
  const router = useRouter();

  // Estados para los nombres visuales que se mostrarán en el resumen
  const [projectName, setProjectName] = useState(propProjectName ?? "");
  const [blockName, setBlockName] = useState(propBlockName ?? "");
  const [lotNumber, setLotNumber] = useState(propLotNumber ?? "");

  // Estados para almacenar información del lead seleccionado
  const [selectedLead, setSelectedLead] = useState<{ name: string; code: string } | null>(propSelectedLead ?? null);

  // Usar los setters de props si están disponibles, sino usar los locales
  const finalSetProjectName = propSetProjectName ?? setProjectName;
  const finalSetBlockName = propSetBlockName ?? setBlockName;
  const finalSetLotNumber = propSetLotNumber ?? setLotNumber;
  const finalSetSelectedLead = propSetSelectedLead ?? setSelectedLead;

  const area = form.watch("area");
  const pricePerM2 = form.watch("pricePerM2");
  const discount = form.watch("discount");
  const downPayment = form.watch("downPayment");

  // Los datos de bloques y lotes ahora se manejan directamente en los componentes de búsqueda

  // Inicializar nombres de bloque y lote si estamos en modo edición
  useEffect(() => {
    if (initialSelection) {
      if (initialSelection.blockId) {
        // El nombre del bloque se establecerá cuando se seleccione en BlockSearch
      }
      if (initialSelection.lotId) {
        // El número del lote se establecerá cuando se seleccione en LotSearch
      }
    }
  }, [initialSelection]);

  // Los campos del formulario ahora se actualizan directamente en LotSearch

  // Sincronizar valores cuando cambien los props (modo edición)
  useEffect(() => {
    if (propProjectName !== undefined) {
      setProjectName(propProjectName);
    }
    if (propBlockName !== undefined) {
      setBlockName(propBlockName);
    }
    if (propLotNumber !== undefined) {
      setLotNumber(propLotNumber);
    }
    if (propSelectedLead !== undefined) {
      setSelectedLead(propSelectedLead);
    }
  }, [propProjectName, propBlockName, propLotNumber, propSelectedLead]);

  // Calcular valores automáticamente
  useEffect(() => {
    const area = Number.parseFloat(form.watch("area") ?? "0");
    const pricePerM2 = Number.parseFloat(form.watch("pricePerM2") ?? "0");
    const discount = Number.parseFloat(form.watch("discount") ?? "0");
    const downPayment = Number.parseFloat(form.watch("downPayment") ?? "0");

    if (area && pricePerM2) {
      const totalPrice = (area * pricePerM2).toFixed(2);
      form.setValue("totalPrice", totalPrice);

      const finalPrice = (area * pricePerM2 - discount).toFixed(2);
      form.setValue("finalPrice", finalPrice);

      // CORRECCIÓN: Usar finalPrice en lugar de recalcular
      const amountFinanced = (parseFloat(finalPrice) * (1 - downPayment / 100)).toFixed(2);
      form.setValue("amountFinanced", amountFinanced);
    }
  }, [area, pricePerM2, discount, downPayment, form]);

  // Calcular cuota mensual
  const calculateMonthlyPayment = () => {
    const amountFinanced = Number.parseFloat(form.watch("amountFinanced") ?? "0");
    const monthsFinanced = Number.parseInt(form.watch("monthsFinanced") ?? "0", 10);

    if (amountFinanced && monthsFinanced) {
      return Math.round(amountFinanced / monthsFinanced);
    }
    return 0;
  };

  // Calcular monto del adelanto
  const calculateDownPaymentAmount = () => {
    const finalPrice = Number.parseFloat(form.watch("finalPrice") ?? "0");
    const downPayment = Number.parseFloat(form.watch("downPayment") ?? "0");

    if (finalPrice && downPayment) {
      return Math.round(finalPrice * (downPayment / 100));
    }
    return 0;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información principal */}
          <InformationQuotationForm
            form={form}
            setProjectName={finalSetProjectName}
            setBlockName={finalSetBlockName}
            setLotNumber={finalSetLotNumber}
            userData={userData}
            setSelectedLead={finalSetSelectedLead}
          />

          {/* Columna derecha - Resumen visual */}
          <div>
            <div className="sticky top-4">
              <div className="bg-card rounded-xl overflow-hidden">
                <div className="p-5 bg-foreground dark:bg-white text-white dark:text-input">
                  <h3 className="text-lg font-semibold">Resumen de Cotización</h3>
                </div>

                <div className="p-5 space-y-6">
                  {/* Información básica */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-200 mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Información Básica
                    </h4>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-slate-500 dark:text-slate-400">Cliente:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {selectedLead?.name ?? "—"}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">Proyecto:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {projectName || "—"}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">Fecha:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {form.watch("quotationDate")
                            ? format(parseISO(form.watch("quotationDate")), "dd/MM/yyyy", { locale: es })
                            : "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información del lote */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-200 mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Información del Lote
                    </h4>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-amber-700 dark:text-amber-300">Ubicación:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {blockName && lotNumber ? `Manzana ${blockName}, Lote ${lotNumber}` : "—"}
                        </div>
                        <div className="text-amber-700 dark:text-amber-300">Área:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {form.watch("area") ? `${form.watch("area")} m²` : "—"}
                        </div>
                        <div className="text-amber-700 dark:text-amber-300">Precio/m²:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {form.watch("pricePerM2") ? `$${form.watch("pricePerM2")}` : "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información financiera */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-200 mb-3 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Información Financiera
                    </h4>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-emerald-700 dark:text-emerald-300">Precio Total:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {form.watch("totalPrice") ? `$${form.watch("totalPrice")}` : "—"}
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-300">Descuento:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {form.watch("discount") ? `$${form.watch("discount")}` : "—"}
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-300 font-medium">Precio Final:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {form.watch("finalPrice") ? `$${form.watch("finalPrice")}` : "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de financiamiento */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-200 mb-3 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Plan de Financiamiento
                    </h4>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-slate-700 dark:text-slate-300">Inicial:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {form.watch("downPayment") ? `${form.watch("downPayment")}%` : "—"}
                        </div>
                        <div className="text-slate-700 dark:text-slate-300">Monto Inicial:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {form.watch("finalPrice") && form.watch("downPayment")
                            ? `$${calculateDownPaymentAmount().toLocaleString()}`
                            : "—"}
                        </div>
                        <div className="text-slate-700 dark:text-slate-300">A Financiar:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {form.watch("amountFinanced") ? `$${form.watch("amountFinanced")}` : "—"}
                        </div>
                        <div className="text-slate-700 dark:text-slate-300">Plazo:</div>
                        <div className="font-medium text-right text-slate-900 dark:text-slate-100">
                          {form.watch("monthsFinanced") ? `${form.watch("monthsFinanced")} meses` : "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cuota mensual */}
                  {form.watch("amountFinanced") && form.watch("monthsFinanced") && (
                    <div className="bg-slate-800 dark:bg-slate-700 text-white rounded-lg p-4 text-center">
                      <div className="text-sm mb-1">Cuota Mensual Estimada</div>
                      <div className="text-2xl font-bold">${calculateMonthlyPayment()}</div>
                    </div>
                  )}

                  {/* Validez */}
                  {form.watch("quotationDate") && (
                    <div className="text-xs text-center text-slate-500 dark:text-slate-400 pt-2">
                      Válido hasta:{" "}
                      {format(
                        new Date(
                          new Date(form.watch("quotationDate")).setDate(
                            new Date(form.watch("quotationDate")).getDate() + 5
                          )
                        ),
                        "dd/MM/yyyy"
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-6 flex flex-col space-y-2">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  Guardar Cotización
                </Button>
                <Button variant="outline" type="button" onClick={() => router.push("/quotation")} className="w-full">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
