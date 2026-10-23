"use client";

import { format, parse } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateContractFormData } from "../../../_schemas/updateContractSchema";

interface EditContractFormProps {
  form: UseFormReturn<UpdateContractFormData>;
  paidInstallments: number;
}

export function EditContractForm({ form, paidInstallments }: EditContractFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "coOwners",
  });

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Términos comerciales</h2>
        {paidInstallments > 0 ? (
          <p className="text-sm text-muted-foreground">
            Hay {paidInstallments} cuota{paidInstallments === 1 ? "" : "s"} pagada
            {paidInstallments === 1 ? "" : "s"}. Esas no se tocan; el nuevo plazo no puede ser menor.
          </p>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Precio total</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="downPaymentAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Inicial</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
                <FormLabel required>Meses financiados</FormLabel>
                <FormControl>
                  <Input type="number" min={Math.max(1, paidInstallments)} {...field} />
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
                <FormLabel required>Tipo de cambio</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Fecha de inicio</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                    onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Copropietarios</h2>
          {fields.length < 6 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", dni: "", address: "" })}
            >
              <Plus className="mr-1 h-4 w-4" />
              Agregar
            </Button>
          ) : null}
        </div>
        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin copropietarios.</p>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] items-end">
                <FormField
                  control={form.control}
                  name={`coOwners.${index}.name`}
                  render={({ field: nameField }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input {...nameField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`coOwners.${index}.dni`}
                  render={({ field: dniField }) => (
                    <FormItem>
                      <FormLabel>DNI</FormLabel>
                      <FormControl>
                        <Input {...dniField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`coOwners.${index}.address`}
                  render={({ field: addressField }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input {...addressField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
