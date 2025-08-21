"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, CreditCard, DollarSign, FileText, MapPin, RefreshCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { SummaryLead } from "@/app/(admin)/leads/_types/lead";
import { Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CreateQuotationSchema } from "../_schemas/createQuotationsSchema";

import { useActiveProjects } from "@/app/(admin)/admin/projects/_hooks/useProjects";
import { useActiveBlocks } from "@/app/(admin)/admin/projects/[id]/blocks/_hooks/useBlocks";
import { useLots } from "@/app/(admin)/admin/projects/lots/_hooks/useLots";
import InformationQuotationForm from "./InformationQuotationForm";
import { UserGetDTO } from "@/app/(admin)/admin/users/_types/user";

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
  userData: UserGetDTO;
}

export function QuotationForm({ leadsData, form, onSubmit, isPending, initialSelection, userData }: QuotationFormProps) {
    const router = useRouter();

    // Hook para proyectos activos
    const { data: projectsData = [], isLoading: loadingProjects } = useActiveProjects();

    // Opciones para proyectos
    const projects: Array<Option> = projectsData.map((project) => ({
        value: project.id ?? "",
        label: project.name ?? "",
        location: project.location ?? "",
        defaultDownPayment: project.defaultDownPayment?.toString() ?? "",
        defaultFinancingMonths: project.defaultFinancingMonths?.toString() ?? "",
        maxDiscountPercentage: project.maxDiscountPercentage?.toString() ?? "",
    }));

    // Estados para los nombres visuales que se mostrarán en el resumen
    const [projectName, setProjectName] = useState("");
    const [blockName, setBlockName] = useState("");
    const [lotNumber, setLotNumber] = useState("");

    // Inicializar estos valores si estamos en modo edición
    useEffect(() => {
        if (initialSelection) {
            if (initialSelection.projectId) {
                const project = projects.find((p) => p.value === initialSelection.projectId);
                if (project) {
                    setProjectName(project.label);
                }
            }
        }
    }, [initialSelection, projects]);

    const leadsOptions = leadsData.map((lead) => {
        const code = lead.code ?? "";
        const dni = lead.client?.dni;
        const ruc = lead.client?.ruc;
        const name = lead.client?.name ?? "";

        const idPart = dni ?? ruc ?? "";
        let label = code;
        if (idPart) {
            label += ` ${idPart} - ${name}`;
        } else {
            label += ` - ${name}`;
        }

        return {
            value: lead.id ?? "",
            label,
            code,
            idPart,
            name,
        };
    });

    const projectId = form.watch("projectId");
    const blockId = form.watch("blockId");
    const lotId = form.watch("lotId");
    const area = form.watch("area");
    const pricePerM2 = form.watch("pricePerM2");
    const discount = form.watch("discount");
    const downPayment = form.watch("downPayment");

    // Bloques activos por proyecto
    const { data: blocksData = [], isLoading: loadingBlocks } = useActiveBlocks(projectId);
    const blocks: Array<Option> = blocksData.map((block) => ({
        value: block.id ?? "",
        label: block.name ?? "",
        projectId: block.projectId ?? "",
        projectName: block.projectName ?? "",
    }));

    // Lotes por bloque
    const { data: lotsData = [], isLoading: loadingLots } = useLots(blockId);
    const lots: Array<Option> = lotsData.map((lot) => ({
        value: lot.id ?? "",
        label: lot.lotNumber ?? "",
        area: lot.area?.toString() ?? "",
        price: lot.price?.toString() ?? "",
        pricePerM2: lot.pricePerSquareMeter !== undefined && lot.pricePerSquareMeter !== null
            ? Number(lot.pricePerSquareMeter).toFixed(2)
            : "",
        blockId: lot.blockId ?? "",
        blockName: lot.blockName ?? "",
        projectId: lot.projectId ?? "",
        projectName: lot.projectName ?? "",
    }));

    // Inicializar nombres de bloque y lote si estamos en modo edición
    useEffect(() => {
        if (initialSelection) {
            if (initialSelection.blockId && blocks.length > 0) {
                const block = blocks.find((b) => b.value === initialSelection.blockId);
                if (block) {
                    setBlockName(block.label);
                }
            }
            if (initialSelection.lotId && lots.length > 0) {
                const lot = lots.find((l) => l.value === initialSelection.lotId);
                if (lot) {
                    setLotNumber(lot.label);
                }
            }
        }
    }, [initialSelection, blocks, lots]);

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

        // Solo actualiza si los valores son diferentes
        if (form.getValues("area") !== selectedLot.area) {
            form.setValue("area", selectedLot.area);
        }
        if (form.getValues("pricePerM2") !== selectedLot.pricePerM2) {
            form.setValue("pricePerM2", selectedLot.pricePerM2 ? Number(selectedLot.pricePerM2).toFixed(2) : "");
        }

        setLotNumber(selectedLot.label);
        setBlockName(selectedLot.blockName);
        setProjectName(selectedLot.projectName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lotId, lots]);

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

            const amountFinanced = ((area * pricePerM2 - discount) * (1 - downPayment / 100)).toFixed(2);
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda - Información principal */}
                    <InformationQuotationForm
                        form={form}
                        leadsOptions={leadsOptions}
                        projects={projects}
                        lots={lots}
                        blocks={blocks}
                        loadingBlocks={loadingBlocks}
                        loadingLots={loadingLots}
                        loadingProjects={loadingProjects}
                        setProjectName={setProjectName}
                        setBlockName={setBlockName}
                        setLotNumber={setLotNumber}
                        userData={userData}
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
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-gray-500">Cliente:</div>
                                                <div className="font-medium text-right text-gray-900">
                                                    {leadsData.find((c) => c.id === form.watch("leadId"))?.client?.name ?? "—"}
                                                </div>
                                                <div className="text-gray-500">Proyecto:</div>
                                                <div className="font-medium text-right text-gray-900">{projectName || "—"}</div>
                                                <div className="text-gray-500">Fecha:</div>
                                                <div className="font-medium text-right text-gray-900">
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
                                                <div className="font-medium text-right text-gray-900">
                                                    {blockName && lotNumber ? `Manzana ${blockName}, Lote ${lotNumber}` : "—"}
                                                </div>
                                                <div className="text-amber-700">Área:</div>
                                                <div className="font-medium text-right text-gray-900">
                                                    {form.watch("area") ? `${form.watch("area")} m²` : "—"}
                                                </div>
                                                <div className="text-amber-700">Precio/m²:</div>
                                                <div className="font-medium text-right text-gray-900">
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
                                                <div className="font-medium text-right text-gray-900">
                                                    {form.watch("totalPrice") ? `$${form.watch("totalPrice")}` : "—"}
                                                </div>
                                                <div className="text-emerald-700">Descuento:</div>
                                                <div className="font-medium text-right text-gray-900">
                                                    {form.watch("discount") ? `$${form.watch("discount")}` : "—"}
                                                </div>
                                                <div className="text-emerald-700 font-medium">Precio Final:</div>
                                                <div className="font-medium text-right text-gray-900">
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
                                                <div className="font-medium text-right text-gray-900">
                                                    {form.watch("downPayment") ? `${form.watch("downPayment")}%` : "—"}
                                                </div>
                                                <div className="text-blue-700">A Financiar:</div>
                                                <div className="font-medium text-right text-gray-900">
                                                    {form.watch("amountFinanced") ? `$${form.watch("amountFinanced")}` : "—"}
                                                </div>
                                                <div className="text-blue-700">Plazo:</div>
                                                <div className="font-medium text-right text-gray-900">
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
