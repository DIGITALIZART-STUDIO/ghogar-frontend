"use client";

import { toast } from "sonner";
import { useReactivateUser } from "../../_hooks/useUser";
import type { UserGetDTO } from "../../_types/user";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

interface ReactivateUsersDialogProps {
  user: UserGetDTO
  onSuccess?: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReactivateUsersDialog({ user, onSuccess, open, onOpenChange }: ReactivateUsersDialogProps) {
    const reactivateUserMutation = useReactivateUser();

    const handleReactivateUser = async () => {
        if (!user.user.id) {
            toast.error("No hay usuarios válidos para reactivar");
            return;
        }

        const promise = reactivateUserMutation.mutateAsync({
            params: {
                path: { userId: user.user.id },
            },
        });

        toast.promise(promise, {
            loading: "Reactivando usuario...",
            success: "Usuario reactivado correctamente",
            error: (e) => `Error al reactivar: ${e.message ?? e}`,
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
                    Esta acción reactivará a<span className="font-medium"> un usuario.</span>
                </>
            }
            confirmText="Reactivar"
            cancelText="Cancelar"
            variant="default"
            showTrigger={false}
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={handleReactivateUser}
            onSuccess={onSuccess}
        />
    );
}
