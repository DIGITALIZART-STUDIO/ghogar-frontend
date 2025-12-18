import { UseFormReturn } from "react-hook-form";

import { ProjectSearch } from "@/app/(admin)/admin/projects/_components/search/ProjectSearch";
import { ClientSearch } from "@/app/(admin)/clients/_components/search/ClientSearch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { CreateLeadSchema } from "../../_schemas/createLeadsSchema";
import { LeadCaptureSource } from "../../_types/lead";
import { LeadCaptureSourceLabels } from "../../_utils/leads.utils";
import { UserSearch } from "../search/UserSearch";

interface UpdateLeadsFormProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateLeadSchema>;
  onSubmit: (data: CreateLeadSchema) => void;
}

export default function UpdateLeadsForm({ children, form, onSubmit }: UpdateLeadsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6">
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
                <ClientSearch
                  value={field.value ?? ""}
                  onSelect={(clientId) => {
                    field.onChange(clientId);
                  }}
                  preselectedId={field.value ?? ""}
                  placeholder="Seleccione un cliente"
                  searchPlaceholder="Buscar por nombre, DNI, RUC..."
                  emptyMessage="No se encontraron clientes"
                />
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
                  preselectedId={field.value ?? ""}
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
                  preselectedId={field.value ?? ""}
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
