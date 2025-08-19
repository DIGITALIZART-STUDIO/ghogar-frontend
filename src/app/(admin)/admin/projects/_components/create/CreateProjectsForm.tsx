"use client";

import type React from "react";

import { Building2, Calendar, DollarSign, MapPin, Percent, ImageIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import type { CreateProjectSchema } from "../../_schemas/createProjectsSchema";

interface CreateProjectsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode
  form: UseFormReturn<CreateProjectSchema>
  onSubmit: (data: CreateProjectSchema) => void
}

export default function CreateProjectsForm({ children, form, onSubmit }: CreateProjectsFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className=" font-semibold text-gray-900 border-b dark:text-gray-100 pb-2">Información Básica</h3>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Nombre del Proyecto
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Residencial Los Pinos" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center ">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Ubicación
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="San Martín de Porres, Lima" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="projectImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center">
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Imagen del Proyecto
                                </FormLabel>
                                <FormControl>
                                    <ImageUpload value={field.value} onChange={field.onChange} className="w-full" />
                                </FormControl>
                                <FormDescription>Sube una imagen representativa del proyecto (máx. 10MB)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Financial Configuration */}
                <div className="space-y-4">
                    <h3 className=" font-semibold text-gray-900 border-b pb-2 dark:text-gray-100">Configuración Financiera</h3>

                    <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Moneda
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona una moneda" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                                        <SelectItem value="PEN">PEN - Sol Peruano</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="defaultDownPayment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center ">
                                        <Percent className="mr-2 h-4 w-4" />
                                        Inicial por Defecto (%)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="15"
                                            {...field}
                                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormDescription>Porcentaje de inicial sugerido</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="defaultFinancingMonths"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center ">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Financiamiento (meses)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="36"
                                            {...field}
                                            onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                                        />
                                    </FormControl>
                                    <FormDescription>Plazo de financiamiento sugerido</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="maxDiscountPercentage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center ">
                                    <Percent className="mr-2 h-4 w-4" />
                                    Descuento Máximo (%)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="10"
                                        {...field}
                                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>Porcentaje máximo de descuento permitido</FormDescription>
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
