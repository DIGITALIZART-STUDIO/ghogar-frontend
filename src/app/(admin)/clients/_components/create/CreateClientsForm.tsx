"use client";

import { useState } from "react";
import { Building2, Heart, Home, IdCard, Mail, Plus, Trash2, User, Users } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { getCountries, type Country } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import es from "react-phone-number-input/locale/es.json";

import { InputWithIcon } from "@/components/input-with-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CountryAutocomplete, CountryOption } from "@/components/ui/country-autocomplete";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { CreateClientsSchema } from "../../_schemas/createClientsSchema";
import { ClientTypes } from "../../_types/client";
import { ClientTypesLabels } from "../../_utils/clients.utils";
import DocumentNumberLookup from "../search-document-number/LookupDocumentNumber";

interface CreateClientFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateClientsSchema>;
  onSubmit: (data: CreateClientsSchema) => void;
}

export default function CreateClientForm({ children, form, onSubmit }: CreateClientFormProps) {
    const clientType = form.watch("type");
    const copropietarios = form.watch("coOwners") ?? [];
    const separacionBienes = form.watch("separateProperty");

    const addCopropietario = () => {
        if (copropietarios.length < 6) {
            const currentCopropietarios = form.getValues("coOwners") ?? [];
            form.setValue("coOwners", [...currentCopropietarios, { name: "", dni: "", phone: "", address: "", email: "" }]);
        }
    };

    const removeCopropietario = (index: number) => {
        const currentCopropietarios = form.getValues("coOwners") ?? [];
        const newCopropietarios = currentCopropietarios.filter((_, i) => i !== index);
        form.setValue("coOwners", newCopropietarios);
    };

    const handleSeparacionBienesChange = (checked: boolean) => {
        form.setValue("separateProperty", checked);
        if (!checked) {
            form.setValue("separatePropertyData", undefined);
        } else {
            form.setValue("separatePropertyData", {
                spouseName: "",
                spouseDni: "",
                phone: "",
                maritalStatus: "Casado",
                address: "",
                email: "",
            });
        }
    };

    const [selectedCountryCode, setSelectedCountryCode] = useState<Country>("PE");

    const countryOptions: Array<CountryOption> = getCountries().map((country) => ({
        value: es[country],
        label: es[country] ?? country,
        original: country,
    }));

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Información Básica */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Client Type Selection */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel htmlFor="documentType">Tipo de Cliente</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona un tipo de cliente" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.values(ClientTypes).map((clientTypes) => {
                                                    const clientTypesConfig = ClientTypesLabels[clientTypes];
                                                    const Icon = clientTypesConfig.icon;

                                                    return (
                                                        <SelectItem key={clientTypes} value={clientTypes} className="flex items-center gap-2">
                                                            <Icon className={`size-4 ${clientTypesConfig.className}`} />
                                                            <span>{clientTypesConfig.label}</span>
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

                        {/* Conditional fields based on client type */}
                        {clientType === ClientTypes.Natural ? (
                            <div className="md:col-span-2">
                                <DocumentNumberLookup form={form} type="dni" isUpdate={false} />
                            </div>
                        ) : clientType === ClientTypes.Juridico ? (
                            <>
                                <div className="md:col-span-2">
                                    <DocumentNumberLookup form={form} type="ruc" isUpdate={false} />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem className="transition-all duration-300 ease-in-out">
                                            <FormLabel>Nombre de la Empresa</FormLabel>
                                            <FormControl>
                                                <InputWithIcon Icon={Building2} placeholder="Ejm: Empresa S.A.C." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        ) : null}

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {clientType === ClientTypes.Juridico ? "Representante Legal" : "Nombre Completo"}
                                    </FormLabel>
                                    <FormControl>
                                        <InputWithIcon Icon={User} placeholder="Ejm: Juan Perez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>País</FormLabel>
                                    <FormControl>
                                        <CountryAutocomplete
                                            options={countryOptions}
                                            flags={flags}
                                            emptyMessage="No se encontró el país."
                                            placeholder="Seleccione un país"
                                            onValueChange={(selectedOption) => {
                                                field.onChange(selectedOption?.value ?? "");
                                                // Actualizar el código de país para el PhoneInput
                                                if (selectedOption) {
                                                    setSelectedCountryCode(selectedOption.original as Country);
                                                }
                                            }}
                                            value={countryOptions.find((option) => option.value === field.value) ?? undefined}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone Number */}
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teléfono</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            defaultCountry={selectedCountryCode}
                                            placeholder="999 888 777"
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <InputWithIcon Icon={Mail} placeholder="usuario@ejemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <InputWithIcon Icon={Home} placeholder="Ejm: Jr. Los Pinos 123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator />

                {/* Sección de Copropietarios */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="size-5" />
                            Copropietarios
                            <span className="text-sm font-normal text-muted-foreground">({copropietarios.length}/6)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {copropietarios.map((_, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-4 space-y-4 transition-all duration-300 ease-in-out animate-in slide-in-from-top-2"
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">Copropietario {index + 1}</h4>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeCopropietario(index)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`coOwners.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre Completo</FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={User} placeholder="Nombre completo" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`coOwners.${index}.dni`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>DNI</FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={IdCard} placeholder="12345678" maxLength={8} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`coOwners.${index}.phone`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teléfono (Opcional)</FormLabel>
                                                <FormControl>
                                                    <PhoneInput
                                                        defaultCountry={"PE"}
                                                        placeholder="999 888 777"
                                                        value={field.value ?? ""}
                                                        onChange={(value) => field.onChange(value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`coOwners.${index}.address`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dirección</FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={Home} placeholder="Ejm: Jr. Los Pinos 123" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`coOwners.${index}.email`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Correo Electrónico</FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={Mail} placeholder="usuario@ejemplo.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        ))}

                        {copropietarios.length < 6 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addCopropietario}
                                className="w-full transition-all duration-200 hover:scale-[1.02]"
                            >
                                <Plus className="size-4 mr-2" />
                                Agregar Copropietario
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <Separator />

                {/* Sección de Separación de Bienes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="size-5" />
                            Separación de Bienes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="separateProperty"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={handleSeparacionBienesChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>¿El cliente tiene separación de bienes?</FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Marque esta opción si el cliente está casado con separación de bienes
                                        </p>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {separacionBienes && (
                            <div className="border rounded-lg p-4 space-y-4 transition-all duration-300 ease-in-out animate-in slide-in-from-top-2">
                                <h4 className="font-medium">Datos del Cónyuge</h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="separatePropertyData.spouseName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre del Cónyuge</FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={User} placeholder="Nombre completo del cónyuge" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="separatePropertyData.spouseDni"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>DNI del Cónyuge</FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={IdCard} placeholder="12345678" maxLength={8} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="separatePropertyData.phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teléfono (Opcional)</FormLabel>
                                                <FormControl>
                                                    <PhoneInput
                                                        defaultCountry={"PE"}
                                                        placeholder="999 888 777"
                                                        value={field.value ?? ""}
                                                        onChange={(value) => field.onChange(value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="separatePropertyData.maritalStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estado Civil</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccionar estado civil" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Casado">Casado</SelectItem>
                                                        <SelectItem value="Separado">Separado</SelectItem>
                                                        <SelectItem value="Unión de hecho">Unión de hecho</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="separatePropertyData.address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dirección</FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={Home} placeholder="Ejm: Jr. Los Pinos 123" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="separatePropertyData.email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Correo Electrónico</FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={Mail} placeholder="usuario@ejemplo.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {children}
            </form>
        </Form>
    );
}
