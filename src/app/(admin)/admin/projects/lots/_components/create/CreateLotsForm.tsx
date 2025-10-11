import { Building2, DollarSign, Ruler, Tag } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateLotSchema } from "../../_schemas/createLotsSchema";
import { LotStatus } from "../../_types/lot";
import { getAllLotStatuses, getLotStatusConfig } from "../../_utils/lots.filter.utils";
import { BlockData } from "../../../[id]/blocks/_types/block";
import { BlockSearch } from "../../../[id]/blocks/_components/search/BlockSearch";

interface CreateLotsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateLotSchema>;
  onSubmit: (data: CreateLotSchema) => void;
  blocks: Array<BlockData>; // Array de bloques activos
  selectedBlockId?: string; // ID del bloque preseleccionado
  projectId: string; // ID del proyecto para el BlockSearch
}

export default function CreateLotsForm({ children, form, onSubmit, blocks, selectedBlockId, projectId }: CreateLotsFormProps) {
    const area = form.watch("area");
    const price = form.watch("price");
    const watchedBlockId = form.watch("blockId");

    const pricePerSquareMeter = area > 0 && price > 0 ? price / area : 0;
    const selectedBlock = blocks.find((block) => block.id === watchedBlockId);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2 dark:text-gray-100">Información del Lote</h3>

                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            control={form.control}
                            name="lotNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center">
                                        <Tag className="mr-2 h-4 w-4" />
                                        Número de Lote
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="L-01, L-02..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="blockId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center">
                                        <Building2 className="mr-2 h-4 w-4" />
                                        Manzana
                                    </FormLabel>
                                    <FormControl>
                                        <BlockSearch
                                            projectId={projectId}
                                            value={field.value}
                                            onSelect={(blockId) => {
                                                field.onChange(blockId);
                                            }}
                                            placeholder="Selecciona una manzana..."
                                            searchPlaceholder="Buscar por nombre de manzana..."
                                            emptyMessage="No se encontraron manzanas activas"
                                            preselectedId={selectedBlockId}
                                            disabled={!!selectedBlockId}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {selectedBlockId ? "Manzana preseleccionada" : "Solo se muestran manzanas activas"}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Measurements and Pricing */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2 dark:text-gray-100">Medidas y Precios</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="area"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center">
                                        <Ruler className="mr-2 h-4 w-4" />
                                        Área (m²)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="120.5"
                                            {...field}
                                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) ?? 0)}
                                        />
                                    </FormControl>
                                    <FormDescription>Área total del lote</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center">
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        Precio Total
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="85000"
                                            {...field}
                                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) ?? 0)}
                                        />
                                    </FormControl>
                                    <FormDescription>Precio total de venta del lote</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Price Calculation Display */}
                    {pricePerSquareMeter > 0 && (
                        <div className=" p-4 rounded-lg border ">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Precio por m²:</span>
                                    <div className="text-2xl font-bold ">${pricePerSquareMeter.toFixed(0)}</div>
                                </div>
                                {selectedBlock && (
                                    <div>
                                        <span className=" font-medium">Proyecto:</span>
                                        <div className="text-lg font-semibold ">{selectedBlock.projectName ?? "Sin proyecto"}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Status and Settings */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 dark:text-gray-100">Estado y Configuración</h3>

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado del Lote</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value ?? LotStatus.Available}>
                                    <FormControl>
                                        <SelectTrigger className=" w-full">
                                            <SelectValue placeholder="Selecciona el estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {getAllLotStatuses().map((status) => {
                                            const config = getLotStatusConfig(status);
                                            const Icon = config.icon;
                                            return (
                                                <SelectItem key={status} value={status}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`w-4 h-4 ${config.textClassName}`} />
                                                        <span>{config.label}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                <FormDescription>Estado inicial del lote en el sistema</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {children}
            </form>
        </Form>
    );
}
