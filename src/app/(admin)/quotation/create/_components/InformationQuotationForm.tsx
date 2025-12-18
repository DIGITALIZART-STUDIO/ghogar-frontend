import { useState } from "react";
import { format, parse } from "date-fns";
import { CreditCard, DollarSign, FileText, MapPin, RefreshCcw, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { ProjectSearch } from "@/app/(admin)/admin/projects/_components/search/ProjectSearch";
import { BlockSearch } from "@/app/(admin)/admin/projects/[id]/blocks/_components/search/BlockSearch";
import { LotSearch } from "@/app/(admin)/admin/projects/[id]/blocks/[blockId]/lots/_components/search/LotSearch";
import { UserGetDTO } from "@/app/(admin)/admin/users/_types/user";
import { LeadSearch } from "@/app/(admin)/leads/_components/search/LeadSearch";
import { LogoSunat } from "@/assets/icons/LogoSunat";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CreateQuotationSchema } from "../_schemas/createQuotationsSchema";
import { useCurrentExchangeRate } from "../../_hooks/useExchangeRate";
import { DiscountApprovalDialog } from "./DiscountApprovalDialog";

interface InformationQuotationFormProps {
  form: UseFormReturn<CreateQuotationSchema>;
  setProjectName: (name: string) => void;
  setBlockName: (name: string) => void;
  setLotNumber: (number: string) => void;
  userData: UserGetDTO;
  setSelectedLead: (lead: { name: string; code: string } | null) => void;
}

