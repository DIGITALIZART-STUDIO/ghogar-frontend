import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GetUsersSummary } from "../../_actions/LeadActions";
import { CreateLeadSchema } from "../../_schemas/createLeadsSchema";
import { GetClientsSummary } from "../../../clients/_actions/ClientActions";

interface CreateLeadsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
    children: React.ReactNode;
    form: UseFormReturn<CreateLeadSchema>;
    onSubmit: (data: CreateLeadSchema) => void;
}

export default function CreateLeadsForm({ children, form, onSubmit }: CreateLeadsFormProps) {
    // Estado para almacenar las opciones de usuarios
    const [userOptions, setUserOptions] = useState<Array<Option>>([]);
    const [clientOptions, setClientOptions] = useState<Array<Option>>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
    const [isLoadingClients, setIsLoadingClients] = useState<boolean>(true);

    // Cargar los usuarios cuando el componente se monta
    useEffect(() => {
        const fetchUsers = async() => {
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
        const fetchClients = async() => {
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
                            label: client.dni
                                ? `${client.dni} - ${client.name}`
                                : client.ruc
                                    ? `${client.ruc} - ${client.name}`
                                    : client.name!,
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 gap-4">
                <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Cliente
                            </FormLabel>
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
                            <FormLabel>
                                Asesor
                            </FormLabel>
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
                    name="procedency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Procedencia
                            </FormLabel>
                            <FormControl>
                                <InputWithIcon Icon={Globe} placeholder="Ingrese la procedencia de la lead" {...field} />
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
