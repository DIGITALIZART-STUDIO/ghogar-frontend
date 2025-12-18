"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Globe,
  Heart,
  IdCard,
  Mail,
  MapPin,
  Percent,
  Phone,
  RefreshCcw,
  Target,
  User,
  Users,
} from "lucide-react";

import ContactItem from "@/app/(admin)/clients/_components/table/ContactItem";
import { CoOwner, SeparatePropertyData } from "@/app/(admin)/clients/_types/client";
import { ClientTypesLabels } from "@/app/(admin)/clients/_utils/clients.utils";
import { Lead } from "@/app/(admin)/leads/_types/lead";
import { LeadCaptureSourceLabels, LeadCompletionReasonLabels } from "@/app/(admin)/leads/_utils/leads.utils";
import LogoWhatsapp from "@/assets/icons/LogoWhatsapp";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LeadStatusLabels } from "../../_utils/assignments.utils";

interface AssignmentDescriptionProps {
  row: Lead;
}

export const AssignmentDescription = ({ row }: AssignmentDescriptionProps) => {
  const [showCoOwners, setShowCoOwners] = useState(false);
  const [showSpouseInfo, setShowSpouseInfo] = useState(false);

  // Verificación global para row y row.project
  if (!row) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/60 dark:to-red-800/60 border border-red-200 dark:border-red-700 rounded-xl shadow-md p-10 my-8">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">Información no disponible</h2>
        <p className="text-sm text-red-600 dark:text-red-200">
          No se pudo cargar la información de la asignación o el proyecto.
          <br />
          Por favor, verifica los datos o intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  // Parse JSON data safely
  const parseCoOwners = (): Array<CoOwner> => {
    if (!row.client?.coOwners) {
      return [];
    }
    try {
      return JSON.parse(row.client.coOwners);
    } catch {
      return [];
    }
  };

  const parseSeparatePropertyData = (): SeparatePropertyData | null => {
    if (!row.client?.separatePropertyData) {
      return null;
    }
    try {
      return JSON.parse(row.client.separatePropertyData);
    } catch {
      return null;
    }
  };

  const coOwners = parseCoOwners();
  const separatePropertyData = parseSeparatePropertyData();

  // Get configurations
  const clientTypeConfig = row.client?.type
    ? ClientTypesLabels[row.client.type as keyof typeof ClientTypesLabels] || ClientTypesLabels.Natural
    : ClientTypesLabels.Natural;
  const statusInfo = LeadStatusLabels[row.status as keyof typeof LeadStatusLabels] || LeadStatusLabels.Registered;
  const captureSourceInfo =
    LeadCaptureSourceLabels[row.captureSource as keyof typeof LeadCaptureSourceLabels] ||
    LeadCaptureSourceLabels.Company;
  const completionReasonInfo = row.completionReason
    ? LeadCompletionReasonLabels[row.completionReason as keyof typeof LeadCompletionReasonLabels]
    : null;

  const TypeIcon = clientTypeConfig.icon;
  const StatusIcon = statusInfo.icon;
  const CaptureIcon = captureSourceInfo.icon;

  // Get initials for avatar
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "America/Lima",
    }).format(date);
  };

  // Calculate days until expiration
  const daysUntilExpiration = () => {
    const expirationDate = new Date(row.expirationDate);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const displayName =
    row.client?.type === "Juridico" && row.client?.companyName
      ? row.client.companyName
      : (row.client?.name ?? "Cliente");
  const daysLeft = daysUntilExpiration();
  const isExpiringSoon = daysLeft <= 3 && daysLeft > 0;
  const isExpired = daysLeft <= 0;

  // Si no hay client, mostrar mensaje de error o fallback
  if (!row.client) {
    return (
      <div className="w-full bg-card border border-border rounded-xl overflow-hidden shadow-sm p-8 text-center text-red-600">
        Información de cliente no disponible.
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* BALANCED HEADER */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-4 border-b border-border">
        <div className="flex  flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                <AvatarFallback
                  className={cn(
                    "text-sm font-bold",
                    clientTypeConfig.className.includes("blue")
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                  )}
                >
                  <span className="capitalize text-lg">{getInitials(displayName)}</span>
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-base text-foreground truncate">{displayName}</h3>
              <p className="text-sm text-muted-foreground">
                {row.project ? `Interesado en ${row.project.name}` : "Sin proyecto asignado"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn("text-xs font-medium", statusInfo.className)} variant={"outline"}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </Badge>
                <Badge className={cn("text-xs font-medium", captureSourceInfo.className)} variant={"outline"}>
                  <CaptureIcon className="w-3 h-3 mr-1" />
                  {captureSourceInfo.label}
                </Badge>
                {completionReasonInfo && (
                  <Badge className={cn("text-xs font-medium", completionReasonInfo.className)} variant={"outline"}>
                    {React.createElement(completionReasonInfo.icon, { className: "w-3 h-3 mr-1" })}
                    {completionReasonInfo.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="md:text-right text-center">
            <div
              className={cn(
                "text-2xl font-bold",
                isExpired ? "text-red-600" : isExpiringSoon ? "text-orange-600" : "text-slate-700 dark:text-slate-300"
              )}
            >
              {Math.abs(daysLeft)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {isExpired ? "días vencido" : "días restantes"}
            </div>
          </div>
        </div>
      </div>

      {/* BALANCED MAIN CONTENT */}
      <div className="p-5 space-y-5">
        {/* CLIENT & PROJECT INFO - Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CLIENT INFORMATION */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center md:justify-start justify-center gap-2 pb-2 border-b border-border">
              <User className="w-4 h-4 text-blue-600 shrink-0" />
              <h4 className="font-semibold text-foreground">Información del Cliente</h4>
              <Badge className={cn("text-xs font-medium", clientTypeConfig.className)}>
                <TypeIcon className="w-3 h-3 mr-1 shrink-0" />
                {clientTypeConfig.label}
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Contact Information */}

              {row.client?.phoneNumber && (
                <ContactItem
                  icon={Phone}
                  label="Teléfono"
                  value={row.client.phoneNumber}
                  href={`tel:${row.client.phoneNumber}`}
                  variant="secondary"
                />
              )}

              {row.client?.email && (
                <ContactItem
                  icon={Mail}
                  label="Email"
                  value={row.client.email}
                  href={`mailto:${row.client.email}`}
                  variant="primary"
                />
              )}

              {row.client?.address && (
                <ContactItem
                  icon={MapPin}
                  label="Dirección"
                  value={row.client.address}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${row.client.address}, ${row.client.country}`)}`}
                  variant="danger"
                />
              )}

              {/* Documents Row */}
              <div className="grid gap-3">
                {row.client?.dni && <ContactItem icon={IdCard} label="DNI" value={row.client.dni} variant="default" />}
                {row.client?.ruc && (
                  <ContactItem icon={Briefcase} label="RUC" value={row.client.ruc} variant="default" />
                )}
              </div>

              {/* Additional Client Info */}
              {row.client?.companyName && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:bg-accent/30 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Empresa</div>
                    <div className="text-sm font-semibold text-foreground">{row.client.companyName}</div>
                  </div>
                </div>
              )}

              {row.client?.country && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:bg-accent/30 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">País</div>
                    <div className="text-sm font-semibold text-foreground">{row.client.country}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Expandable Sections */}
            <div className="space-y-2 pt-2">
              {coOwners.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCoOwners(!showCoOwners)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Co-propietarios ({coOwners.length})
                  {showCoOwners ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
                </Button>
              )}

              {row.client?.separateProperty && separatePropertyData && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSpouseInfo(!showSpouseInfo)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Información Conyugal
                  {showSpouseInfo ? (
                    <ChevronDown className="w-4 h-4 ml-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 ml-2" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* PROJECT INFORMATION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Target className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-foreground">Proyecto de Interés</h4>
              {row.project?.isActive && (
                <Badge className="text-xs font-medium text-emerald-800 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-200 dark:border-emerald-700">
                  Activo
                </Badge>
              )}
            </div>

            {row.project ? (
              <div className="space-y-3">
                {/* Project Basic Info */}
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:bg-accent/30 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Target className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Proyecto</div>
                    <div className="text-sm font-semibold text-foreground">{row.project.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:bg-accent/30 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ubicación</div>
                    <div className="text-sm font-semibold text-foreground">{row.project.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:bg-accent/30 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Moneda</div>
                    <div className="text-sm font-semibold text-foreground">{row.project.currency}</div>
                  </div>
                </div>

                {/* Financial Terms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg border border-border bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Percent className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-lg font-bold text-foreground">{row.project.defaultDownPayment}%</div>
                    <div className="text-xs text-muted-foreground">Inicial</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border border-border bg-amber-50/50 dark:bg-amber-950/20">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-lg font-bold text-foreground">{row.project.defaultFinancingMonths}</div>
                    <div className="text-xs text-muted-foreground">Meses</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border border-border bg-violet-50/50 dark:bg-violet-950/20">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <Percent className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="text-lg font-bold text-foreground">{row.project.maxDiscountPercentage}%</div>
                    <div className="text-xs text-muted-foreground">Descuento</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border rounded-lg bg-muted/20">
                <Target className="w-12 h-12 text-muted-foreground mb-3" />
                <h5 className="font-medium text-foreground mb-2">Sin proyecto asignado</h5>
                <p className="text-sm text-muted-foreground">
                  Este lead no tiene un proyecto específico asignado.
                  <br />
                  Puedes asignar un proyecto desde la gestión de leads.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* EXPANDABLE SECTIONS */}
        {showCoOwners && coOwners.length > 0 && (
          <div className="border-t border-border pt-4">
            <h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Co-propietarios ({coOwners.length})
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coOwners.map((coOwner, index) => (
                <div key={index} className="p-3 border border-border rounded-lg bg-muted/20">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                        {getInitials(coOwner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">{coOwner.name}</div>
                      <div className="text-xs text-muted-foreground">DNI: {coOwner.dni}</div>
                      <div className="flex flex-col md:flex-row gap-3 mt-2">
                        {coOwner.email && (
                          <a
                            href={`mailto:${coOwner.email}`}
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{coOwner.email}</span>
                          </a>
                        )}
                        {coOwner.phone && (
                          <a
                            href={`tel:${coOwner.phone}`}
                            className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{coOwner.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showSpouseInfo && separatePropertyData && (
          <div className="border-t border-border pt-4">
            <h5 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              Información Conyugal
            </h5>
            <div className="p-4 border border-border rounded-lg bg-rose-50/50 dark:bg-rose-950/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Estado Civil</div>
                  <div className="text-sm font-semibold text-foreground">{separatePropertyData.maritalStatus}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cónyuge</div>
                  <div className="text-sm font-semibold text-foreground">{separatePropertyData.spouseName}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">DNI Cónyuge</div>
                  <div className="text-sm font-semibold text-foreground">{separatePropertyData.spouseDni}</div>
                </div>
                <div className="flex gap-3">
                  {separatePropertyData.email && (
                    <a
                      href={`mailto:${separatePropertyData.email}`}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{separatePropertyData.email}</span>
                    </a>
                  )}
                  {separatePropertyData.phone && (
                    <a
                      href={`tel:${separatePropertyData.phone}`}
                      className="text-sm text-green-600 hover:text-green-700 flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{separatePropertyData.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE & ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-col md:flex-row items-center md:justify-start justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Ingreso: {formatDate(row.entryDate)}</span>
            </div>
            <span className="hidden md:block">•</span>
            <div
              className={cn(
                "flex items-center gap-1",
                isExpired ? "text-red-600" : isExpiringSoon ? "text-orange-600" : ""
              )}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>Vence: {formatDate(row.expirationDate)}</span>
            </div>
            {(row.recycleCount ?? 0) > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1 text-orange-600">
                  <RefreshCcw className="w-4 h-4" />
                  <span>Reciclado {row.recycleCount ?? 0}x</span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {row.client?.phoneNumber && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://wa.me/${row.client?.phoneNumber.replace(/\+/g, "")}`, "_blank")}
                className="text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-950/30"
              >
                <LogoWhatsapp className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
            )}
            {row.client?.email && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`mailto:${row.client?.email}`, "_blank")}
                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950/30"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