export default function InformationQuotationForm({
  form,
  setProjectName,
  setBlockName,
  setLotNumber,
  userData,
  setSelectedLead,
}: InformationQuotationFormProps) {
  const [isDiscountApproved, setIsDiscountApproved] = useState(false);

  // Hook para obtener el tipo de cambio
  const exchangeRateQuery = useCurrentExchangeRate();

  // Función para manejar el clic del botón
  const handleGetExchangeRate = () => {
    if (exchangeRateQuery.isLoading) {
      toast.info("Obteniendo tipo de cambio...");
      return;
    }

    if (exchangeRateQuery.data?.exchangeRate) {
      const exchangeRateValue = exchangeRateQuery.data.exchangeRate;
      form.setValue("exchangeRate", String(exchangeRateValue));
      toast.success(`Tipo de cambio obtenido: ${exchangeRateValue} (${exchangeRateQuery.data.source})`);
    } else if (exchangeRateQuery.error) {
      toast.error("Error al obtener el tipo de cambio de SUNAT");
    } else {
      // Si no hay datos, intentar obtenerlos
      exchangeRateQuery.refetch();
      toast.info("Obteniendo tipo de cambio de SUNAT...");
    }
  };
  return (
    <div className="lg:col-span-2">
      {/* Sección superior - Información básica */}
      <div className="rounded-xl overflow-hidden mb-8 border-2 bg-card border-secondary">
        <div className="flex items-center justify-between p-6 bg-primary/10 dark:bg-primary/90 border-b">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-600 dark:text-gray-800 mr-3" />
            <h2 className="text-lg font-semibold text-gray-800">Información de Cotización</h2>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="quotationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex items-center" required>
                  Fecha
                </FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = format(date, "yyyy-MM-dd");
                        field.onChange(formattedDate);
                      } else {
                        field.onChange("");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exchangeRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center" required>
                  Tipo de Cambio
                </FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      placeholder="Ingrese el tipo de cambio"
                      {...field}
                      type="number"
                      min={0}
                      step={0.01}
                      className="w-full"
                      disabled={exchangeRateQuery.isLoading}
                    />
                  </FormControl>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={handleGetExchangeRate}
                          disabled={exchangeRateQuery.isLoading}
                        >
                          {exchangeRateQuery.isLoading ? (
                            <RefreshCcw className="h-4 w-4 animate-spin" />
                          ) : (
                            <LogoSunat className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Obtener Tipo de Cambio de SUNAT</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Sección principal - Nuevo diseño innovador sin columnas */}
      <div className="rounded-xl overflow-hidden mb-8 bg-card border border-secondary">
        <div className="p-6 bg-primary/10 dark:bg-primary/90 border-b flex items-center">
          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-800 mr-3" />
          <h2 className="text-lg font-semibold text-gray-800">Datos de la Cotización</h2>
        </div>

        <div className="p-6">
          {/* Sección Cliente - Diseño de tarjeta horizontal */}
          <div className="mb-8 bg-card rounded-xl border-slate-100 border">
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 p-4 rounded-t-xl">
              <User className="h-6 w-6 mr-3" />
              <h3 className="text-lg font-semibold">Información del Cliente</h3>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="leadId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300" required>
                        Nombre del Cliente
                      </FormLabel>
                      <FormControl>
                        <LeadSearch
                          value={field.value ?? ""}
                          onSelect={(leadId, lead) => {
                            // Actualizar el valor del campo directamente
                            field.onChange(leadId);

                            // Actualizar el estado del lead seleccionado para el resumen
                            setSelectedLead({
                              name: lead.client?.name ?? "Cliente sin nombre",
                              code: lead.code ?? "Lead sin código",
                            });
                          }}
                          placeholder="Seleccione un cliente"
                          searchPlaceholder="Buscar por código, cliente, proyecto..."
                          emptyMessage="No se encontró el cliente"
                          preselectedId={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Proyecto - Usando ProjectSearch */}
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300" required>
                        Proyecto
                      </FormLabel>
                      <FormControl>
                        <ProjectSearch
                          value={field.value ?? ""}
                          onSelect={(projectId, project) => {
                            // Actualizar el valor del campo directamente
                            field.onChange(projectId);

                            // Para mostrar el nombre del proyecto en el resumen
                            setProjectName(project.name ?? "");

                            // Resetear valores dependientes
                            form.setValue("blockId", "");
                            form.setValue("lotId", "");

                            // Establecer valores por defecto del proyecto seleccionado
                            if (project.defaultDownPayment) {
                              form.setValue("downPayment", project.defaultDownPayment.toString());
                            }
                            if (project.defaultFinancingMonths) {
                              form.setValue("monthsFinanced", project.defaultFinancingMonths.toString());
                            }

                            // Limpiar campos del lote
                            form.setValue("area", "");
                            form.setValue("pricePerM2", "");
                          }}
                          placeholder="Seleccione un proyecto"
                          searchPlaceholder="Buscar por nombre, ubicación..."
                          emptyMessage="No hay proyectos disponibles"
                          preselectedId={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Sección Lote - Diseño de tarjeta horizontal */}
          <div className="mb-8 bg-card border-amber-100 border rounded-xl">
            <div className="flex items-center bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 p-4 rounded-t-xl">
              <MapPin className="h-6 w-6 mr-3" />
              <h3 className="text-lg font-semibold">Información del Lote</h3>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manzana - Ahora es un autocomplete */}

                <FormField
                  control={form.control}
                  name="blockId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-700 dark:text-amber-300" required>
                        Manzana
                      </FormLabel>
                      <FormControl>
                        <BlockSearch
                          projectId={form.watch("projectId") ?? ""}
                          value={field.value ?? ""}
                          onSelect={(blockId, block) => {
                            // Actualizar el valor del campo directamente
                            field.onChange(blockId);

                            // Para mostrar el nombre del bloque en el resumen
                            setBlockName(block.name ?? "");

                            // Resetear lote
                            form.setValue("lotId", "");

                            // Limpiar campos del lote
                            form.setValue("area", "");
                            form.setValue("pricePerM2", "");
                          }}
                          placeholder="Seleccione una manzana"
                          searchPlaceholder="Buscar por nombre de manzana..."
                          emptyMessage="No hay manzanas disponibles en este proyecto"
                          preselectedId={field.value}
                          disabled={!form.watch("projectId")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Lote - Ahora es un autocomplete */}
                <FormField
                  control={form.control}
                  name="lotId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-700 dark:text-amber-300" required>
                        Lote
                      </FormLabel>
                      <FormControl>
                        <LotSearch
                          blockId={form.watch("blockId") ?? ""}
                          value={field.value ?? ""}
                          onSelect={(lotId, lot) => {
                            // Actualizar el valor del campo directamente
                            field.onChange(lotId);

                            // Para mostrar el número del lote en el resumen
                            setLotNumber(lot.lotNumber ?? "");

                            // Actualizar campos del lote
                            form.setValue("area", lot.area?.toString() ?? "");
                            form.setValue("pricePerM2", lot.pricePerSquareMeter?.toString() ?? "");
                          }}
                          placeholder="Seleccione un lote"
                          searchPlaceholder="Buscar por número de lote, área, precio..."
                          emptyMessage="No hay lotes disponibles en esta manzana"
                          preselectedId={field.value}
                          disabled={!form.watch("blockId")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-700 dark:text-amber-300" required>
                        Área (m²)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese el área"
                          {...field}
                          className="border-amber-200 focus:border-amber-500"
                          readOnly={!!form.watch("lotId")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricePerM2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-700 dark:text-amber-300" required>
                        Precio por m²
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese el precio por m²"
                          {...field}
                          className="border-amber-200 focus:border-amber-500"
                          readOnly={!!form.watch("lotId")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Sección Financiamiento - Diseño de tarjeta horizontal */}
          <div className="mb-6 bg-card border border-emerald-100 rounded-xl">
            <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 p-4 rounded-t-xl">
              <DollarSign className="h-6 w-6 mr-3" />
              <h3 className="text-lg font-semibold">Información de Financiamiento</h3>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => {
                        // Verificar si el usuario es SalesAdvisor
                        const isSalesAdvisor = userData?.roles?.[0] === "SalesAdvisor";

                        // Calcular el descuento máximo permitido solo para SalesAdvisor no aprobado
                        // Nota: El maxDiscountPercentage se obtendrá del proyecto seleccionado
                        // Por ahora usamos un valor predeterminado del 15%
                        const maxDiscount = 15; // Valor predeterminado del 15% si no hay configuración

                        // Solo aplicar límite si es SalesAdvisor y no está aprobado
                        const shouldApplyLimit = isSalesAdvisor && !isDiscountApproved;

                        return (
                          <FormItem>
                            <FormLabel className="text-emerald-700 dark:text-emerald-300" required>
                              Descuento {shouldApplyLimit ? `(Máx: ${maxDiscount}%)` : "(Máx: 100%)"}
                              {userData?.roles?.[0] === "SalesAdvisor" && !isDiscountApproved && (
                                <span className="ml-2 text-xs text-orange-600 dark:text-orange-400 font-normal">
                                  (Requiere aprobación)
                                </span>
                              )}
                              {userData?.roles?.[0] === "SalesAdvisor" && isDiscountApproved && (
                                <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-normal">
                                  ✓ Aprobado
                                </span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingrese el descuento"
                                type="number"
                                className="border-emerald-200 focus:border-emerald-500"
                                {...field}
                                value={field.value || ""}
                                disabled={userData?.roles?.[0] === "SalesAdvisor" && !isDiscountApproved}
                                onChange={(e) => {
                                  // Permitir campo vacío
                                  if (e.target.value === "") {
                                    field.onChange("");
                                    return;
                                  }

                                  const numericValue = parseFloat(e.target.value);

                                  // Verificar si es un número válido
                                  if (!isNaN(numericValue)) {
                                    // Límite máximo del 100% para todos
                                    if (numericValue > 100) {
                                      field.onChange("100");
                                      toast.warning("El descuento máximo permitido es del 100%");
                                      return;
                                    }

                                    // Solo aplicar límite si es SalesAdvisor no aprobado
                                    if (shouldApplyLimit && numericValue > maxDiscount) {
                                      field.onChange(maxDiscount.toString());
                                      toast.warning(
                                        `El descuento ha sido ajustado al máximo permitido: ${maxDiscount}%`
                                      );
                                    } else {
                                      // Caso normal: aceptar el valor ingresado
                                      field.onChange(e.target.value);
                                    }
                                  }
                                }}
                                min="0"
                                max="100"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <div>
                    <DiscountApprovalDialog
                      userData={userData}
                      isDiscountApproved={isDiscountApproved}
                      onDiscountApproved={() => setIsDiscountApproved(true)}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="downPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-700 dark:text-emerald-300" required>
                        Inicial (%)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese el porcentaje inicial"
                          {...field}
                          className="border-emerald-200 focus:border-emerald-500"
                          readOnly={!!form.watch("projectId") && !!form.watch("downPayment")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthsFinanced"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-emerald-700 dark:text-emerald-300" required>
                        Meses a Financiar
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese los meses a financiar"
                          {...field}
                          className="border-emerald-200 focus:border-emerald-500"
                          readOnly={!!form.watch("projectId") && !!form.watch("monthsFinanced")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección inferior - Campos calculados */}
      <div className="mt-8 bg-card rounded-xl overflow-hidden">
        <div className="p-6 bg-foreground dark:bg-white text-white dark:text-input border-b">
          <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-800">Resumen Financiero</h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-gray-700 dark:text-gray-200" required>
                  <DollarSign className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-200" />
                  Precio Total
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el precio total"
                    {...field}
                    className="bg-gray-50"
                    readOnly={!!(form.watch("area") && form.watch("pricePerM2"))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center font-medium text-gray-700 dark:text-gray-200" required>
                  <DollarSign className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-200" />
                  Precio Final
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el precio final"
                    {...field}
                    className="bg-gray-50 font-medium"
                    readOnly={!!(form.watch("totalPrice") && form.watch("discount"))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amountFinanced"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-gray-700 dark:text-gray-200" required>
                  <CreditCard className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-200" />
                  Monto a Financiar
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el monto a financiar"
                    {...field}
                    className="bg-gray-50"
                    readOnly={!!(form.watch("finalPrice") && form.watch("downPayment"))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
