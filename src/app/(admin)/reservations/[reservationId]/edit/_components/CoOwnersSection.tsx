"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
    Users,
    User,
    Pencil,
    Trash2,
    IdCard,
    Mail,
    Home,
} from "lucide-react";
import { toast } from "sonner";

import { InputWithIcon } from "@/components/input-with-icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { useClientById, useUpdateClient } from "@/app/(admin)/clients/_hooks/useClients";
import { CreateReservationSchema } from "../../../create/_schemas/createReservationSchema";

interface CoOwner {
    name: string;
    dni: string;
    phone?: string;
    address: string;
    email?: string;
}

interface CoOwnersSectionProps {
    clientId: string;
    form: UseFormReturn<CreateReservationSchema>;
}

export function CoOwnersSection({ clientId, form }: CoOwnersSectionProps) {
    // Hook para obtener datos del cliente
    const { data: clientData } = useClientById(clientId);
    const updateClient = useUpdateClient();

    // Estados para copropietarios del cliente
    const [clientCoOwners, setClientCoOwners] = useState<Array<CoOwner>>([]);
    const [editingCoOwnerIndex, setEditingCoOwnerIndex] = useState<number | null>(null);
    const [newCoOwner, setNewCoOwner] = useState<CoOwner>({
        name: "",
        dni: "",
        phone: "",
        address: "",
        email: ""
    });

    // Estados para copropietarios de la separación
    const [selectedCoOwners, setSelectedCoOwners] = useState<Array<CoOwner>>([]);
    const [separationCoOwners, setSeparationCoOwners] = useState<Array<CoOwner>>([]);
    const [editingSeparationCoOwnerIndex, setEditingSeparationCoOwnerIndex] = useState<number | null>(null);
    const [newSeparationCoOwner, setNewSeparationCoOwner] = useState<CoOwner>({
        name: "",
        dni: "",
        phone: "",
        address: "",
        email: ""
    });

    // ===== INICIALIZACIÓN =====

    // Inicializar copropietarios del cliente cuando se carga la data
    useEffect(() => {
        if (clientData?.coOwners) {
            try {
                const parsedCoOwners = JSON.parse(clientData.coOwners);
                setClientCoOwners(parsedCoOwners);
            } catch (error) {
                console.error("Error parsing client coOwners:", error);
                setClientCoOwners([]);
            }
        } else {
            setClientCoOwners([]);
        }
    }, [clientData]);

    // Inicializar copropietarios de la separación desde el formulario
    useEffect(() => {
        const currentCoOwners = form.getValues("coOwners") ?? [];

        // Separar copropietarios del cliente de los de la separación
        const clientDnis = clientCoOwners.map((co) => co.dni);

        // Los copropietarios seleccionados del cliente son los que están en currentCoOwners Y también en clientCoOwners
        const selectedFromClient = currentCoOwners.filter((co) => clientDnis.includes(co.dni));

        // Los copropietarios específicos de la separación son los que están en currentCoOwners pero NO en clientCoOwners
        const specificToSeparation = currentCoOwners.filter((co) => !clientDnis.includes(co.dni));

        setSelectedCoOwners(selectedFromClient);
        setSeparationCoOwners(specificToSeparation);

    }, [form, clientCoOwners]);

    // ===== FUNCIONES PARA CRUD DE COPROPIETARIOS DEL CLIENTE =====

    // Agregar nuevo copropietario al cliente
    const addClientCoOwner = async () => {
        if (!clientId || !newCoOwner.name || !newCoOwner.dni || !newCoOwner.address) {
            toast.error("Por favor complete todos los campos obligatorios");
            return;
        }

        // Verificar si el DNI ya existe
        if (clientCoOwners.some((co) => co.dni === newCoOwner.dni)) {
            toast.error("Ya existe un copropietario con este DNI");
            return;
        }

        const updatedCoOwners = [...clientCoOwners, newCoOwner];

        try {
            await updateClient.mutateAsync({
                params: { path: { id: clientId } },
                body: {
                    ...clientData,
                    coOwners: JSON.stringify(updatedCoOwners)
                }
            });

            setClientCoOwners(updatedCoOwners);
            setNewCoOwner({ name: "", dni: "", phone: "", address: "", email: "" });
            toast.success("Copropietario agregado exitosamente");
        } catch {
            toast.error("Error al agregar copropietario");
        }
    };

    // Editar copropietario del cliente
    const editClientCoOwner = (index: number) => {
        setEditingCoOwnerIndex(index);
        setNewCoOwner({ ...clientCoOwners[index] });
    };

    // Actualizar copropietario del cliente
    const updateClientCoOwner = async () => {
        if (!clientId || editingCoOwnerIndex === null || !newCoOwner.name || !newCoOwner.dni || !newCoOwner.address) {
            toast.error("Por favor complete todos los campos obligatorios");
            return;
        }

        // Verificar si el DNI ya existe (excluyendo el actual)
        if (clientCoOwners.some((co, index) => co.dni === newCoOwner.dni && index !== editingCoOwnerIndex)) {
            toast.error("Ya existe un copropietario con este DNI");
            return;
        }

        const updatedCoOwners = [...clientCoOwners];
        updatedCoOwners[editingCoOwnerIndex] = newCoOwner;

        try {
            await updateClient.mutateAsync({
                params: { path: { id: clientId } },
                body: {
                    ...clientData,
                    coOwners: JSON.stringify(updatedCoOwners)
                }
            });

            setClientCoOwners(updatedCoOwners);
            setEditingCoOwnerIndex(null);
            setNewCoOwner({ name: "", dni: "", phone: "", address: "", email: "" });
            toast.success("Copropietario actualizado exitosamente");
        } catch {
            toast.error("Error al actualizar copropietario");
        }
    };

    // Eliminar copropietario del cliente
    const deleteClientCoOwner = async (index: number) => {
        if (!clientId) {
            return;
        }

        const updatedCoOwners = clientCoOwners.filter((_, i) => i !== index);

        try {
            await updateClient.mutateAsync({
                params: { path: { id: clientId } },
                body: {
                    ...clientData,
                    coOwners: JSON.stringify(updatedCoOwners)
                }
            });

            setClientCoOwners(updatedCoOwners);
            // Remover de seleccionados si estaba seleccionado
            const removedCoOwner = clientCoOwners[index];
            const newSelected = selectedCoOwners.filter((co) => co.dni !== removedCoOwner.dni);
            setSelectedCoOwners(newSelected);
            form.setValue("coOwners", [...newSelected, ...separationCoOwners]);
            toast.success("Copropietario eliminado exitosamente");
        } catch {
            toast.error("Error al eliminar copropietario");
        }
    };

    // Cancelar edición
    const cancelEdit = () => {
        setEditingCoOwnerIndex(null);
        setNewCoOwner({ name: "", dni: "", phone: "", address: "", email: "" });
    };

    // ===== FUNCIONES PARA CRUD DE COPROPIETARIOS DE LA SEPARACIÓN =====

    // Agregar nuevo copropietario a la separación
    const addSeparationCoOwner = () => {
        if (!newSeparationCoOwner.name || !newSeparationCoOwner.dni || !newSeparationCoOwner.address) {
            toast.error("Por favor complete todos los campos obligatorios");
            return;
        }

        // Verificar si el DNI ya existe en copropietarios del cliente
        if (clientCoOwners.some((co) => co.dni === newSeparationCoOwner.dni)) {
            toast.error("Ya existe un copropietario del cliente con este DNI");
            return;
        }

        // Verificar si el DNI ya existe en copropietarios de la separación
        if (separationCoOwners.some((co) => co.dni === newSeparationCoOwner.dni)) {
            toast.error("Ya existe un copropietario de la separación con este DNI");
            return;
        }

        const updatedSeparationCoOwners = [...separationCoOwners, newSeparationCoOwner];
        setSeparationCoOwners(updatedSeparationCoOwners);

        // Actualizar el formulario con todos los copropietarios (seleccionados + separación)
        const allCoOwners = [...selectedCoOwners, ...updatedSeparationCoOwners];
        form.setValue("coOwners", allCoOwners);

        setNewSeparationCoOwner({ name: "", dni: "", phone: "", address: "", email: "" });
        toast.success("Copropietario de separación agregado exitosamente");
    };

    // Editar copropietario de la separación
    const editSeparationCoOwner = (index: number) => {
        setEditingSeparationCoOwnerIndex(index);
        setNewSeparationCoOwner({ ...separationCoOwners[index] });
    };

    // Actualizar copropietario de la separación
    const updateSeparationCoOwner = () => {
        if (editingSeparationCoOwnerIndex === null || !newSeparationCoOwner.name || !newSeparationCoOwner.dni || !newSeparationCoOwner.address) {
            toast.error("Por favor complete todos los campos obligatorios");
            return;
        }

        // Verificar si el DNI ya existe en copropietarios del cliente
        if (clientCoOwners.some((co) => co.dni === newSeparationCoOwner.dni)) {
            toast.error("Ya existe un copropietario del cliente con este DNI");
            return;
        }

        // Verificar si el DNI ya existe en otros copropietarios de la separación (excluyendo el actual)
        if (separationCoOwners.some((co, index) => co.dni === newSeparationCoOwner.dni && index !== editingSeparationCoOwnerIndex)) {
            toast.error("Ya existe un copropietario de la separación con este DNI");
            return;
        }

        const updatedSeparationCoOwners = [...separationCoOwners];
        updatedSeparationCoOwners[editingSeparationCoOwnerIndex] = newSeparationCoOwner;
        setSeparationCoOwners(updatedSeparationCoOwners);

        // Actualizar el formulario con todos los copropietarios (seleccionados + separación)
        const allCoOwners = [...selectedCoOwners, ...updatedSeparationCoOwners];
        form.setValue("coOwners", allCoOwners);

        setEditingSeparationCoOwnerIndex(null);
        setNewSeparationCoOwner({ name: "", dni: "", phone: "", address: "", email: "" });
        toast.success("Copropietario de separación actualizado exitosamente");
    };

    // Eliminar copropietario de la separación
    const deleteSeparationCoOwner = (index: number) => {
        const updatedSeparationCoOwners = separationCoOwners.filter((_, i) => i !== index);
        setSeparationCoOwners(updatedSeparationCoOwners);

        // Actualizar el formulario con todos los copropietarios (seleccionados + separación)
        const allCoOwners = [...selectedCoOwners, ...updatedSeparationCoOwners];
        form.setValue("coOwners", allCoOwners);

        toast.success("Copropietario de separación eliminado exitosamente");
    };

    // Cancelar edición de copropietario de separación
    const cancelSeparationEdit = () => {
        setEditingSeparationCoOwnerIndex(null);
        setNewSeparationCoOwner({ name: "", dni: "", phone: "", address: "", email: "" });
    };

    // ===== FUNCIONES PARA SELECCIÓN DE COPROPIETARIOS DEL CLIENTE =====

    const toggleCoOwnerSelection = (coOwner: CoOwner, isSelected: boolean) => {
        let newSelected;

        if (isSelected) {
            // Add to selected copropietarios (solo si no está ya seleccionado)
            if (!selectedCoOwners.some((co) => co.dni === coOwner.dni)) {
                newSelected = [...selectedCoOwners, coOwner];
                setSelectedCoOwners(newSelected);
            } else {
                newSelected = selectedCoOwners;
            }
        } else {
            // Remove from selected copropietarios
            newSelected = selectedCoOwners.filter((co) => co.dni !== coOwner.dni);
            setSelectedCoOwners(newSelected);
        }

        // Actualizar el formulario con todos los copropietarios (seleccionados + separación)
        const allCoOwners = [...newSelected, ...separationCoOwners];
        form.setValue("coOwners", allCoOwners);
    };

    const isCoOwnerSelected = (dni: string) => selectedCoOwners.some((co) => co.dni === dni);

    if (!clientData) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Card Copropietarios del Cliente */}
            <div className="bg-card rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <h2 className="text-base font-medium text-slate-800 dark:text-slate-200">
                            Copropietarios del Cliente
                        </h2>
                    </div>
                </div>

                <div className="p-4 space-y-6">
                    {/* Lista de copropietarios existentes con selección */}
                    {clientCoOwners.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Copropietarios Registrados
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Seleccione los copropietarios que participarán en esta separación:
                            </p>
                            <div className="space-y-2">
                                {clientCoOwners.map((coOwner, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <Checkbox
                                                checked={isCoOwnerSelected(coOwner.dni)}
                                                onCheckedChange={(checked) => toggleCoOwnerSelection(coOwner, checked as boolean)}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-slate-500" />
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                                        {coOwner.name}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    DNI: {coOwner.dni}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => editClientCoOwner(index)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteClientCoOwner(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedCoOwners.length > 0 && (
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        <strong>{selectedCoOwners.length}</strong> copropietario(s) del cliente seleccionado(s) para la separación
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Formulario para agregar/editar copropietario */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {editingCoOwnerIndex !== null ? "Editar Copropietario" : "Agregar Nuevo Copropietario"}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                    Nombre Completo *
                                </label>
                                <InputWithIcon
                                    Icon={User}
                                    placeholder="Nombre completo"
                                    value={newCoOwner.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCoOwner({...newCoOwner, name: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                    DNI *
                                </label>
                                <InputWithIcon
                                    Icon={IdCard}
                                    placeholder="12345678"
                                    maxLength={8}
                                    value={newCoOwner.dni}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCoOwner({...newCoOwner, dni: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                    Teléfono
                                </label>
                                <PhoneInput
                                    defaultCountry={"PE"}
                                    placeholder="999 888 777"
                                    value={newCoOwner.phone ?? ""}
                                    onChange={(value) => setNewCoOwner({...newCoOwner, phone: value})}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                    Dirección *
                                </label>
                                <InputWithIcon
                                    Icon={Home}
                                    placeholder="Ejm: Jr. Los Pinos 123"
                                    value={newCoOwner.address}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCoOwner({...newCoOwner, address: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                    Correo Electrónico
                                </label>
                                <InputWithIcon
                                    Icon={Mail}
                                    placeholder="usuario@ejemplo.com"
                                    value={newCoOwner.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCoOwner({...newCoOwner, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                onClick={editingCoOwnerIndex !== null ? updateClientCoOwner : addClientCoOwner}
                                disabled={updateClient.isPending}
                                className="flex-1"
                            >
                                {updateClient.isPending ? "Guardando..." : (editingCoOwnerIndex !== null ? "Actualizar" : "Agregar")}
                            </Button>
                            {editingCoOwnerIndex !== null && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={cancelEdit}
                                >
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Copropietarios de la Separación */}
            <div className="bg-card rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <h2 className="text-base font-medium text-slate-800 dark:text-slate-200">
                            Copropietarios de la Separación
                        </h2>
                    </div>
                </div>

                <div className="p-4 space-y-6">
                    {/* Mostrar copropietarios seleccionados del cliente */}
                    {selectedCoOwners.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Copropietarios del Cliente Seleccionados
                            </h3>
                            <div className="space-y-2">
                                {selectedCoOwners.map((coOwner, index) => (
                                    <div key={`selected-${index}`} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                                        {coOwner.name}
                                                    </span>
                                                    <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                                        Del Cliente
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    DNI: {coOwner.dni}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleCoOwnerSelection(coOwner, false)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CRUD de copropietarios específicos de la separación */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Copropietarios Específicos de la Separación
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Agregue copropietarios que solo participarán en esta separación:
                        </p>

                        {/* Lista de copropietarios de la separación */}
                        {separationCoOwners.length > 0 && (
                            <div className="space-y-2">
                                {separationCoOwners.map((coOwner, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-900/20">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                                        {coOwner.name}
                                                    </span>
                                                    <span className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                                        Específico
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                                    DNI: {coOwner.dni}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => editSeparationCoOwner(index)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteSeparationCoOwner(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Formulario para agregar/editar copropietario de separación */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {editingSeparationCoOwnerIndex !== null ? "Editar Copropietario de Separación" : "Agregar Nuevo Copropietario de Separación"}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                        Nombre Completo *
                                    </label>
                                    <InputWithIcon
                                        Icon={User}
                                        placeholder="Nombre completo"
                                        value={newSeparationCoOwner.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSeparationCoOwner({...newSeparationCoOwner, name: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                        DNI *
                                    </label>
                                    <InputWithIcon
                                        Icon={IdCard}
                                        placeholder="12345678"
                                        maxLength={8}
                                        value={newSeparationCoOwner.dni}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSeparationCoOwner({...newSeparationCoOwner, dni: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                        Teléfono
                                    </label>
                                    <PhoneInput
                                        defaultCountry={"PE"}
                                        placeholder="999 888 777"
                                        value={newSeparationCoOwner.phone ?? ""}
                                        onChange={(value) => setNewSeparationCoOwner({...newSeparationCoOwner, phone: value})}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                        Dirección *
                                    </label>
                                    <InputWithIcon
                                        Icon={Home}
                                        placeholder="Ejm: Jr. Los Pinos 123"
                                        value={newSeparationCoOwner.address}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSeparationCoOwner({...newSeparationCoOwner, address: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                        Correo Electrónico
                                    </label>
                                    <InputWithIcon
                                        Icon={Mail}
                                        placeholder="usuario@ejemplo.com"
                                        value={newSeparationCoOwner.email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSeparationCoOwner({...newSeparationCoOwner, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    onClick={editingSeparationCoOwnerIndex !== null ? updateSeparationCoOwner : addSeparationCoOwner}
                                    className="flex-1"
                                >
                                    {editingSeparationCoOwnerIndex !== null ? "Actualizar" : "Agregar"}
                                </Button>
                                {editingSeparationCoOwnerIndex !== null && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={cancelSeparationEdit}
                                    >
                                        Cancelar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Resumen de copropietarios de la separación */}
                    {(selectedCoOwners.length > 0 || separationCoOwners.length > 0) && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                                <strong>{selectedCoOwners.length + separationCoOwners.length}</strong> copropietario(s) participarán en esta separación
                                {selectedCoOwners.length > 0 && (
                                    <span className="block text-xs mt-1">
                                        • {selectedCoOwners.length} del cliente
                                    </span>
                                )}
                                {separationCoOwners.length > 0 && (
                                    <span className="block text-xs">
                                        • {separationCoOwners.length} específicos de la separación
                                    </span>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
