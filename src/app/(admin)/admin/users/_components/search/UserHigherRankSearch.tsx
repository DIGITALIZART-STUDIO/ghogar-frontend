"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Mail} from "lucide-react";

import { usePaginatedUsersWithHigherRankWithSearch } from "../../_hooks/useUser";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getUserRoleLabel } from "../../_utils/user.utils";
import { UserHigherRankDTO } from "../../_types/user";

interface UserHigherRankSearchProps {
    disabled?: boolean;
    value: string;
    onSelect: (userId: string, user: UserHigherRankDTO) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    preselectedId?: string;
}

export function UserHigherRankSearch({
    disabled,
    value,
    onSelect,
    placeholder = "Selecciona un supervisor...",
    searchPlaceholder = "Buscar por nombre, email, rol...",
    emptyMessage = "No se encontraron supervisores",
    preselectedId,
}: UserHigherRankSearchProps) {
    const { allUsers, query, handleScrollEnd, handleSearchChange, search } = usePaginatedUsersWithHigherRankWithSearch(10, preselectedId);

    const userOptions: Array<Option<UserHigherRankDTO>> = useMemo(() => allUsers.map((user) => {
        const primaryRole = user.roles?.[0];
        const roleInfo = primaryRole ? getUserRoleLabel(primaryRole) : getUserRoleLabel("Other");

        return {
            value: user.id ?? "",
            label: user.name ?? "Usuario sin nombre",
            entity: user,
            component: (
                <div className="grid grid-cols-2 gap-2 w-full" title={user.name ?? "Usuario sin nombre"}>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold truncate">
                            {user.name ?? "Usuario sin nombre"}
                        </span>
                        <div className="text-xs text-muted-foreground flex flex-col gap-1">
                            {user.email && (
                                <Badge variant="outline" className="text-xs font-semibold">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {user.email}
                                </Badge>
                            )}
                            {user.phoneNumber && (
                                <Badge variant="secondary" className="text-xs font-semibold">
                                    {user.phoneNumber}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                        <Badge
                            className={cn(
                                "text-xs font-semibold bg-transparent",
                                roleInfo.className
                            )}
                        >
                            <roleInfo.icon className="w-3 h-3 mr-1" />
                            {roleInfo.label}
                        </Badge>
                        {user.roles && user.roles.length > 1 && (
                            <Badge variant="outline" className="text-xs">
                                +{user.roles.length - 1} rol{user.roles.length > 2 ? "es" : ""}
                            </Badge>
                        )}
                    </div>
                </div>
            ),
        };
    }), [allUsers]);

    const selectedUser = userOptions.find((user) => user.value === value);

    const handleSelect = ({ value, entity }: Option<UserHigherRankDTO>) => {
        if (!entity) {
            toast.error("No se pudo seleccionar el supervisor. Por favor, inténtalo de nuevo.");
            return;
        }
        onSelect(value, entity);
    };

    return (
        <AutoComplete<UserHigherRankDTO>
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
