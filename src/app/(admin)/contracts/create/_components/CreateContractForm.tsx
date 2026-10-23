"use client";

import { format, parse } from "date-fns";
import { FileSignature, MapPin, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { ProjectSearch } from "@/app/(admin)/admin/projects/_components/search/ProjectSearch";
import { BlockSearch } from "@/app/(admin)/admin/projects/[id]/blocks/_components/search/BlockSearch";
import { LotSearch } from "@/app/(admin)/admin/projects/[id]/blocks/[blockId]/lots/_components/search/LotSearch";
import { ClientSearch } from "@/app/(admin)/clients/_components/search/ClientSearch";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CreateContractFormData } from "../../_schemas/createContractSchema";
import { ContractOrigin } from "../../_types/contract";
import { contractCurrencyFromProject, contractCurrencyLabel } from "../../_utils/contracts.utils";

interface CreateContractFormProps {
  form: UseFormReturn<CreateContractFormData>;
}

export function CreateContractForm({ form }: CreateContractFormProps) {
  const origin = form.watch("origin");

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FileSignature className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">1. Origen</h2>
        </div>
        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-auto justify-start p-4 text-left",
                      field.value === ContractOrigin.Direct && "border-primary bg-primary/5"
                    )}
                    onClick={() => field.onChange(ContractOrigin.Direct)}
                  >
                    <span>
                      <span className="block font-medium">Directo</span>
                      <span className="block text-sm font-normal text-muted-foreground">
                        Sin cotización. El lote pasa a reservado y queda pendiente de validación.
                      </span>
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-auto justify-start p-4 text-left",
                      field.value === ContractOrigin.Legacy && "border-primary bg-primary/5"
                    )}
                    onClick={() => field.onChange(ContractOrigin.Legacy)}
                  >
                    <span>
                      <span className="block font-medium">Legado</span>
                      <span className="block text-sm font-normal text-muted-foreground">
                        Contrato ya firmado fuera del sistema. Puede marcar cuotas ya pagadas.
                      </span>
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      <section className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">2. Cliente y lote</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Cliente</FormLabel>
                <FormControl>
                  <ClientSearch
                    value={field.value}
                    onSelect={(clientId) => field.onChange(clientId)}
                    preselectedId={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Proyecto</FormLabel>
                <FormControl>
                  <ProjectSearch
                    value={field.value}
                    onSelect={(projectId, project) => {
                      field.onChange(projectId);
                      form.setValue("blockId", "");
                      form.setValue("lotId", "");
                      form.setValue("currency", contractCurrencyFromProject(project.currency));
                    }}
                    preselectedId={field.value}
                  />
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
                <FormLabel required>Manzana</FormLabel>
                <FormControl>
                  <BlockSearch
                    projectId={form.watch("projectId")}
                    value={field.value}
                    disabled={!form.watch("projectId")}
                    onSelect={(blockId) => {
                      field.onChange(blockId);
                      form.setValue("lotId", "");
                    }}
                    preselectedId={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lotId"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Lote</FormLabel>
                <FormControl>
                  <LotSearch
                    blockId={form.watch("blockId")}
                    value={field.value}
                    disabled={!form.watch("blockId")}
                    onSelect={(lotId, lot) => {
                      field.onChange(lotId);
                      if (lot.price) {
                        form.setValue("totalPrice", lot.price);
                      }
                    }}
                    preselectedId={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">3. Términos</h2>
        </div>
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
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moneda del proyecto</FormLabel>
                <FormControl>
                  <Input readOnly value={contractCurrencyLabel(field.value)} />
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
          {origin === ContractOrigin.Legacy ? (
            <>
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
              <FormField
                control={form.control}
                name="paidInstallments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuotas ya pagadas</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
