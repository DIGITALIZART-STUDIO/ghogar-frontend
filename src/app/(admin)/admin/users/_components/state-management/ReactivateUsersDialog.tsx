"use client";

import { toast } from "sonner";
import { toastWrapper } from "@/types/toasts";
import { ReactivateUser } from "../../actions";
import type { UserGetDTO } from "../../_types/user";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

interface ReactivateUsersDialogProps {
  user: UserGetDTO
  onSuccess?: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReactivateUsersDialog({ user, onSuccess, open, onOpenChange }: ReactivateUsersDialogProps) {
    const handleReactivateUser = async () => {
    // Si no hay IDs válidos, mostrar error y salir
        if (!user.user.id) {
            toast.error("No hay usuarios válidos para reactivar");
            return;
        }

        const [, error] = await toastWrapper(ReactivateUser(user.user.id), {
            loading: "Reactivando usuario...",
            success: "Usuario reactivado correctamente",
            error: (e) => `Error al reactivar: ${e.message}`,
        });

        if (error) {
            throw error;
        }
    };

    return (
        <ConfirmationDialog
            title="¿Estás absolutamente seguro?"
            description={
                <>
                    Esta acción reactivará a<span className="font-medium"> un usuario.</span>
                </>
            }
            confirmText="Reactivar"
            cancelText="Cancelar"
            variant="default" // No es destructivo, es una acción de reactivación
            showTrigger={false}
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={handleReactivateUser}
            onSuccess={onSuccess}
        />
    );
}
