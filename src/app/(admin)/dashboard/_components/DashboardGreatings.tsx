"use client";

import { useEffect, useState, useMemo } from "react";
import { Moon, Sun, Sunrise, Sunset,  Sparkles } from "lucide-react";
import { getUserRoleLabel } from "../../admin/users/_utils/user.utils";

interface DashboardGreetingProps {
  userName: string;
  role: string;
}

// Hook personalizado para manejar la hora del día de forma eficiente
function useTimeOfDay() {
    const [timeOfDay, setTimeOfDay] = useState(() => {
        const hours = new Date().getHours();
        if (hours >= 5 && hours < 12) {
            return "morning";
        }
        if (hours >= 12 && hours < 18) {
            return "afternoon";
        }
        if (hours >= 18 && hours < 22) {
            return "evening";
        }
        return "night";
    });

    useEffect(() => {
        const checkTimeChange = () => {
            const hours = new Date().getHours();
            let newTimeOfDay: string;

            if (hours >= 5 && hours < 12) {
                newTimeOfDay = "morning";
            } else if (hours >= 12 && hours < 18) {
                newTimeOfDay = "afternoon";
            } else if (hours >= 18 && hours < 22) {
                newTimeOfDay = "evening";
            } else {
                newTimeOfDay = "night";
            }

            if (newTimeOfDay !== timeOfDay) {
                setTimeOfDay(newTimeOfDay);
            }
        };

        // Verificar cada minuto si cambió la hora del día
        const interval = setInterval(checkTimeChange, 60000);

        // Verificar inmediatamente si estamos cerca de un cambio de hora
        const now = new Date();
        const minutesUntilNextHour = 60 - now.getMinutes();
        const secondsUntilNextHour = minutesUntilNextHour * 60 - now.getSeconds();

        // Programar el próximo check exacto al cambio de hora
        const timeout = setTimeout(() => {
            checkTimeChange();
            // Después del primer check, usar el intervalo normal
        }, secondsUntilNextHour * 1000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [timeOfDay]);

    return timeOfDay;
}

export function DashboardGreeting({ userName = "Administrador", role = "Administrador" }: DashboardGreetingProps) {
    const timeOfDay = useTimeOfDay();
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Memoizar el saludo y icono basado en la hora del día
    const greetingData = useMemo(() => {
        switch (timeOfDay) {
        case "morning":
            return {
                greeting: "¡Buenos días",
                icon: <Sunrise className="h-8 w-8 text-amber-500" />,
                color: "text-amber-600"
            };
        case "afternoon":
            return {
                greeting: "¡Buenas tardes",
                icon: <Sun className="h-8 w-8 text-yellow-500" />,
                color: "text-yellow-600"
            };
        case "evening":
            return {
                greeting: "¡Buenas noches",
                icon: <Sunset className="h-8 w-8 text-orange-500" />,
                color: "text-orange-600"
            };
        default:
            return {
                greeting: "¡Buenas noches",
                icon: <Moon className="h-8 w-8 text-indigo-400" />,
                color: "text-indigo-500"
            };
        }
    }, [timeOfDay]);

    // Efecto para animar transiciones cuando cambia la hora
    useEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => setIsTransitioning(false), 500);
        return () => clearTimeout(timer);
    }, [timeOfDay]);

    // Memoizar la información del rol
    const roleInfo = useMemo(() => getUserRoleLabel(role), [role]);

    return (
        <div className="pb-4">
            <div className="flex items-center gap-3">
                {/* Icono del saludo con transición suave */}
                <div
                    className={`bg-white/80 dark:bg-slate-800/80 p-3 rounded-full border border-slate-200 dark:border-slate-700 transition-all duration-500 ${
                        isTransitioning ? "scale-110 rotate-12" : "scale-100 rotate-0"
                    }`}
                >
                    {greetingData.icon}
                </div>

                <div className="space-y-1 flex-1">
                    {/* Saludo principal */}
                    <div className="flex items-center gap-2">
                        <h1
                            className={`text-3xl capitalize font-bold tracking-tight dark:text-slate-200 transition-all duration-500 ${
                                isTransitioning ? "opacity-70 scale-105" : "opacity-100 scale-100"
                            }`}
                        >
                            {greetingData.greeting}, {userName}!
                        </h1>
                        {isTransitioning && (
                            <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                        )}
                    </div>

                    {/* Información del rol y sesión */}
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground font-medium">
                            Bienvenido de nuevo
                        </span>
                        <span className={`text-sm font-medium ${roleInfo.className}`}>
                            {roleInfo.label}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium">
                            al Panel Administrativo
                        </span>

                    </div>
                </div>
            </div>
        </div>
    );
}
