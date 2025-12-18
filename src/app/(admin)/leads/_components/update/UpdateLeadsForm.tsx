import { UseFormReturn } from "react-hook-form";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { useActiveProjects } from "@/app/(admin)/admin/projects/_hooks/useProjects";
import { useUsersSummary } from "../../_hooks/useLeads";
import { CreateLeadSchema } from "../../_schemas/createLeadsSchema";
import { LeadCaptureSource } from "../../_types/lead";
import { LeadCaptureSourceLabels } from "../../_utils/leads.utils";
import { useClientsSummary } from "@/app/(admin)/clients/_hooks/useClients";

interface UpdateLeadsFormProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateLeadSchema>;
  onSubmit: (data: CreateLeadSchema) => void;
}

export default function UpdateLeadsForm({ children, form, onSubmit }: UpdateLeadsFormProps) {
    // Hooks para cargar datos
    const { data: projects = [], isLoading: loadingProjects } = useActiveProjects();
    const { data: users = [], isLoading: isLoadingUsers } = useUsersSummary();
    const { data: clients = [], isLoading: isLoadingClients } = useClientsSummary();

    // Opciones para los selects/autocomplete
    const projectOptions: Array<Option> = projects.map((project) => ({
        value: project.id ?? "",
        label: project.name ?? "",
        location: project.location ?? "",
        defaultDownPayment: project.defaultDownPayment?.toString() ?? "",
        defaultFinancingMonths: project.defaultFinancingMonths?.toString() ?? "",
    }));

    const userOptions: Array<Option> = users.map((user) => ({
        value: user.id ?? "",
        label: user.userName ?? "Sin nombre",
    }));

    const clientOptions: Array<Option> = clients.map((client) => ({
        value: client.id ?? "",
        label:
            client.dni
                ? `${client.dni} - ${client.name ?? "Sin nombre"}`
                : client.ruc
                    ? `${client.ruc} - ${client.name ?? "Sin nombre"}`
                    : client.name ?? `Cliente Sin Datos - ${client.phoneNumber ?? "Sin nombre"}` ?? "Sin datos",
    }));

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6">
                <FormField
                    control={form.control}
                    name="captureSource"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="captureSource">Medio de Captación</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona un medio de captación" />
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
                            <FormLabel>Cliente</FormLabel>
                            <FormControl>
                                <AutoComplete
                                    options={clientOptions}
                                    emptyMessage="No se encontró el cliente."
                                    placeholder={isLoadingClients ? "Cargando clientes..." : "Seleccione un cliente"}
                                    onValueChange={(selectedOption) => {
                                        field.onChange(selectedOption?.value ?? "");
                                    }}
                                    value={clientOptions.find((option) => option.value === field.value) ?? undefined}
                                    disabled={isLoadingClients}
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
                            <FormLabel>Asesor</FormLabel>
                            <FormControl>
                                <AutoComplete
                                    options={userOptions}
                                    emptyMessage="No se encontró el asesor."
                                    placeholder={isLoadingUsers ? "Cargando asesores..." : "Seleccione un asesor"}
                                    onValueChange={(selectedOption) => {
                                        field.onChange(selectedOption?.value ?? "");
                                    }}
                                    value={userOptions.find((option) => option.value === field.value) ?? undefined}
                                    disabled={isLoadingUsers}
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
                            <FormLabel>Proyecto</FormLabel>
                            <AutoComplete
                                options={projectOptions}
                                emptyMessage="No hay proyectos disponibles"
                                placeholder="Seleccione un proyecto"
                                isLoading={loadingProjects}
                                value={projectOptions.find((project) => project.value === field.value)}
                                onValueChange={(selectedOption) => {
                                    field.onChange(selectedOption?.value ?? "");
                                }}
                                disabled={loadingProjects}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {children}
            </form>
        </Form>
    );
}
