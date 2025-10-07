"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDebouncedCallback } from "use-debounce";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Users,
    UserCheck,
    ArrowRight,
    Loader2,
    Check,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserGetDTO } from "../../_types/user";

type ConsultorType = UserGetDTO;
type AssignedConsultorType = {
    id?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    isActive?: boolean;
    createdAt?: string;
    assignedAt?: string;
};
import {
    usePaginatedConsultorsWithSearch,
    useSalesAdvisorsBySupervisor,
    useAssignMultipleSalesAdvisorsToSupervisor,
    useRemoveSalesAdvisorFromSupervisor
} from "../../_hooks/useUser";
import { toast } from "sonner";

interface AssignConsultorsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    supervisor: UserGetDTO;
}

interface ConsultorItemProps {
    user: UserGetDTO;
    isSelected: boolean;
    onToggle: (user: UserGetDTO) => void;
    showActions?: boolean;
}

const ConsultorItem: React.FC<ConsultorItemProps> = ({
    user,
    isSelected,
    onToggle,
    showActions = true
}) => {
    const initials = user.user.name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ?? "U";

    return (
        <div
            className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer group",
                isSelected
                    ? "bg-amber-50 border-amber-200 ring-1 ring-amber-200"
                    : "bg-card border-border hover:border-amber-300 hover:bg-amber-50/30"
            )}
            onClick={() => onToggle(user)}
        >
            <Avatar className="h-10 w-10">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-amber-100 text-amber-700 font-medium">
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                    {user.user.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                    {user.user.email}
                </p>
            </div>

            {showActions && (
                <div className="flex items-center gap-2">
                    {isSelected ? (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100">
                            <Check className="w-4 h-4 text-amber-700" />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-amber-400 transition-colors" />
                    )}
                </div>
            )}
        </div>
    );
};

