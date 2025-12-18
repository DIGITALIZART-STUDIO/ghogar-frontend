"use client";

import React from "react";
import { Building2, Hash, Mail, MapPin, Phone, User } from "lucide-react";

import { useClientById } from "@/app/(admin)/clients/_hooks/useClients";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ClientHoverCardProps {
  clientId?: string;
  clientName: string;
  triggerClassName?: string;
  iconColor?: string;
  iconBgColor?: string;
  additionalInfo?: React.ReactNode;
}

export function ClientHoverCard({
  clientId,
  clientName,
  triggerClassName,
  iconColor = "text-indigo-600 dark:text-indigo-400",
  iconBgColor = "bg-indigo-100 dark:bg-indigo-900 border-indigo-200 dark:border-indigo-800",
  additionalInfo,
}: ClientHoverCardProps) {
  const { data: clientData, isLoading } = useClientById(clientId);

  // Determinar si el cliente está registrado
  const hasClientName = clientName && clientName.trim() !== "" && clientName !== "—";
  const displayName = hasClientName ? clientName : "Cliente no registrado";

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className={`flex items-center gap-3 min-w-48 cursor-help ${triggerClassName ?? ""}`}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${iconBgColor} border`}>
            <User className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span
              className={`font-medium truncate ${
                hasClientName
                  ? "text-slate-900 dark:text-slate-100 capitalize"
                  : "text-gray-500 dark:text-gray-400 italic"
              }`}
            >
              {displayName}
            </span>
            {additionalInfo}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 border-0" align="start">
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          {isLoading ? (
            <LoadingSpinner size="sm" text="Cargando información del cliente..." />
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full ${iconBgColor} flex items-center justify-center border`}>
                  <User className={`h-4 w-4 ${iconColor}`} />
                </div>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                  Información del Cliente
                </span>
              </div>
              <div className="space-y-3">
                {/* Nombre */}
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Nombre Completo</p>
                  {clientData?.name || clientData?.companyName ? (
                    <>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {clientData.name ?? clientData.companyName}
                      </p>
                      {clientData.type && (
                        <span className="text-xs text-muted-foreground mt-1">
                          {clientData.type === "Natural" ? "Persona Natural" : "Persona Jurídica"}
                        </span>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">No registrado</p>
                  )}
                </div>

                {/* Información de contacto */}
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0" />
                    {clientData?.phoneNumber ? (
                      <span className="text-gray-700 dark:text-gray-300">{clientData.phoneNumber}</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 italic">No registrado</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0" />
                    {clientData?.email ? (
                      <span className="text-gray-700 dark:text-gray-300 truncate">{clientData.email}</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 italic">No registrado</span>
                    )}
                  </div>
                  <div className="flex items-start gap-2.5 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
                    {clientData?.address ? (
                      <span className="text-gray-700 dark:text-gray-300">{clientData.address}</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 italic">No registrado</span>
                    )}
                  </div>
                </div>

                {/* Documentos */}
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">DNI:</span>
                      {clientData?.dni ? (
                        <span className="font-mono text-gray-700 dark:text-gray-300">{clientData.dni}</span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic text-sm">No registrado</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">RUC:</span>
                      {clientData?.ruc ? (
                        <span className="font-mono text-gray-700 dark:text-gray-300">{clientData.ruc}</span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic text-sm">No registrado</span>
                      )}
                    </div>
                  </div>
                  {clientData?.type === "Juridico" && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0" />
                      {clientData?.companyName ? (
                        <span className="text-gray-700 dark:text-gray-300">{clientData.companyName}</span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic">No registrado</span>
                      )}
                    </div>
                  )}
                </div>

                {/* País */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2.5 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">País:</span>
                      {clientData?.country ? (
                        <span className="text-gray-700 dark:text-gray-300">{clientData.country}</span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 italic">No registrado</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
