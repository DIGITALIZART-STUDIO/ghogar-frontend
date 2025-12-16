import { format, parseISO } from "date-fns";
import { UseFormReturn } from "react-hook-form";

import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { CreateLeadTasksSchema } from "../../_schemas/createLeadTasksSchema";
import { TaskTypes } from "../../_types/leadTask";
import { TaskTypesConfig } from "../../_utils/tasks.utils";

interface UpdateLeadTasksFormProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateLeadTasksSchema>;
  onSubmit: (data: CreateLeadTasksSchema) => void;
}

export default function UpdateLeadTasksForm({ children, form, onSubmit }: UpdateLeadTasksFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="type">
                                Tipo de Tarea
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona un tipo de tarea" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(TaskTypes).map((taskType) => {
                                            const taskConfig = TaskTypesConfig[taskType];
                                            const Icon = taskConfig.icon;

                                            return (
                                                <SelectItem key={taskType} value={taskType} className="flex items-center gap-2">
                                                    <Icon className={`size-4 ${taskConfig.textColor}`} />
                                                    <span>
                                                        {taskConfig.label}
                                                    </span>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="scheduledDate">
                                Fecha Programada
                            </FormLabel>
                            <FormControl>
                                <DatePicker
                                    value={field.value ? parseISO(field.value) : undefined}
                                    withTime
                                    onChange={(date) => {
                                        if (date) {
                                            const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
                                            field.onChange(formattedDate);
                                        } else {
                                            field.onChange("");
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Descripción
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Descripción de la tarea"
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {form.watch("completedDate") && (
                    <FormField
                        control={form.control}
                        name="completedDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="completedDate">
                                    Fecha de Completado
                                </FormLabel>
                                <FormControl>
                                    <DatePicker
                                        value={field.value ? parseISO(field.value) : undefined}
                                        withTime
                                        onChange={(date) => {
                                            if (date) {
                                                const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
                                                field.onChange(formattedDate);
                                            } else {
                                                field.onChange("");
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {children}
            </form>
        </Form>
    );
}
