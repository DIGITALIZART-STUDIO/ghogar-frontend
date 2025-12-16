import { Calendar, Home, Mail, MoreHorizontal, Phone } from "lucide-react";

import { TaskTypes } from "../_types/leadTask";

export const TaskTypesConfig: Record<
  TaskTypes,
  {
    label: string;
    icon: React.ElementType;
    className: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    hoverBg: string;
    hoverText: string;
  }
> = {
    [TaskTypes.Call]: {
        label: "Llamada",
        icon: Phone,
        className: "text-blue-700 border-blue-200",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        hoverBg: "hover:bg-blue-100",
        hoverText: "hover:text-blue-800",
    },
    [TaskTypes.Meeting]: {
        label: "Reunión",
        icon: Calendar,
        className: "text-purple-700 border-purple-200",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        hoverBg: "hover:bg-purple-100",
        hoverText: "hover:text-purple-800",
    },
    [TaskTypes.Email]: {
        label: "Email",
        icon: Mail,
        className: "text-amber-700 border-amber-200",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        hoverBg: "hover:bg-amber-100",
        hoverText: "hover:text-amber-800",
    },
    [TaskTypes.Visit]: {
        label: "Visita",
        icon: Home,
        className: "text-green-700 border-green-200",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-700",
        hoverBg: "hover:bg-green-100",
        hoverText: "hover:text-green-800",
    },
    [TaskTypes.Other]: {
        label: "Otro",
        icon: MoreHorizontal,
        className: "text-gray-700 border-gray-200",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        textColor: "text-gray-700",
        hoverBg: "hover:bg-gray-100",
        hoverText: "hover:text-gray-800",
    },
};

// Función auxiliar para obtener solo el icono
export const getTaskIcon = (type: TaskTypes) => {
    const Icon = TaskTypesConfig[type]?.icon || MoreHorizontal;
    return <Icon className="h-4 w-4" />;
};

// Función para obtener la etiqueta del tipo de tarea
export const getTaskLabel = (type: TaskTypes): string => TaskTypesConfig[type]?.label || "Desconocido";

// Función para obtener clases completas basadas en el tipo
export const getTaskClasses = (type: TaskTypes): string => {
    const config = TaskTypesConfig[type] || TaskTypesConfig[TaskTypes.Other];
    return `${config.bgColor} ${config.borderColor} ${config.textColor}`;
};

// Función para obtener clases con efectos hover
export const getTaskInteractiveClasses = (type: TaskTypes): string => {
    const config = TaskTypesConfig[type] || TaskTypesConfig[TaskTypes.Other];
    return `${config.bgColor} ${config.borderColor} ${config.textColor} ${config.hoverBg} ${config.hoverText}`;
};
