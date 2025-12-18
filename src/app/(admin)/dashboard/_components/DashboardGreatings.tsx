"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Sunrise, Sunset } from "lucide-react";

interface DashboardGreetingProps {
  userName: string;
}

export function DashboardGreeting({ userName = "Administrador" }: DashboardGreetingProps) {
    const [greeting, setGreeting] = useState("");
    const [icon, setIcon] = useState<React.ReactNode>(<Sun className="h-8 w-8" />);

    useEffect(() => {
        const hours = new Date().getHours();

        // Determinar el saludo y el icono según la hora del día
        if (hours >= 5 && hours < 12) {
            setGreeting("¡Buenos días");
            setIcon(<Sunrise className="h-8 w-8 text-amber-500" />);
        } else if (hours >= 12 && hours < 18) {
            setGreeting("¡Buenas tardes");
            setIcon(<Sun className="h-8 w-8 text-yellow-500" />);
        } else if (hours >= 18 && hours < 22) {
            setGreeting("¡Buenas noches");
            setIcon(<Sunset className="h-8 w-8 text-orange-500" />);
        } else {
            setGreeting("¡Buenas noches");
            setIcon(<Moon className="h-8 w-8 text-indigo-400" />);
        }
    }, []);

    return (
        <div className="pb-4">
            <div className="flex items-center gap-3">
                <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-full shadow-sm">{icon}</div>
                <div className="space-y-1">
                    <h1 className="text-3xl capitalize font-bold tracking-tight bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                        {greeting}, {userName}!
                    </h1>
                    <p className="text-muted-foreground">Bienvenido de nuevo al Panel Administrativo</p>
                </div>
            </div>
        </div>
    );
}
