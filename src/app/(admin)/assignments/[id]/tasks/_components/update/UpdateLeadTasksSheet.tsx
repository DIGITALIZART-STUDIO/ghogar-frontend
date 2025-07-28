"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useUpdateTask } from "../../_hooks/useLeadTasks";
import { CreateLeadTasksSchema, leadTaskSchema } from "../../_schemas/createLeadTasksSchema";
import { LeadTaskDetail, TaskTypes } from "../../_types/leadTask";
import UpdateLeadsForm from "./UpdateLeadTasksForm";

const infoSheet = {
    title: "Actualizar Tarea",
    description: "Actualiza la tarea del lead",
};

interface UpdateLeadTasksSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  task: LeadTaskDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateLeadTasksSheet({ task, open, onOpenChange }: UpdateLeadTasksSheetProps) {
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<CreateLeadTasksSchema>({
        resolver: zodResolver(leadTaskSchema),
        defaultValues: {
            type: (task?.type as TaskTypes) ?? undefined,
            description: task?.description ?? "",
            scheduledDate: task?.scheduledDate ?? "",
            completedDate: task?.completedDate ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                type: (task?.type as TaskTypes) ?? undefined,
                description: task?.description ?? "",
                scheduledDate: task?.scheduledDate ?? "",
                completedDate: task?.completedDate ?? "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, task]);

    // Hook para actualizar tarea
    const updateTask = useUpdateTask();

    const onSubmit = async (input: CreateLeadTasksSchema) => {
        if (!task?.id) {
            toast.error("ID de tarea no encontrado");
            return;
        }

        const payload = {
            type: input.type,
            description: input.description,
            scheduledDate: input.scheduledDate,
            ...(input.completedDate ? { completedDate: input.completedDate } : {}),
        };

        const promise = updateTask.mutateAsync({ id: task.id, task: payload });

        toast.promise(promise, {
            loading: "Actualizando tarea...",
            success: "Tarea actualizada exitosamente",
            error: (e) => `Error al actualizar tarea: ${e.message ?? e}`,
        });

        promise.then(() => {
            setIsSuccess(true);
        });
    };

    useEffect(() => {
        if (isSuccess) {
            form.reset();
            onOpenChange(false);
            setIsSuccess(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
                <SheetHeader className="text-left pb-0">
                    <SheetTitle className="flex flex-col items-start">
                        {infoSheet.title}
                        <Badge className="bg-emerald-100 capitalize text-emerald-700" variant="secondary">
                            {task?.lead?.client?.dni ?? task?.lead?.client?.ruc}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>
                        {infoSheet.description}
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
                    <UpdateLeadsForm form={form} onSubmit={onSubmit}>
                        <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                            <div className="flex flex-row-reverse gap-2">
                                <Button type="submit" disabled={updateTask.isPending}>
                                    {updateTask.isPending && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                                    Actualizar
                                </Button>
                                <SheetClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </SheetClose>
                            </div>
                        </SheetFooter>
                    </UpdateLeadsForm>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
