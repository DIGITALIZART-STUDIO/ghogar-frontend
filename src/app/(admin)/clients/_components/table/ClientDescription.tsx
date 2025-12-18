"use client";

import { useState } from "react";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileText,
  Globe,
  Heart,
  IdCard,
  Mail,
  MapPin,
  Phone,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Client, CoOwner, SeparatePropertyData } from "../../_types/client";
import { ClientTypesLabels } from "../../_utils/clients.utils";
import ContactItem from "./ContactItem";

interface ClientDescriptionProps {
  row: Client;
}
export const ClientDescription = ({ row }: ClientDescriptionProps) => {
  const [showAllCoOwners, setShowAllCoOwners] = useState(false);

  // Parse JSON data safely
  const parseCoOwners = (): Array<CoOwner> => {
    if (!row.coOwners) {
      return [];
    }
    try {
      return JSON.parse(row.coOwners);
    } catch {
      return [];
    }
  };

  const parseSeparatePropertyData = (): SeparatePropertyData | null => {
    if (!row.separatePropertyData) {
      return null;
    }
    try {
      return JSON.parse(row.separatePropertyData);
    } catch {
      return null;
    }
  };

  const coOwners = parseCoOwners();
  const separatePropertyData = parseSeparatePropertyData();

  // Get client type config
  const clientTypeConfig = ClientTypesLabels[row.type as keyof typeof ClientTypesLabels] || ClientTypesLabels.Natural;
  const TypeIcon = clientTypeConfig.icon;

  // Get initials for avatar
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);

  // Determine which name to display
  const displayName = row.type === "Juridico" && row.companyName ? row.companyName : (row.name ?? "Cliente");

  return (
    <div className="w-full bg-card border border-border rounded-xl overflow-hidden">
      {/* Header Section - Using client type colors */}
      <div
        className={cn(
          "relative border-b border-border",
          clientTypeConfig.className.includes("blue")
            ? "bg-blue-50/50 dark:bg-blue-950/20"
            : "bg-green-50/50 dark:bg-green-950/20"
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />

        <div className="relative p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              {/* Enhanced Avatar with client type colors */}
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-border ring-4 ring-accent/20">
                  <AvatarFallback
                    className={cn(
                      "text-lg font-bold",
                      row.type === "Juridico"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    )}
                  >
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Client Info */}
              <div className="space-y-2">
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">{displayName}</h2>
                  {row.type === "Juridico" && row.name && row.name !== row.companyName && (
                    <p className="text-sm text-muted-foreground font-medium">Rep. Legal: {row.name}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={cn("font-medium border", clientTypeConfig.className)}>
                    <TypeIcon className="w-3 h-3 mr-1" />
                    {clientTypeConfig.label}
                  </Badge>

                  <Badge
                    variant={row.isActive ? "outline" : "destructive"}
                    className={cn(
                      "font-medium",
                      row.isActive
                        ? "text-emerald-700 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
                        : ""
                    )}
                  >
                    {row.isActive ? (
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {row.isActive ? "Cliente Activo" : "Inactivo"}
                  </Badge>

                  {row.country && (
                    <Badge variant="outline" className="font-medium">
                      <Globe className="w-3 h-3 mr-1" />
                      {row.country}
                    </Badge>
                  )}

                  {row.separateProperty && (
                    <Badge variant="outline" className="font-medium bg-accent/50">
                      <Heart className="w-3 h-3 mr-1" />
                      Régimen Separación
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{coOwners.length + 1}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {coOwners.length + 1 === 1 ? "Propietario" : "Propietarios"}
                </div>
              </div>
              {(row.dni || row.ruc) && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{row.ruc ? "RUC" : "DNI"}</div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Documento</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Phone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="font-semibold text-foreground">Información de Contacto</h3>
            </div>

            <div className="space-y-3">
              <ContactItem
                icon={Phone}
                label="Teléfono Principal"
                value={row.phoneNumber}
                href={`tel:${row.phoneNumber}`}
                variant="secondary"
              />

              {row.email && (
                <ContactItem
                  icon={Mail}
                  label="Correo Electrónico"
                  value={row.email}
                  href={`mailto:${row.email}`}
                  variant="primary"
                />
              )}

              {row.address && (
                <ContactItem
                  icon={MapPin}
                  label="Dirección Registrada"
                  value={row.address}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${row.address}, ${row.country}`)}`}
                  variant="danger"
                />
              )}

              {row.dni && <ContactItem icon={IdCard} label="Documento Nacional" value={row.dni} variant="default" />}
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="font-semibold text-foreground">Información Empresarial</h3>
            </div>

            {row.companyName || row.ruc ? (
              <div className="space-y-3">
                {row.companyName && (
                  <ContactItem icon={Building2} label="Razón Social" value={row.companyName} variant="primary" />
                )}

                {row.ruc && (
                  <ContactItem
                    icon={Briefcase}
                    label="Registro Único Contribuyente"
                    value={row.ruc}
                    variant="default"
                  />
                )}

                {row.type === "Juridico" && row.name && row.name !== row.companyName && (
                  <ContactItem icon={UserCheck} label="Representante Legal" value={row.name} variant="default" />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Información empresarial no disponible</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Este cliente no tiene datos empresariales registrados
                </p>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="font-semibold text-foreground">Información Adicional</h3>
            </div>

            <div className="space-y-4">
              {/* Co-owners Summary */}
              {coOwners.length > 0 && (
                <div className="border border-border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-sm text-blue-700 dark:text-blue-300">Co-propietarios</span>
                    </div>
                    <Badge className="bg-blue-600 text-white dark:bg-blue-500">{coOwners.length}</Badge>
                  </div>

                  <div className="text-xs text-muted-foreground mb-3">
                    {coOwners
                      .slice(0, 2)
                      .map((co) => co.name)
                      .join(", ")}
                    {coOwners.length > 2 && ` y ${coOwners.length - 2} más`}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllCoOwners(!showAllCoOwners)}
                    className="w-full text-xs border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/30"
                  >
                    {showAllCoOwners ? "Ocultar detalles" : "Ver todos los detalles"}
                    <ChevronDown
                      className={`w-3 h-3 ml-1 transition-transform ${showAllCoOwners ? "rotate-180" : ""}`}
                    />
                  </Button>
                </div>
              )}

              {/* Separate Property */}
              {row.separateProperty && separatePropertyData && (
                <div className="border border-border rounded-lg p-4 bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-sm text-green-700 dark:text-green-300">
                      Información Conyugal
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">Estado Civil:</span>
                      <span className="font-semibold">{separatePropertyData.maritalStatus}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">Cónyuge:</span>
                      <span className="font-semibold">{separatePropertyData.spouseName}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">DNI Cónyuge:</span>
                      <span className="font-semibold">{separatePropertyData.spouseDni}</span>
                    </div>
                  </div>

                  {(separatePropertyData.email || separatePropertyData.phone) && (
                    <>
                      <Separator className="my-3" />
                      <div className="space-y-1">
                        {separatePropertyData.email && (
                          <a
                            href={`mailto:${separatePropertyData.email}`}
                            className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            {separatePropertyData.email}
                          </a>
                        )}
                        {separatePropertyData.phone && (
                          <a
                            href={`tel:${separatePropertyData.phone}`}
                            className="flex items-center gap-2 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            {separatePropertyData.phone}
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Co-owners Section */}
        {showAllCoOwners && coOwners.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold">Detalle Completo de Co-propietarios ({coOwners.length})</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {coOwners.map((coOwner, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-4 bg-card hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-12 h-12 border border-border">
                      <AvatarFallback className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold">
                        {getInitials(coOwner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground truncate">{coOwner.name}</h4>
                      <p className="text-xs text-muted-foreground">Co-propietario #{index + 1}</p>
                      <p className="text-xs text-muted-foreground font-mono">DNI: {coOwner.dni}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {coOwner.email && (
                      <a
                        href={`mailto:${coOwner.email}`}
                        className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40"
                      >
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{coOwner.email}</span>
                      </a>
                    )}

                    {coOwner.phone && (
                      <a
                        href={`tel:${coOwner.phone}`}
                        className="flex items-center gap-2 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors p-2 rounded bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-900/40"
                      >
                        <Phone className="w-3 h-3" />
                        {coOwner.phone}
                      </a>
                    )}

                    {coOwner.address && (
                      <div className="flex items-start gap-2 text-xs text-muted-foreground p-2 rounded bg-muted/30">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{coOwner.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
