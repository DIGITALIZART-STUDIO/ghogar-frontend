"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth-provider";
import { FullPageLoader } from "@/components/ui/loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuthContext();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    // Mostrar loader mientras se verifica la autenticación
    if (isLoading) {
        return <FullPageLoader text="Verificando autenticación..." />;
    }

    // Si no está autenticado, no mostrar nada (redirige en useEffect)
    if (!isAuthenticated) {
        return null;
    }

    return children;
}
