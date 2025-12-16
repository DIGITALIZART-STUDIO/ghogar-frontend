import { UseFormReturn } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { CreateBlockSchema } from "../../_schemas/createBlocksSchema";

interface UpdateBlocksFormProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateBlockSchema>;
  onSubmit: (data: CreateBlockSchema) => void;
}

export default function UpdateBlocksForm({ children, form, onSubmit }: UpdateBlocksFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Nombre de la Manzana
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="A, B, 1, 2..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Identificador único de la manzana dentro del proyecto
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {children}
            </form>
        </Form>
    );
}
