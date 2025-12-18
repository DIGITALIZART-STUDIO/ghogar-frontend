import { UseFormReturn } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateBlockSchema } from "../../_schemas/createBlocksSchema";

interface CreateBlocksFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateBlockSchema>;
  onSubmit: (data: CreateBlockSchema) => void;
}

export default function CreateBlocksForm({ children, form, onSubmit }: CreateBlocksFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Nombre de la Manzana</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el nombre de la manzana" {...field} />
              </FormControl>
              <FormDescription>Identificador único de la manzana dentro del proyecto</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  );
}
