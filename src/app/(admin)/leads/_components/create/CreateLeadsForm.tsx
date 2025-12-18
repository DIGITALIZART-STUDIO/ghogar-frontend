import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { ProjectSearch } from "@/app/(admin)/admin/projects/_components/search/ProjectSearch";
import { CreateClientsDialog } from "@/app/(admin)/clients/_components/create/CreateClientsDialog";
import { ClientSearch } from "@/app/(admin)/clients/_components/search/ClientSearch";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateLeadSchema } from "../../_schemas/createLeadsSchema";
import { LeadCaptureSource } from "../../_types/lead";
import { LeadCaptureSourceLabels } from "../../_utils/leads.utils";
import { UserSearch } from "../search/UserSearch";

interface CreateLeadsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateLeadSchema>;
  onSubmit: (data: CreateLeadSchema) => void;
}

export default function CreateLeadsForm({ children, form, onSubmit }: CreateLeadsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 gap-4">
        <FormField
          control={form.control}
          name="captureSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="captureSource" required>
                Medio de Captación
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un medio de captación" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(LeadCaptureSource).map((leadCaptureSource) => {
                      const leadCaptureSourceConfig = LeadCaptureSourceLabels[leadCaptureSource];
                      const Icon = leadCaptureSourceConfig.icon;

                      return (
                        <SelectItem
                          key={leadCaptureSource}
                          value={leadCaptureSource}
                          className="flex items-center gap-2"
                        >
                          <Icon className={`size-4 ${leadCaptureSourceConfig.className}`} />
                          <span>{leadCaptureSourceConfig.label}</span>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignedToId"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Asesor</FormLabel>
              <FormControl>
                <UserSearch
                  value={field.value ?? ""}
                  onSelect={(userId) => {
                    field.onChange(userId);
                  }}
                  placeholder="Seleccione un asesor"
                  searchPlaceholder="Buscar por nombre, email, rol..."
                  emptyMessage="No se encontraron asesores"
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
                  value={field.value ?? ""}
                  onSelect={(projectId) => {
                    field.onChange(projectId);
                  }}
                  placeholder="Seleccione un proyecto"
                  searchPlaceholder="Buscar por nombre, ubicación..."
                  emptyMessage="No se encontraron proyectos"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  );
}