export function AssignConsultorsDialog({
    open,
    onOpenChange,
    supervisor
}: AssignConsultorsDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 1160px)");

    // Estados locales
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedConsultors, setSelectedConsultors] = useState<Array<UserGetDTO>>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Hooks
    const {
        allConsultors,
        isLoading: isLoadingConsultors,
        isFetchingNextPage,
        handleSearchChange,
        handleScrollEnd,
        resetSearch
    } = usePaginatedConsultorsWithSearch(10);

    const {
        data: assignedConsultorsData,
        isLoading: isLoadingAssigned,
        refetch: refetchAssigned
    } = useSalesAdvisorsBySupervisor(supervisor.user.id ?? "");

    const assignMultipleMutation = useAssignMultipleSalesAdvisorsToSupervisor();
    const removeMutation = useRemoveSalesAdvisorFromSupervisor();

    // Consultores asignados actualmente
    const assignedConsultors = useMemo(() => assignedConsultorsData ?? [], [assignedConsultorsData]);

    // Consultores disponibles (no asignados)
    const availableConsultors = useMemo(() => {
        const assignedIds = assignedConsultors.map((c: AssignedConsultorType) => c.id);
        return allConsultors.filter((c: ConsultorType) => !assignedIds.includes(c.user.id));
    }, [allConsultors, assignedConsultors]);

    // Consultores filtrados por búsqueda
    const filteredAvailableConsultors = useMemo(() => {
        if (!searchTerm.trim()) {
            return availableConsultors;
        }
        return availableConsultors.filter((consultor: ConsultorType) => consultor.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ??
            consultor.user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [availableConsultors, searchTerm]);

    // Los consultores asignados no se filtran por búsqueda
    const filteredAssignedConsultors = useMemo(() => assignedConsultors, [assignedConsultors]);

    // Inicializar consultores asignados cuando se abre el diálogo
    useEffect(() => {
        if (open) {
            setSelectedConsultors([]);
            setSearchTerm("");
            resetSearch();
            refetchAssigned();
        }
    }, [open, resetSearch, refetchAssigned]);

    // Callback con debounce para búsqueda
    const debouncedSearch = useDebouncedCallback((value: string) => {
        handleSearchChange(value);
    }, 300);

    // Manejar búsqueda
    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);
        debouncedSearch(value);
    }, [debouncedSearch]);

    // Toggle selección de consultor
    const toggleConsultorSelection = useCallback((consultor: UserGetDTO) => {
        setSelectedConsultors((prev) => {
            const isSelected = prev.some((c) => c.user.id === consultor.user.id);
            if (isSelected) {
                return prev.filter((c) => c.user.id !== consultor.user.id);
            } else {
                return [...prev, consultor];
            }
        });
    }, []);

    // Asignar consultores seleccionados
    const handleAssignConsultors = useCallback(async () => {
        if (selectedConsultors.length === 0) {
            return;
        }

        setIsLoading(true);
        try {
            const salesAdvisorIds = selectedConsultors.map((consultor) => consultor.user.id ?? "");

            await assignMultipleMutation.mutateAsync({
                body: {
                    supervisorId: supervisor.user.id ?? "",
                    salesAdvisorIds: salesAdvisorIds
                }
            });

            setSelectedConsultors([]);
            refetchAssigned();

            // Mostrar mensaje de éxito
            toast.success(`${selectedConsultors.length} consultor(es) asignado(s) exitosamente`);
        } catch {
            toast.error("Error al asignar consultores");
        } finally {
            setIsLoading(false);
        }
    }, [selectedConsultors, supervisor.user.id, assignMultipleMutation, refetchAssigned]);

    // Remover consultor asignado
    const handleRemoveConsultor = useCallback(async (consultor: UserGetDTO) => {
        setIsLoading(true);
        try {
            await removeMutation.mutateAsync({
                params: {
                    path: {
                        supervisorId: supervisor.user.id ?? "",
                        salesAdvisorId: consultor.user.id ?? ""
                    }
                }
            });

            refetchAssigned();
            toast.success("Consultor removido exitosamente");
        } catch {
            toast.error("Error al remover consultor");
        } finally {
            setIsLoading(false);
        }
    }, [supervisor.user.id, removeMutation, refetchAssigned]);

    const supervisorInitials = supervisor.user.name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ?? "S";

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            isDesktop={isDesktop}
            title="Asignar Consultores"
            description={`Gestionar consultores asignados a ${supervisor.user.name}`}
            dialogContentClassName="sm:max-w-6xl px-0"
            dialogScrollAreaClassName="h-[70vh] px-0"
            drawerScrollAreaClassName="h-[60vh] px-0 pb-4"
        >
            <div className="space-y-6">
                {/* Header con información del supervisor */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={undefined} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 font-semibold">
                            {supervisorInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-slate-900">{supervisor.user.name}</h3>
                        <p className="text-sm text-slate-500">Supervisor</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                            <Users className="w-3 h-3 mr-1" />
                            {assignedConsultors.length} asignados
                        </Badge>
                    </div>
                </div>

                {/* Barra de búsqueda */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Buscar consultores..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Contenido principal - layout vertical */}
                <div className="space-y-6">
                    {/* Sección de consultores disponibles */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-900 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Consultores Disponibles
                            </h4>
                            <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-amber-200">
                                {filteredAvailableConsultors.length}
                            </Badge>
                        </div>

                        <div className="border rounded-lg bg-card">
                            <div
                                className="max-h-[300px] overflow-auto"
                                onScroll={(e) => {
                                    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                                    if (scrollHeight - scrollTop <= clientHeight + 10) {
                                        handleScrollEnd();
                                    }
                                }}
                            >
                                <div className="p-3 space-y-2">
                                    {isLoadingConsultors ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : filteredAvailableConsultors.length > 0 ? (
                                        filteredAvailableConsultors.map((consultor: ConsultorType) => (
                                            <ConsultorItem
                                                key={consultor.user.id}
                                                user={consultor}
                                                isSelected={selectedConsultors.some((c) => c.user.id === consultor.user.id)}
                                                onToggle={toggleConsultorSelection}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                                            <p>No hay consultores disponibles</p>
                                        </div>
                                    )}

                                    {/* Indicador de carga para scroll infinito */}
                                    {isFetchingNextPage && (
                                        <div className="flex items-center justify-center py-4">
                                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mr-2" />
                                            <span className="text-sm text-muted-foreground">Cargando más consultores...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Separador */}
                    <Separator />

                    {/* Sección de consultores asignados */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-900 flex items-center gap-2">
                                <UserCheck className="w-4 h-4" />
                                Consultores Asignados
                            </h4>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                                {filteredAssignedConsultors.length}
                            </Badge>
                        </div>

                        <div className="border rounded-lg bg-card">
                            <div className="max-h-[300px] overflow-auto">
                                <div className="p-3 space-y-2">
                                    {isLoadingAssigned ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : filteredAssignedConsultors.length > 0 ? (
                                        filteredAssignedConsultors.map((consultor: AssignedConsultorType) => (
                                            <div
                                                key={consultor.id}
                                                className="flex items-center gap-3 p-3 rounded-lg border bg-emerald-50 border-emerald-200"
                                            >
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={undefined} />
                                                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">
                                                        {consultor.name
                                                            ?.split(" ")
                                                            .map((n: string) => n[0])
                                                            .join("")
                                                            .toUpperCase()
                                                            .slice(0, 2) ?? "U"}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-foreground truncate">
                                                        {consultor.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {consultor.email}
                                                    </p>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveConsultor(consultor as UserGetDTO)}
                                                    disabled={isLoading}
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <UserCheck className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                                            <p>No hay consultores asignados</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer con acciones */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        {selectedConsultors.length > 0 && (
                            <span>{selectedConsultors.length} consultor(es) seleccionado(s)</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={handleAssignConsultors}
                            disabled={selectedConsultors.length === 0 || isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <ArrowRight className="w-4 h-4 mr-2" />
                            )}
                            Asignar ({selectedConsultors.length})
                        </Button>
                    </div>
                </div>
            </div>
        </ResponsiveDialog>
    );
}
