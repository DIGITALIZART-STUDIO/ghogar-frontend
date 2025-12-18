"use client";

import { useTransition, type ReactNode } from "react";
import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ConfirmationDialogProps {
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  trigger?: ReactNode;
  showTrigger?: boolean;
  onConfirm: () => Promise<void> | void;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "destructive" | "default";
}

export function ConfirmationDialog({
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  trigger,
  showTrigger = true,
  onConfirm,
  onSuccess,
  open,
  onOpenChange,
  variant = "destructive",
}: ConfirmationDialogProps) {
  const [isPending, startTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await onConfirm();
        onOpenChange?.(false);
        onSuccess?.();
      } catch (error) {
        // El error ya debería ser manejado en onConfirm
        console.error("Error in confirmation dialog:", error);
      }
    });
  };

  const handleCancel = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const triggerElement = showTrigger && trigger ? trigger : null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {triggerElement && <DialogTrigger asChild>{triggerElement}</DialogTrigger>}
        <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription asChild>
              <div>{description}</div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            {onOpenChange ? (
              <Button variant="outline" onClick={handleCancel} disabled={isPending} type="button">
                {cancelText}
              </Button>
            ) : (
              <DialogClose asChild>
                <Button variant="outline" disabled={isPending} type="button">
                  {cancelText}
                </Button>
              </DialogClose>
            )}
            <Button
              onClick={handleConfirm}
              disabled={isPending}
              variant={variant === "destructive" ? "destructive" : "default"}
              type="button"
            >
              {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {triggerElement && <DrawerTrigger asChild>{triggerElement}</DrawerTrigger>}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription asChild>
            <div>{description}</div>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            variant={variant === "destructive" ? "destructive" : "default"}
            type="button"
          >
            {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            {confirmText}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleCancel} type="button">
              {cancelText}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
