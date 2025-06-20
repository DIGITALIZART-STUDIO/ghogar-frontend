/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format, parse, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, CreditCard, DollarSign, FileText, MapPin, RefreshCcw, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { GetActiveProjects } from "@/app/(admin)/admin/projects/_actions/ProjectActions";
import { GetActiveBlocksByProject } from "@/app/(admin)/admin/projects/[id]/blocks/_actions/BlockActions";
import { GetLotsByBlock } from "@/app/(admin)/admin/projects/lots/_actions/LotActions";
import { SummaryLead } from "@/app/(admin)/leads/_types/lead";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toastWrapper } from "@/types/toasts";
import { CreateQuotationSchema } from "../_schemas/createQuotationsSchema";
import { GetCurrentExchangeRate } from "../../_actions/ExchangeRateActions";
import { LogoSunat } from "@/assets/icons/LogoSunat";

interface QuotationFormProps {
  leadsData: Array<SummaryLead>;
  form: UseFormReturn<CreateQuotationSchema>;
  onSubmit: (data: CreateQuotationSchema) => void;
  isPending: boolean;
  initialSelection?: {
    projectId?: string;
    blockId?: string;
    lotId?: string;
  };
}

export function QuotationForm({ leadsData, form, onSubmit, isPending, initialSelection }: QuotationFormProps) {
    const router = useRouter();

    // Estados para las opciones
    const [projects, setProjects] = useState<Array<Option>>([]);
    const [blocks, setBlocks] = useState<Array<Option>>([]);
    const [lots, setLots] = useState<Array<Option>>([]);

    // Estados para loading
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingBlocks, setLoadingBlocks] = useState(false);
    const [loadingLots, setLoadingLots] = useState(false);

    // Estados para los nombres visuales que se mostrarán en el resumen
    const [projectName, setProjectName] = useState("");
    const [blockName, setBlockName] = useState("");
    const [lotNumber, setLotNumber] = useState("");

    // Inicializar estos valores si estamos en modo edición
    useEffect(() => {
        if (initialSelection) {
            // Buscar los nombres correspondientes
            if (initialSelection.projectId) {
                const project = projects.find((p) => p.value === initialSelection.projectId);
                if (project) {
                    setProjectName(project.label);
                }
            }

            if (initialSelection.blockId) {
                const block = blocks.find((b) => b.value === initialSelection.blockId);
                if (block) {
                    setBlockName(block.label);
                }
            }

            if (initialSelection.lotId) {
                const lot = lots.find((l) => l.value === initialSelection.lotId);
                if (lot) {
                    setLotNumber(lot.label);
                }
            }
        }
    }, [initialSelection, projects, blocks, lots]);

    // Opciones para clientes
    const leadsOptions = leadsData.map((lead) => ({
        value: lead.id ?? "",
        label: lead.client?.dni
            ? `${lead.client.dni} - ${lead.client.name}`
            : lead.client?.ruc
                ? `${lead.client.ruc} - ${lead.client.name}`
                : (lead.client?.name ?? ""),
    }));

    // Cargar proyectos activos al inicio
    useEffect(() => {
        const fetchProjects = async () => {
            setLoadingProjects(true);
            const [result] = await GetActiveProjects();

            if (result) {
                const projectOptions = result.map((project) => ({
                    value: project.id ?? "",
                    label: project.name ?? "",
                    location: project.location ?? "",
                    // Agregar los campos de financiación por defecto
                    defaultDownPayment: project.defaultDownPayment?.toString() ?? "",
                    defaultFinancingMonths: project.defaultFinancingMonths?.toString() ?? "",
                }));
                setProjects(projectOptions);
            } else {
                toast.error("Error al cargar los proyectos");
            }
            setLoadingProjects(false);
        };

        fetchProjects();
    }, []);

    // Cargar bloques cuando se selecciona un proyecto
    useEffect(() => {
        const fetchBlocks = async () => {
            const projectId = form.watch("projectId");
            if (!projectId) {
                setBlocks([]);
                return;
            }

            setLoadingBlocks(true);
            const [result] = await GetActiveBlocksByProject(projectId);

            if (result) {
                const blockOptions = result.map((block) => ({
                    value: block.id ?? "",
                    label: block.name ?? "",
                    projectId: block.projectId ?? "",
                    projectName: block.projectName ?? "",
                }));
                setBlocks(blockOptions);
            } else {
                toast.error("Error al cargar las manzanas");
            }
            setLoadingBlocks(false);
        };

        fetchBlocks();
    }, [form.watch("projectId")]);

    // Cargar lotes cuando se selecciona un bloque
    useEffect(() => {
        const fetchLots = async () => {
            const blockId = form.watch("blockId");
            if (!blockId) {
                setLots([]);
                return;
            }

            setLoadingLots(true);
            const [result] = await GetLotsByBlock(blockId);

            if (result) {
                const lotOptions = result.map((lot) => ({
                    value: lot.id ?? "",
                    label: lot.lotNumber ?? "",
                    area: lot.area?.toString() ?? "",
                    price: lot.price?.toString() ?? "",
                    pricePerM2: lot.area && lot.price ? (lot.price / lot.area).toString() : "",
                    blockId: lot.blockId ?? "",
                    blockName: lot.blockName ?? "",
                    projectId: lot.projectId ?? "",
                    projectName: lot.projectName ?? "",
                }));
                setLots(lotOptions);
            } else {
                toast.error("Error al cargar los lotes");
            }
            setLoadingLots(false);
        };

        fetchLots();
    }, [form.watch("blockId")]);

    // Actualizar los campos del formulario cuando se selecciona un lote
    useEffect(() => {
        const selectedLotId = form.watch("lotId");
        if (!selectedLotId) {
            return;
        }

        const selectedLot = lots.find((lot) => lot.value === selectedLotId);
        if (!selectedLot) {
            return;
        }

        // Actualizar los campos con la información del lote
        form.setValue("area", selectedLot.area);
        form.setValue("pricePerM2", selectedLot.pricePerM2);

        // Actualizar los estados visuales
        setLotNumber(selectedLot.label);
        setBlockName(selectedLot.blockName);
        setProjectName(selectedLot.projectName);
    }, [form.watch("lotId"), lots, form]);

    // Calcular valores automáticamente
    useEffect(() => {
        const area = Number.parseFloat(form.watch("area") ?? "0");
        const pricePerM2 = Number.parseFloat(form.watch("pricePerM2") ?? "0");
        // Aquí está el cambio principal para manejar el discount correctamente
        const discount = Number.parseFloat(form.watch("discount") ?? "0");
        const downPayment = Number.parseFloat(form.watch("downPayment") ?? "0");

        if (area && pricePerM2) {
            const totalPrice = (area * pricePerM2).toString();
            form.setValue("totalPrice", totalPrice);

            const finalPrice = (area * pricePerM2 - discount).toString();
            form.setValue("finalPrice", finalPrice);

            const amountFinanced = ((area * pricePerM2 - discount) * (1 - downPayment / 100)).toString();
            form.setValue("amountFinanced", amountFinanced);
        }
    }, [form.watch("area"), form.watch("pricePerM2"), form.watch("discount"), form.watch("downPayment"), form]);

    // Calcular cuota mensual
    const calculateMonthlyPayment = () => {
        const amountFinanced = Number.parseFloat(form.watch("amountFinanced") ?? "0");
        const monthsFinanced = Number.parseInt(form.watch("monthsFinanced") ?? "0", 10);

        if (amountFinanced && monthsFinanced) {
            return Math.round(amountFinanced / monthsFinanced);
        }
        return 0;
    };

    // Renderizar opciones personalizadas
    const renderProjectOption = (option: Option) => (
        <div>
            <div className="font-medium">{option.label}</div>
            {option.description && <div className="text-xs text-gray-500">{option.description}</div>}
        </div>
    );

    const renderBlockOption = (option: Option) => (
        <div>
            <div className="font-medium">{option.label}</div>
            <div className="text-xs text-gray-500">{option.projectName}</div>
        </div>
    );

    const renderLotOption = (option: Option) => (
        <div className="flex justify-between w-full">
            <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">
                    {option.blockName},{option.projectName}
                </div>
            </div>
            <div className="text-right">
                <div className="font-medium">{option.area} m²</div>
                <div className="text-xs text-emerald-600">
                    ${option.pricePerM2}
                    /m²
                </div>
            </div>
        </div>
    );

    const [isPendingExchangeRate, startTransitionExchangeRate] = useTransition();

    // Y luego añade esta función para manejar el clic del botón
    const handleGetExchangeRate = () => {
        startTransitionExchangeRate(async () => {
            const [exchangeRate, error] = await toastWrapper(GetCurrentExchangeRate(), {
                loading: "Obteniendo tipo de cambio...",
                success: "Tipo de cambio obtenido correctamente de SUNAT",
                error: (e) => `Error al obtener tipo de cambio: ${e.message}`,
            });

            if (!error && exchangeRate) {
                form.setValue("exchangeRate", exchangeRate.toString());
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda - Información principal */}
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
                                            <FormLabel className="flex items-center">Fecha</FormLabel>
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
                                            <FormLabel className="flex items-center">Tipo de Cambio</FormLabel>
                                            <div className="flex items-center gap-2">
                                                <FormControl>
                                                    <Input
                                                        placeholder="3.75"
                                                        {...field}
                                                        type="number"
                                                        min={0}
                                                        step={0.01}
                                                        className="w-full"
                                                        disabled={isPendingExchangeRate}
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
                                                                disabled={isPendingExchangeRate}
                                                            >
                                                                {isPendingExchangeRate ? (
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
                                <div className="mb-8 bg-card rounded-xl border-blue-100 border">
                                    <div className="flex items-center bg-blue-500 text-white p-4 rounded-t-xl">
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
                                                        <FormLabel className="text-blue-700">Nombre del Cliente</FormLabel>
                                                        <AutoComplete
                                                            options={leadsOptions}
                                                            emptyMessage="No se encontró el cliente."
                                                            placeholder="Seleccione un cliente"
                                                            onValueChange={(selectedOption) => {
                                                                field.onChange(selectedOption?.value ?? "");
                                                            }}
                                                            value={leadsOptions.find((option) => option.value === field.value) ?? undefined}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Proyecto - Ahora es un autocomplete */}
                                            <FormField
                                                control={form.control}
                                                name="projectId" // Cambio: usar directamente projectId en vez de projectName
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-blue-700">Proyecto</FormLabel>
                                                        <AutoComplete
                                                            options={projects}
                                                            emptyMessage="No hay proyectos disponibles"
                                                            placeholder="Seleccione un proyecto"
                                                            isLoading={loadingProjects}
                                                            value={projects.find((project) => project.value === field.value)}
                                                            onValueChange={(selectedOption) => {
                                                                // Actualizar el valor del campo directamente
                                                                field.onChange(selectedOption?.value ?? "");

                                                                // Para mostrar el nombre del proyecto en el resumen
                                                                setProjectName(selectedOption?.label ?? "");

                                                                // Resetear valores dependientes

                                                                form.setValue("blockId", "");
                                                                form.setValue("lotId", "");

                                                                // Establecer valores por defecto del proyecto seleccionado
                                                                if (selectedOption?.defaultDownPayment) {
                                                                    form.setValue("downPayment", selectedOption.defaultDownPayment);
                                                                }
                                                                if (selectedOption?.defaultFinancingMonths) {
                                                                    form.setValue("monthsFinanced", selectedOption.defaultFinancingMonths);
                                                                }

                                                                // Limpiar campos del lote
                                                                form.setValue("area", "");
                                                                form.setValue("pricePerM2", "");
                                                            }}
                                                            renderOption={renderProjectOption}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sección Lote - Diseño de tarjeta horizontal */}
                                <div className="mb-8 bg-card border-amber-100 border rounded-xl">
                                    <div className="flex items-center bg-amber-500 text-white p-4 rounded-t-xl">
                                        <MapPin className="h-6 w-6 mr-3" />
                                        <h3 className="text-lg font-semibold">Información del Lote</h3>
                                    </div>

                                    <div className="p-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Manzana - Ahora es un autocomplete */}

                                            <FormField
                                                control={form.control}
                                                name="blockId" // Cambio: usar directamente blockId en vez de block
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-amber-700">Manzana</FormLabel>
                                                        <AutoComplete
                                                            options={blocks}
                                                            emptyMessage={
                                                                field.value
                                                                    ? "No hay manzanas disponibles en este proyecto"
                                                                    : "Seleccione primero un proyecto"
                                                            }
                                                            placeholder="Seleccione una manzana"
                                                            isLoading={loadingBlocks}
                                                            disabled={!form.watch("projectId")}
                                                            value={blocks.find((block) => block.value === field.value)}
                                                            onValueChange={(selectedOption) => {
                                                                // Actualizar el valor del campo directamente
                                                                field.onChange(selectedOption?.value ?? "");

                                                                // Para mostrar el nombre del bloque en el resumen
                                                                setBlockName(selectedOption?.label ?? "");

                                                                // Resetear lote

                                                                form.setValue("lotId", "");

                                                                // Limpiar campos del lote
                                                                form.setValue("area", "");
                                                                form.setValue("pricePerM2", "");
                                                            }}
                                                            renderOption={renderBlockOption}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Lote - Ahora es un autocomplete */}
                                            <FormField
                                                control={form.control}
                                                name="lotId" // Cambio: usar directamente lotId
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-amber-700">Lote</FormLabel>
                                                        <AutoComplete
                                                            options={lots}
                                                            emptyMessage={
                                                                form.watch("blockId")
                                                                    ? "No hay lotes disponibles en esta manzana"
                                                                    : "Seleccione primero una manzana"
                                                            }
                                                            placeholder="Seleccione un lote"
                                                            isLoading={loadingLots}
                                                            disabled={!form.watch("blockId")}
                                                            value={lots.find((lot) => lot.value === field.value)}
                                                            onValueChange={(selectedOption) => {
                                                                // Actualizar el valor del campo directamente
                                                                field.onChange(selectedOption?.value ?? "");

                                                                // Para mostrar el número del lote en el resumen
                                                                setLotNumber(selectedOption?.label ?? "");

                                                                // No hay valores dependientes que resetear
                                                            }}
                                                            renderOption={renderLotOption}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="area"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-amber-700">Área (m²)</FormLabel>
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
                                                        <FormLabel className="text-amber-700">Precio por m²</FormLabel>
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
                                    <div className="flex items-center bg-emerald-500 text-white p-4 rounded-t-xl">
                                        <DollarSign className="h-6 w-6 mr-3" />
                                        <h3 className="text-lg font-semibold">Información de Financiamiento</h3>
                                    </div>

                                    <div className="p-5">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="discount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-emerald-700">Descuento</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Ingrese el descuento"
                                                                type="number"
                                                                {...field}
                                                                onChange={(e) => field.onChange(e.target.value === "" ? "0" : e.target.value)}
                                                                className="border-emerald-200 focus:border-emerald-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="downPayment"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-emerald-700">Inicial (%)</FormLabel>
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
                                                        <FormLabel className="text-emerald-700">Meses a Financiar</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="36"
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
                                            <FormLabel className="flex items-center text-gray-700 dark:text-gray-200">
                                                <DollarSign className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-200" />
                                                Precio Total
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="75000"
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
                                            <FormLabel className="flex items-center font-medium text-gray-700 dark:text-gray-200">
                                                <DollarSign className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-200" />
                                                Precio Final
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="70000"
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
                                            <FormLabel className="flex items-center text-gray-700 dark:text-gray-200">
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
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-gray-500">Cliente:</div>
                                                <div className="font-medium text-right">
                                                    {leadsData.find((c) => c.id === form.watch("leadId"))?.client?.name ?? "—"}
                                                </div>
                                                <div className="text-gray-500">Proyecto:</div>
                                                {/* Usar el estado projectName en vez de form.watch("projectName") */}
                                                <div className="font-medium text-right">{projectName || "—"}</div>
                                                <div className="text-gray-500">Fecha:</div>
                                                <div className="font-medium text-right">
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
                                        <div className="bg-amber-50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-amber-700">Ubicación:</div>
                                                <div className="font-medium text-right">
                                                    {/* Usar los estados blockName y lotNumber */}
                                                    {blockName && lotNumber ? `Manzana ${blockName}, Lote ${lotNumber}` : "—"}
                                                </div>
                                                <div className="text-amber-700">Área:</div>
                                                <div className="font-medium text-right">
                                                    {form.watch("area") ? `${form.watch("area")} m²` : "—"}
                                                </div>
                                                <div className="text-amber-700">Precio/m²:</div>
                                                <div className="font-medium text-right">
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
                                        <div className="bg-emerald-50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-emerald-700">Precio Total:</div>
                                                <div className="font-medium text-right">
                                                    {form.watch("totalPrice") ? `$${form.watch("totalPrice")}` : "—"}
                                                </div>
                                                <div className="text-emerald-700">Descuento:</div>
                                                <div className="font-medium text-right">
                                                    {form.watch("discount") ? `$${form.watch("discount")}` : "—"}
                                                </div>
                                                <div className="text-emerald-700 font-medium">Precio Final:</div>
                                                <div className="font-medium text-right">
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
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-blue-700">Inicial:</div>
                                                <div className="font-medium text-right">
                                                    {form.watch("downPayment") ? `${form.watch("downPayment")}%` : "—"}
                                                </div>
                                                <div className="text-blue-700">A Financiar:</div>
                                                <div className="font-medium text-right">
                                                    {form.watch("amountFinanced") ? `$${form.watch("amountFinanced")}` : "—"}
                                                </div>
                                                <div className="text-blue-700">Plazo:</div>
                                                <div className="font-medium text-right">
                                                    {form.watch("monthsFinanced") ? `${form.watch("monthsFinanced")} meses` : "—"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cuota mensual */}
                                    {form.watch("amountFinanced") && form.watch("monthsFinanced") && (
                                        <div className="bg-gray-800 text-white rounded-lg p-4 text-center">
                                            <div className="text-sm mb-1">Cuota Mensual Estimada</div>
                                            <div className="text-2xl font-bold">${calculateMonthlyPayment()}</div>
                                        </div>
                                    )}

                                    {/* Validez */}
                                    {form.watch("quotationDate") && (
                                        <div className="text-xs text-center text-gray-500 pt-2">
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
