"use client";

import React from "react";
import { AtSign, Building2, Calendar, FileText, IdCard, Mail, MapPin, MessageSquare, Phone, User } from "lucide-react";

import { ClientTypes } from "@/app/(admin)/clients/_types/client";
import type { Lead } from "@/app/(admin)/leads/_types/lead";
import { LeadCaptureSourceLabels, LeadCompletionReasonLabels } from "@/app/(admin)/leads/_utils/leads.utils";
import { cn } from "@/lib/utils";
import { statusConfig } from "../../_utils/assignments.utils";

interface AssignmentDescriptionProps {
  row: Lead;
}

export const AssignmentDescription = ({ row }: AssignmentDescriptionProps) => {
    if (!row) {
        return null; // Handle case when row is not provided
    }
    // Format date to readable format with Lima, Peru timezone (UTC-5)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("es-PE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "America/Lima",
        }).format(date);
    };

    // Format time with Lima, Peru timezone (UTC-5)
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/Lima",
        }).format(date);
    };

    // Calculate days since creation
    const daysSinceCreation = () => {
        if (!row.createdAt) {
            return 0;
        }
        const createdDate = new Date(row.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - createdDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const currentStatus = statusConfig[row.status as keyof typeof statusConfig] || statusConfig.default;

    const currentReason = LeadCompletionReasonLabels[row.completionReason as keyof typeof LeadCompletionReasonLabels];

    // Obtener la configuración de la fuente de captación
    const captureSourceInfo =
    row.captureSource && LeadCaptureSourceLabels[row.captureSource]
        ? LeadCaptureSourceLabels[row.captureSource]
        : {
            label: "Desconocido",
            icon: MessageSquare,
            className: "text-slate-600 border-slate-200",
        };

    // Extraer los colores de className para crear las clases de estilo
    const captureSourceClass = captureSourceInfo.className ?? "";
    const captureSourceColor = captureSourceClass.split(" ")[0] ?? "text-slate-600";
    const captureSourceBgColor = `${captureSourceColor.replace("text-", "bg-")}/10`;

    // Handle email click
    const handleEmailClick = () => {
        if (row.client?.email) {
            window.location.href = `mailto:${row.client.email}`;
        }
    };

    // Handle WhatsApp click
    const handleWhatsAppClick = () => {
        if (row.client?.phoneNumber) {
            window.open(`https://wa.me/${row.client.phoneNumber.replace(/\+/g, "")}`, "_blank");
        }
    };

    return (
        <div className="w-full overflow-hidden bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            {/* Header with client info - using primary and secondary colors */}
            <div className="relative bg-primary/5 dark:bg-primary/10 py-3 px-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Client info */}
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full",
                                row.client?.type === ClientTypes.Natural
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground"
                            )}
                        >
                            {row.client?.type === ClientTypes.Natural ? (
                                <User className="h-4 w-4" />
                            ) : (
                                <Building2 className="h-4 w-4" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">{row.client?.name}</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 dark:text-slate-400">{row.client?.type}</span>
                                {row.client?.isActive && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                                        Activo
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status and procedency */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div
                            className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                                currentStatus.bgColor,
                                currentStatus.color
                            )}
                        >
                            {currentStatus.icon && React.createElement(currentStatus.icon, { className: "h-3 w-3" })}
                            <span>{currentStatus.label}</span>
                        </div>

                        {/* Mostrar razón solo si existe */}
                        {row.completionReason && currentReason && (
                            <div
                                className={cn(
                                    "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                                    currentReason.className
                                )}
                            >
                                {currentReason.icon && React.createElement(currentReason.icon, { className: "h-3 w-3" })}
                                <span>{currentReason.label}</span>
                            </div>
                        )}

                        <div
                            className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                                captureSourceBgColor,
                                captureSourceColor
                            )}
                        >
                            {React.createElement(captureSourceInfo.icon, { className: "h-3 w-3" })}
                            <span>{captureSourceInfo.label}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left column: Contact info */}
                    <div className="space-y-3">
                        {/* Phone */}
                        {row.client?.phoneNumber && (
                            <div className="relative group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500" />
                                <div className="p-3 pl-4">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-violet-500" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Teléfono</p>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{row.client.phoneNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        {row.client?.email && (
                            <div className="relative group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                                <div className="p-3 pl-4">
                                    <div className="flex items-center gap-2">
                                        <AtSign className="h-4 w-4 text-indigo-500" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{row.client.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Address */}
                        {row.client?.address && (
                            <div className="relative group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500" />
                                <div className="p-3 pl-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-cyan-500" />
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Dirección</p>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{row.client.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* DNI or RUC */}
                        {(row.client?.dni || row.client?.ruc) && (
                            <div className="relative group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                                <div className="p-3 pl-4">
                                    <div className="flex items-center gap-2">
                                        {row.client?.dni ? (
                                            <>
                                                <IdCard className="h-4 w-4 text-amber-500" />
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">DNI</p>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{row.client.dni}</p>
                                                </div>
                                            </>
                                        ) : row.client?.ruc ? (
                                            <>
                                                <FileText className="h-4 w-4 text-amber-500" />
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">RUC</p>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{row.client.ruc}</p>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column: Dates and timeline */}
                    <div className="space-y-3">
                        {/* Created date */}
                        <div className="relative group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500" />
                            <div className="p-3 pl-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-violet-500" />
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Fecha de Registro</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(row.createdAt!)}</p>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{formatTime(row.createdAt!)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modified date */}
                        <div className="relative group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                            <div className="p-3 pl-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-indigo-500" />
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Última Actualización</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                {formatDate(row.modifiedAt!)}
                                            </p>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{formatTime(row.modifiedAt!)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Days since creation */}
                        <div className="relative group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500" />
                            <div className="p-3 pl-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-cyan-500" />
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Antigüedad del Lead</p>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                        {daysSinceCreation()} {daysSinceCreation() === 1 ? "día" : "días"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick actions at the bottom */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap justify-center gap-3">
                    {row.client?.phoneNumber && (
                        <button
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium text-xs hover:bg-emerald-200 dark:hover:bg-emerald-800/30 transition-colors"
                            onClick={handleWhatsAppClick}
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span>WhatsApp</span>
                        </button>
                    )}

                    {row.client?.email && (
                        <button
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium text-xs hover:bg-indigo-200 dark:hover:bg-indigo-800/30 transition-colors"
                            onClick={handleEmailClick}
                        >
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
