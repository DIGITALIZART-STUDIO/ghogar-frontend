"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, DollarSign, Home, Ruler, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
    lotNumber: z.string().min(1, "El número de lote es requerido"),
    area: z.number().min(0.1, "El área debe ser mayor a 0"),
    price: z.number().min(1, "El precio debe ser mayor a 0"),
    status: z.enum(["Available", "Quoted", "Reserved", "Sold"]),
    blockId: z.string().min(1, "Debe seleccionar un bloque"),
    isActive: z.boolean().default(true),
});

// Mock data for blocks
const blocks = [
    { id: "1", name: "A", projectName: "Villa Sol" },
    { id: "2", name: "B", projectName: "Villa Sol" },
    { id: "3", name: "1", projectName: "Residencial Los Pinos" },
    { id: "4", name: "Torre A", projectName: "Torres del Mar" },
    { id: "5", name: "Torre B", projectName: "Torres del Mar" },
];

interface LotFormDialogProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lot?: any;
}

export function LotFormDialog({ children, lot }: LotFormDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lotNumber: lot?.lotNumber ?? "",
            area: lot?.area ?? 0,
            price: lot?.price ?? 0,
            status: lot?.status ?? "Available",
            blockId: lot?.blockId ?? "",
            isActive: lot?.isActive ?? true,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setOpen(false);
        form.reset();
    }

    const selectedBlock = blocks.find((block) => block.id === form.watch("blockId"));
    const area = form.watch("area");
    const price = form.watch("price");
    const pricePerSquareMeter = area > 0 && price > 0 ? price / area : 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold flex items-center">
                        <Home className="mr-2 h-6 w-6 text-purple-600" />
                        {lot ? "Editar Lote" : "Crear Nuevo Lote"}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        {lot ? "Modifica los datos del lote existente." : "Completa la información para crear un nuevo lote."}
                    </DialogDescription>
                </DialogHeader>

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
                                                Bloque
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 text-base">
                                                        <SelectValue placeholder="Selecciona un bloque" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {blocks.map((block) => (
                                                        <SelectItem key={block.id} value={block.id}>
                                                            {block.name}
                                                            {" "}
                                                            -
                                                            {block.projectName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
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
                                                    onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
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
                                                    {selectedBlock.projectName}
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-gray-50">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base font-medium">
                                                Lote Activo
                                            </FormLabel>
                                            <FormDescription>
                                                Los lotes activos aparecen en las búsquedas y pueden ser gestionados
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} size="lg">
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                            >
                                {lot ? "Actualizar" : "Crear"}
                                {" "}
                                Lote
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
