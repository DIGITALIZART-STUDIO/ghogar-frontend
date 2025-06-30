import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { GetActiveProjects } from "@/app/(admin)/admin/projects/_actions/ProjectActions";
import { GetClientsSummary } from "@/app/(admin)/clients/_actions/ClientActions";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { GetUsersSummary } from "../../_actions/LeadActions";
import { CreateLeadSchema } from "../../_schemas/createLeadsSchema";
import { LeadCaptureSource } from "../../_types/lead";
import { LeadCaptureSourceLabels } from "../../_utils/leads.utils";

interface UpdateLeadsFormProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateLeadSchema>;
  onSubmit: (data: CreateLeadSchema) => void;
}

export default function UpdateLeadsForm({ children, form, onSubmit }: UpdateLeadsFormProps) {
    // Estado para almacenar las opciones de usuarios
    const [userOptions, setUserOptions] = useState<Array<Option>>([]);
    const [clientOptions, setClientOptions] = useState<Array<Option>>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
    const [isLoadingClients, setIsLoadingClients] = useState<boolean>(true);

    const [projects, setProjects] = useState<Array<Option>>([]);
    // Estados para loading
    const [loadingProjects, setLoadingProjects] = useState(true);

    // Cargar proyectos activos al inicio
    useEffect(() => {
        const fetchProjects = async () => {
            setLoadingProjects(true);
            const [result] = await GetActiveProjects();

            if (result) {
                const projectOptions = result.map((project) => ({
                    value: project.id ?? "",
                    label: project.name ?? "",
                    location: project.location ?? "",
                    // Agregar los campos de financiación por defecto
                    defaultDownPayment: project.defaultDownPayment?.toString() ?? "",
                    defaultFinancingMonths: project.defaultFinancingMonths?.toString() ?? "",
                }));
                setProjects(projectOptions);
            } else {
                toast.error("Error al cargar los proyectos");
            }
            setLoadingProjects(false);
        };

        fetchProjects();
    }, []);

    // Cargar los usuarios cuando el componente se monta
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoadingUsers(true);
                const result = await GetUsersSummary();

                // Como la respuesta tiene formato [usersData, error]
                if (result && Array.isArray(result) && result.length > 0) {
                    // El primer elemento es el array de usuarios
                    const usersArray = result[0];

                    if (Array.isArray(usersArray) && usersArray.length > 0) {
                        const options = usersArray.map((user) => ({
                            value: user.id ?? "",
                            label: user.userName ?? "Sin nombre",
                        }));

                        setUserOptions(options);
                    }
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoadingUsers(false);
            }
        };

        // Cargar los clientes
        const fetchClients = async () => {
            try {
                setIsLoadingClients(true);
                const result = await GetClientsSummary();

                // Como la respuesta tiene formato [clientsData, error]
                if (result && Array.isArray(result) && result.length > 0) {
                    // El primer elemento es el array de clientes
                    const clientsArray = result[0];

                    if (Array.isArray(clientsArray) && clientsArray.length > 0) {
                        const options = clientsArray.map((client) => ({
                            value: client.id ?? "",
                            label:
                                client.dni
                                    ? `${client.dni} - ${client.name ?? "Sin nombre"}`
                                    : client.ruc
                                        ? `${client.ruc} - ${client.name ?? "Sin nombre"}`
                                        : client.name ?? `Cliente Sin Datos - ${client.phoneNumber ?? "Sin nombre"}` ?? "Sin datos",
                        }));

                        setClientOptions(options);
                    }
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
            } finally {
                setIsLoadingClients(false);
            }
        };

        fetchUsers();
        fetchClients();
    }, []);

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
                                        <SelectValue placeholder="Selecciona un estado civil" />
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
                                options={projects}
                                emptyMessage="No hay proyectos disponibles"
                                placeholder="Seleccione un proyecto"
                                isLoading={loadingProjects}
                                value={projects.find((project) => project.value === field.value)}
                                onValueChange={(selectedOption) => {
                                    // Actualizar el valor del campo directamente
                                    field.onChange(selectedOption?.value ?? "");
                                }}
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
