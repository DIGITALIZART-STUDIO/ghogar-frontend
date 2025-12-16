"use client";

import type { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ResponsiveDialogProps {
  // Control de estado
  open: boolean
  onOpenChange: (open: boolean) => void

  // Media query personalizable
  isDesktop: boolean

  // Contenido
  trigger?: ReactNode
  title: string
  description?: string
  children: ReactNode

  // Configuración de Dialog
  dialogContentClassName?: string
  dialogScrollAreaClassName?: string
  dialogContentProps?: React.ComponentProps<typeof DialogContent>

  // Configuración de Drawer
  drawerScrollAreaClassName?: string
  drawerContentProps?: React.ComponentProps<typeof DrawerContent>
  drawerProps?: React.ComponentProps<typeof Drawer>

  // Configuración de ScrollArea
  dialogScrollAreaHeight?: string
  drawerScrollAreaHeight?: string

  // Props adicionales
  showTrigger?: boolean
  disableOverflow?: boolean
}

export function ResponsiveDialog({
    open,
    onOpenChange,
    isDesktop,
    trigger,
    title,
    description,
    children,
    dialogContentClassName = "px-0",
    dialogScrollAreaClassName = "h-full max-h-[80vh] px-0",
    dialogContentProps,
    drawerScrollAreaClassName = "h-[40vh] px-0",
    drawerContentProps,
    drawerProps,
    dialogScrollAreaHeight,
    drawerScrollAreaHeight,
    showTrigger = true,
    disableOverflow = false,
}: ResponsiveDialogProps) {
    // Configurar altura del ScrollArea si se proporciona
    const finalDialogScrollClassName = cn(
        dialogScrollAreaClassName,
        dialogScrollAreaHeight && `h-[${dialogScrollAreaHeight}]`,
    );

    const finalDrawerScrollClassName = cn(
        drawerScrollAreaClassName,
        drawerScrollAreaHeight && `h-[${drawerScrollAreaHeight}]`,
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                {showTrigger && trigger &&
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>}
                <DialogContent tabIndex={undefined} className={dialogContentClassName} onClick={(ev) => ev.stopPropagation()} {...dialogContentProps}>
                    <DialogHeader className="px-4">
                        <DialogTitle>
                            {title}
                        </DialogTitle>
                        {description &&
                        <DialogDescription>
                            {description}
                        </DialogDescription>}
                    </DialogHeader>

                    <ScrollArea className={finalDialogScrollClassName} disableOverflow={disableOverflow}>
                        <div className="px-6">
                            {children}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...drawerProps}>
            {showTrigger && trigger &&
            <DrawerTrigger asChild>
                {trigger}
            </DrawerTrigger>}
            <DrawerContent onClick={(ev) => ev.stopPropagation()} {...drawerContentProps}>
                <DrawerHeader className="pb-2">
                    <DrawerTitle>
                        {title}
                    </DrawerTitle>
                    {description &&
                    <DrawerDescription>
                        {description}
                    </DrawerDescription>}
                </DrawerHeader>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className={finalDrawerScrollClassName}>
                        <div className="px-4">
                            {children}
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
