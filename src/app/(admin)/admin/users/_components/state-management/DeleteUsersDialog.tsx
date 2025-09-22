"use client";

import { toast } from "sonner";
import { useDeactivateUser } from "../../_hooks/useUser";
import type { UserGetDTO } from "../../_types/user";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

interface DeleteUsersDialogProps {
  user: UserGetDTO
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteUsersDialog({ user, onSuccess, open, onOpenChange }: DeleteUsersDialogProps) {
    const deactivateUserMutation = useDeactivateUser();

    const handleDeleteUser = async () => {
        if (!user.user.id) {
            toast.error("No hay usuario seleccionado para eliminar.");
            return;
        }

        const promise = deactivateUserMutation.mutateAsync({
            params: {
                path: { userId: user.user.id },
            },
        });

        toast.promise(promise, {
            loading: "Eliminando usuario...",
            success: "Usuario eliminado correctamente",
            error: (e) => `Error al eliminar: ${e.message ?? e}`,
        });

        promise.then(() => {
            if (onSuccess) {
                onSuccess();
            }
        });
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
