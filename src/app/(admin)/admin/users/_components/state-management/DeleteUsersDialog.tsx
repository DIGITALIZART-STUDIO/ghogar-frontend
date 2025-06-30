"use client";

import { toast } from "sonner";
import { toastWrapper } from "@/types/toasts";
import { DeactivateUser } from "../../actions";
import type { UserGetDTO } from "../../_types/user";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

interface DeleteUsersDialogProps {
  user: UserGetDTO
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteUsersDialog({ user, onSuccess, open, onOpenChange }: DeleteUsersDialogProps) {
    const handleDeleteUser = async () => {
    // Si no hay IDs válidos, mostrar error y salir
        if (!user.user.id) {
            toast.error("No hay usuario seleccionado para eliminar.");
            return;
        }

        const [, error] = await toastWrapper(DeactivateUser(user.user.id), {
            loading: "Eliminando usuario...",
            success: "Usuario eliminado correctamente",
            error: (e) => `Error al eliminar: ${e.message}`,
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
                    Esta acción eliminará a<span className="font-medium"> un usuario. Esta acción no se puede deshacer.</span>
                </>
            }
            confirmText="Eliminar"
            cancelText="Cancelar"
            variant="destructive"
            showTrigger={false}
            onConfirm={handleDeleteUser}
            onSuccess={onSuccess}
            open={open}
            onOpenChange={onOpenChange}
        />
    );
}
