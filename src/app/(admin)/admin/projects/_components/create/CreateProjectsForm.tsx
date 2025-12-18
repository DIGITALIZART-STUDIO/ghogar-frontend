"use client";

import type React from "react";
import { Building2, Calendar, DollarSign, ImageIcon, MapPin, Percent } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateProjectSchema } from "../../_schemas/createProjectsSchema";

interface CreateProjectsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateProjectSchema>;
  onSubmit: (data: CreateProjectSchema) => void;
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
                <FormLabel required icon={Building2}>
                  Nombre del Proyecto
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese el nombre del proyecto" {...field} />
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
                <FormLabel required icon={MapPin}>
                  Ubicación
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese la ubicación del proyecto" {...field} />
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
                <FormLabel icon={ImageIcon}>Imagen del Proyecto</FormLabel>
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
                <FormLabel required icon={DollarSign}>
                  Moneda
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione la moneda del proyecto" />
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
                  <FormLabel icon={Percent}>Inicial por Defecto (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ingrese el porcentaje de inicial"
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
                  <FormLabel icon={Calendar}>Financiamiento (meses)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ingrese el plazo en meses"
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
                <FormLabel icon={Percent}>Descuento Máximo (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ingrese el porcentaje máximo de descuento"
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
