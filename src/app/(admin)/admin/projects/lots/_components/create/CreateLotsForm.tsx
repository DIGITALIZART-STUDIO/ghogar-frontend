import { Building2, DollarSign, Ruler, Tag } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateLotSchema } from "../../_schemas/createLotsSchema";

interface BlockData {
  id: string;
  name: string;
  projectId: string;
  projectName?: string;
  isActive: boolean;
}

interface CreateLotsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateLotSchema>;
  onSubmit: (data: CreateLotSchema) => void;
  blocks: Array<BlockData>; // Array de bloques activos
  selectedBlockId?: string; // ID del bloque preseleccionado
}

export default function CreateLotsForm({ children, form, onSubmit, blocks, selectedBlockId }: CreateLotsFormProps) {
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
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Información del Lote
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="lotNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center text-base">
                                        <Tag className="mr-2 h-4 w-4" />
                                        Número de Lote
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="L-01, L-02..." className="h-12 text-base" {...field} />
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
                                    <FormLabel className="flex items-center text-base">
                                        <Building2 className="mr-2 h-4 w-4" />
                                        Manzana
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={selectedBlockId ?? field.value}
                                        disabled={!!selectedBlockId} // Deshabilitar si hay un bloque preseleccionado
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-12 text-base">
                                                <SelectValue placeholder="Selecciona una manzana" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {blocks.length === 0 ? (
                                                <SelectItem value="" disabled>
                                                    No hay manzanas activas disponibles
                                                </SelectItem>
                                            ) : (
                                                blocks.map((block) => (
                                                    <SelectItem key={block.id} value={block.id}>
                                                        {block.name}
                                                        {" "}
                                                        -
                                                        {block.projectName ?? "Sin proyecto"}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
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
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Medidas y Precios
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="area"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center text-base">
                                        <Ruler className="mr-2 h-4 w-4" />
                                        Área (m²)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="120.5"
                                            className="h-12 text-base"
                                            {...field}
                                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) ?? 0)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Área total del lote en metros cuadrados
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center text-base">
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        Precio Total
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="85000"
                                            className="h-12 text-base"
                                            {...field}
                                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) ?? 0)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Precio total de venta del lote
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Price Calculation Display */}
                    {pricePerSquareMeter > 0 && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-purple-700 font-medium">
                                        Precio por m²:
                                    </span>
                                    <div className="text-2xl font-bold text-purple-800">
                                        $
                                        {pricePerSquareMeter.toFixed(0)}
                                    </div>
                                </div>
                                {selectedBlock && (
                                    <div>
                                        <span className="text-indigo-700 font-medium">
                                            Proyecto:
                                        </span>
                                        <div className="text-lg font-semibold text-indigo-800">
                                            {selectedBlock.projectName ?? "Sin proyecto"}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Status and Settings */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Estado y Configuración
                    </h3>

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">
                                    Estado del Lote
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value ?? "Available"}>
                                    <FormControl>
                                        <SelectTrigger className="h-12 text-base">
                                            <SelectValue placeholder="Selecciona el estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Available">
                                            🟢 Disponible
                                        </SelectItem>
                                        <SelectItem value="Quoted">
                                            🔵 Cotizado
                                        </SelectItem>
                                        <SelectItem value="Reserved">
                                            🟡 Reservado
                                        </SelectItem>
                                        <SelectItem value="Sold">
                                            🔴 Vendido
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Estado inicial del lote en el sistema
                                </FormDescription>
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
