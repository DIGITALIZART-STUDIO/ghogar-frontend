"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { usePaginatedUsersWithSearch } from "../../_hooks/useLeads";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { components } from "@/types/api";
import { getUserRoleLabel } from "@/app/(admin)/admin/users/_utils/user.utils";

type UserSummary = components["schemas"]["UserSummaryDto"];

interface UserSearchProps {
    disabled?: boolean;
    value: string;
    onSelect: (userId: string, user: UserSummary) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    preselectedId?: string;
}

export function UserSearch({
    disabled,
    value,
    onSelect,
    placeholder = "Selecciona un usuario...",
    searchPlaceholder = "Buscar por nombre, email, rol...",
    emptyMessage = "No se encontraron usuarios",
    preselectedId,
}: UserSearchProps) {
    const { allUsers, query, handleScrollEnd, handleSearchChange, search } = usePaginatedUsersWithSearch(10, preselectedId);

    const userOptions: Array<Option<UserSummary>> = useMemo(() => allUsers.map((user) => {
        const primaryRole = user.roles?.[0] ?? "Other";
        const roleConfig = getUserRoleLabel(primaryRole);
        const RoleIcon = roleConfig.icon;

        return {
            value: user.id ?? "",
            label: user.userName ?? "Sin nombre",
            entity: user,
            component: (
                <div className="grid grid-cols-2 gap-2 w-full" title={user.userName ?? "Sin nombre"}>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold truncate">
                            {user.userName ?? "Sin nombre"}
                        </span>
                        <div className="text-xs text-muted-foreground flex flex-col gap-2">
                            {user.email && (
                                <Badge variant="secondary" className="text-xs font-semibold">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {user.email}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                        <Badge
                            className={cn(
                                "text-xs font-semibold bg-transparent",
                                roleConfig.className
                            )}
                        >
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {roleConfig.label}
                        </Badge>
                    </div>
                </div>
            ),
        };
    }), [allUsers]);

    const selectedUser = userOptions.find((user) => user.value === value);

    const handleSelect = ({ value, entity }: Option<UserSummary>) => {
        if (!entity) {
            toast.error("No se pudo seleccionar el usuario. Por favor, inténtalo de nuevo.");
            return;
        }
        onSelect(value, entity);
    };

    return (
        <AutoComplete<UserSummary>
            queryState={query}
            options={userOptions}
            value={selectedUser}
            onValueChange={handleSelect}
            onSearchChange={handleSearchChange}
            onScrollEnd={handleScrollEnd}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={
                search !== "" ? `No se encontraron resultados para "${search}"` : emptyMessage
            }
            debounceMs={400}
            regexInput={/^[a-zA-Z0-9\s\-.@]*$/}
            className="w-full"
            commandContentClassName="min-w-[400px]"
            variant="outline"
            disabled={disabled}
            showComponentOnSelection={false}
        />
    );
}
