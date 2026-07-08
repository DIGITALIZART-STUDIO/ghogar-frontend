import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { CreateClientsDialog } from "@/app/(admin)/clients/_components/create/CreateClientsDialog";
import { ClientSearch } from "@/app/(admin)/clients/_components/search/ClientSearch";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreateLeadSchema } from "../../_schemas/createLeadsSchema";
import { CreateLeadAssignmentFields, CreateLeadCaptureSourceField } from "./CreateLeadCommonFields";

interface CreateLeadsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateLeadSchema>;
  onSubmit: (data: CreateLeadSchema) => void;
  isSalesAdvisor: boolean;
  currentUserId: string;
}

export default function CreateLeadsForm({
  children,
  form,
  onSubmit,
  isSalesAdvisor,
  currentUserId,
}: CreateLeadsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 gap-4">
        <CreateLeadCaptureSourceField form={form} />

        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Cliente</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <ClientSearch
                      value={field.value ?? ""}
                      onSelect={(clientId) => {
                        field.onChange(clientId);
                      }}
                      preselectedId={field.value ?? undefined}
                      placeholder="Seleccione un cliente"
                      searchPlaceholder="Buscar por nombre, DNI, RUC, teléfono..."
                      emptyMessage="No se encontraron clientes"
                    />
                  </div>
                  <CreateClientsDialog
                    trigger={
                      <Button variant="outline">
                        <Plus className="size-4" />
                      </Button>
                    }
                    onClientCreated={(clientId) => {
                      if (clientId) {
                        field.onChange(clientId);
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CreateLeadAssignmentFields form={form} isSalesAdvisor={isSalesAdvisor} currentUserId={currentUserId} />

        {children}
      </form>
    </Form>
  );
}
