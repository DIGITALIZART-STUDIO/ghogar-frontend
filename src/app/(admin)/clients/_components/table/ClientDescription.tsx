"use client";

import { Briefcase, Building, FileText, IdCard, Mail, MapPin, Phone, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Client, ClientTypes } from "../../_types/client";

interface ClientDescriptionProps {
  row: Client;
}

export const ClientDescription = ({ row }: ClientDescriptionProps) => {
    // Get initials for avatar
    const getInitials = (name: string) => name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 2);

    // Determine client type styling
    const clientTypeConfig = {
        [ClientTypes.Natural]: {
            label: "Cliente Natural",
            className: "border-blue-200 text-blue-700",
            bgClass: "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/20",
            icon: User,
        },
        [ClientTypes.Juridico]: {
            label: "Cliente Jurídico",
            className: "border-green-200 text-green-700",
            bgClass: "from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-950/20",
            icon: Building,
        },
        default: {
            label: "Cliente",
            className: "border-primary text-primary",
            bgClass: "from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
            icon: User,
        },
    };

    const typeConfig = clientTypeConfig[row.type as ClientTypes] || clientTypeConfig.default;
    const TypeIcon = typeConfig.icon;

    // Determine which name to display
    const displayName = row.type === ClientTypes.Juridico && row.companyName ? row.companyName : row.name;

    return (
        <Card className="mx-auto w-full max-w-4xl overflow-hidden shadow-md pt-0 pb-2">
            <CardHeader className={`bg-gradient-to-r ${typeConfig.bgClass} py-4 px-6 pb-2`}>
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    {/* Avatar with styled border */}
                    <div className="shrink-0">
                        <div className={cn("p-1.5 rounded-full", `border-3 ${typeConfig.className}`)}>
                            <Avatar className="h-20 w-20 capitalize bg-white">
                                <AvatarFallback className="bg-gradient-to-br from-white to-gray-50 text-primary">
                                    <span className="text-3xl font-medium">
                                        {getInitials(displayName)}
                                    </span>
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Main information */}
                    <div className="flex-grow space-y-3 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <CardTitle className="text-2xl font-semibold">
                                {displayName}
                            </CardTitle>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "md:ml-2 text-xs font-medium py-1 px-3",
                                    row.isActive
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
                                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:border-red-800",
                                )}
                            >
                                {row.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
                            {/* Client type badge */}
                            <Badge variant="outline" className={cn("flex items-center gap-1 py-1.5 px-3", typeConfig.className)}>
                                <TypeIcon className="h-3.5 w-3.5 shrink-0" />
                                <span>
                                    {typeConfig.label}
                                </span>
                            </Badge>

                            {/* Show legal name if different from display name for Juridico */}
                            {row.type === ClientTypes.Juridico && row.companyName && row.companyName !== row.name && (
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-1 py-1.5 px-3 border-purple-200 text-purple-700 dark:border-purple-800"
                                >
                                    <FileText className="h-3.5 w-3.5 shrink-0" />
                                    <span>
                                        Razón Social:
                                        {row.name}
                                    </span>
                                </Badge>
                            )}

                            {/* Display co-owner if available */}
                            {row.coOwner && (
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-1 py-1.5 px-3 border-amber-200 text-amber-700 dark:border-amber-800"
                                >
                                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                                    <span>
                                        Co-propietario:
                                        {row.coOwner}
                                    </span>
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            {/* Main content */}
            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                    {/* Personal information section */}
                    <div className="px-6 py-2 space-y-5">
                        <div className="flex items-center text-sm font-medium text-primary mb-4 pb-2 border-b">
                            <User className="mr-2 h-4 w-4 shrink-0" />
                            <h3>
                                Información de Contacto
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 group">
                                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        Email
                                    </p>
                                    {row.email ? (
                                        <p className="text-sm font-medium mt-1">
                                            {row.email}
                                        </p>
                                    ) : (
                                        <p className="text-sm italic text-muted-foreground mt-1">
                                            No registrado
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-950/30 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        Teléfono
                                    </p>
                                    <p className="text-sm font-medium mt-1">
                                        {row.phoneNumber || "No registrado"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="h-10 w-10 rounded-full bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        Dirección
                                    </p>
                                    <p className="text-sm font-medium mt-1 break-words">
                                        {row.address}
                                    </p>
                                </div>
                            </div>

                            {/* Show DNI if available */}
                            {row.dni && (
                                <div className="flex items-start gap-4 group">
                                    <div className="h-10 w-10 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
                                        <IdCard className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                            DNI
                                        </p>
                                        <p className="text-sm font-medium mt-1">
                                            {row.dni}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Business information section */}
                    <div className="px-6 py-2 space-y-5">
                        <div className="flex items-center text-sm font-medium text-primary mb-4 pb-2 border-b">
                            <Building className="mr-2 h-4 w-4 shrink-0" />
                            <h3>
                                Información Empresarial
                            </h3>
                        </div>

                        {row.companyName || row.ruc ? (
                            <div className="space-y-4">
                                {/* Show company name if available */}
                                {row.companyName && (
                                    <div className="flex items-start gap-4 group">
                                        <div className="h-10 w-10 rounded-full bg-cyan-50 dark:bg-cyan-950/30 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-100 transition-colors">
                                            <Building className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                                Nombre Comercial
                                            </p>
                                            <p className="text-sm font-medium mt-1">
                                                {row.companyName}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Show RUC if available */}
                                {row.ruc && (
                                    <div className="flex items-start gap-4 group">
                                        <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                                            <IdCard className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                                RUC
                                            </p>
                                            <p className="text-sm font-medium mt-1">
                                                {row.ruc}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Show legal name if different from display name for Juridico */}
                                {row.type === ClientTypes.Juridico && row.name !== row.companyName && (
                                    <div className="flex items-start gap-4 group">
                                        <div className="h-10 w-10 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 group-hover:bg-rose-100 transition-colors">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                                Razón Social
                                            </p>
                                            <p className="text-sm font-medium mt-1">
                                                {row.name}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
                                <Building className="h-12 w-12 text-muted-foreground/30 mb-2" />
                                <p>
                                    No se registró información empresarial
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
