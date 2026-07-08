import { UseFormReturn } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { CreateLeadFromPhoneSchema } from "../../_schemas/createLeadFromPhoneSchema";
import { CreateLeadAssignmentFields, CreateLeadCaptureSourceField } from "./CreateLeadCommonFields";

interface CreateLeadFromPhoneFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateLeadFromPhoneSchema>;
  onSubmit: (data: CreateLeadFromPhoneSchema) => void;
  isSalesAdvisor: boolean;
  currentUserId: string;
}

export default function CreateLeadFromPhoneForm({
  children,
  form,
  onSubmit,
  isSalesAdvisor,
  currentUserId,
}: CreateLeadFromPhoneFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 gap-4">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Celular</FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry="PE"
                  placeholder="Ingrese el número de celular"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <CreateLeadCaptureSourceField form={form} />

        <CreateLeadAssignmentFields form={form} isSalesAdvisor={isSalesAdvisor} currentUserId={currentUserId} />

        {children}
      </form>
    </Form>
  );
}
