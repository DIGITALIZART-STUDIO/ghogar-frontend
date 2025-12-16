"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-provider";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export function LogoutButton({
    variant = "ghost",
    size = "default",
    className,
    children,
    showIcon = true
}: LogoutButtonProps) {
    const { handleLogout } = useAuthContext();

    const handleClick = async () => {
        try {
            await handleLogout();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleClick}
        >
            {showIcon && <LogOut className="mr-2 h-4 w-4" />}
            {children ?? "Cerrar sesión"}
        </Button>
    );
}
