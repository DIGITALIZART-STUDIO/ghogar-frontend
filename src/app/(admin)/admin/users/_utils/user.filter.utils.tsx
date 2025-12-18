import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { UserRoleLabels } from "./user.utils";

// Iconos para estado activo/inactivo
const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CheckCircle2 className={cn(className, "text-emerald-500")} />
);

const InactiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <XCircle className={cn(className, "text-red-500")} />
);

// Generar componentes de icono para roles
const UserRoleIcons = Object.fromEntries(
  Object.entries(UserRoleLabels).map(([role, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [role, IconComponent];
  })
);

// Función para crear faceted filters con callbacks del servidor
export const createFacetedFilters = (
  onIsActiveChange: (values: Array<boolean>) => void,
  onRoleNameChange: (values: Array<string>) => void,
  currentIsActive: Array<boolean> = [],
  currentRoleName: Array<string> = []
) => [
  {
    column: "estado",
    title: "Estado",
    options: [
      {
        label: "Activo",
        value: true,
        icon: ActiveIcon,
      },
      {
        label: "Inactivo",
        value: false,
        icon: InactiveIcon,
      },
    ],
    onFilterChange: onIsActiveChange,
    currentValue: currentIsActive,
  },
  {
    column: "rol",
    title: "Rol",
    options: Object.entries(UserRoleLabels).map(([role, config]) => ({
      label: config.label,
      value: role,
      icon: UserRoleIcons[role],
    })),
    onFilterChange: onRoleNameChange,
    currentValue: currentRoleName,
  },
];

// Filtros estáticos para compatibilidad
export const facetedFilters = [
  {
    column: "estado",
    title: "Estado",
    options: [
      {
        label: "Activo",
        value: true,
        icon: ActiveIcon,
      },
      {
        label: "Inactivo",
        value: false,
        icon: InactiveIcon,
      },
    ],
  },
  {
    column: "rol",
    title: "Rol",
    options: Object.entries(UserRoleLabels).map(([role, config]) => ({
      label: config.label,
      value: role,
      icon: UserRoleIcons[role],
    })),
  },
];
