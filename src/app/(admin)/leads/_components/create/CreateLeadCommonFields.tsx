import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { ProjectSearch } from "@/app/(admin)/admin/projects/_components/search/ProjectSearch";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadCaptureSource } from "../../_types/lead";
import { LeadCaptureSourceLabels } from "../../_utils/leads.utils";
import { UserSearch } from "../search/UserSearch";

interface LeadFormFieldsProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  isSalesAdvisor: boolean;
  currentUserId: string;
}

export function CreateLeadCaptureSourceField<T extends FieldValues>({ form }: Pick<LeadFormFieldsProps<T>, "form">) {
  return (
    <FormField
      control={form.control}
      name={"captureSource" as Path<T>}
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
                    <SelectItem key={leadCaptureSource} value={leadCaptureSource} className="flex items-center gap-2">
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
  );
}

export function CreateLeadAssignmentFields<T extends FieldValues>({
  form,
  isSalesAdvisor,
  currentUserId,
}: LeadFormFieldsProps<T>) {
  return (
    <>
      <FormField
        control={form.control}
        name={"assignedToId" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Asesor</FormLabel>
            <FormControl>
              <UserSearch
                value={field.value ?? ""}
                onSelect={(userId) => {
                  field.onChange(userId);
                }}
                preselectedId={currentUserId || undefined}
                disabled={isSalesAdvisor}
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
        name={"projectId" as Path<T>}
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
    </>
  );
}
