"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  iconColor?: string;
  isBirthday?: boolean;
  withTime?: boolean; // Nuevo prop para indicar si incluye selección de hora
}

export default function DatePicker({
    value,
    onChange,
    iconColor,
    isBirthday = false,
    withTime = false,
}: DatePickerProps) {
    const [month, setMonth] = React.useState<number>(value ? value.getMonth() : new Date().getMonth());
    const [year, setYear] = React.useState<number>(value ? value.getFullYear() : new Date().getFullYear());
    const [timeValue, setTimeValue] = React.useState<string>(value
        ? `${value.getHours().toString()
            .padStart(2, "0")}:${value.getMinutes().toString()
            .padStart(2, "0")}`
        : "00:00");

    // Creamos el array de años basado en si es fecha de nacimiento o no
    const years = React.useMemo(() => {
        const currentYear = new Date().getFullYear();

        if (isBirthday) {
            // Para cumpleaños: desde 100 años atrás hasta el año actual
            return Array.from({ length: 101 }, (_, i) => currentYear - 100 + i);
        } else {
            // Comportamiento normal: 10 años antes y 10 años después del año seleccionado
            return Array.from({ length: 21 }, (_, i) => year - 10 + i);
        }
    }, [year, isBirthday]);

    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    const handleMonthChange = (value: string) => {
        setMonth(Number.parseInt(value, 10));
    };

    const handleYearChange = (value: string) => {
        setYear(Number.parseInt(value, 10));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeValue(e.target.value);
        updateDateWithTime(e.target.value);
    };

    const updateDateWithTime = (timeStr: string) => {
        if (!value) {
            return;
        }

        const [hours, minutes] = timeStr.split(":").map((num) => Number.parseInt(num, 10));

        if (isNaN(hours) || isNaN(minutes)) {
            return;
        }

        const newDate = new Date(value);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        onChange(newDate);
    };

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) {
            onChange(undefined);
            return;
        }

        if (withTime && value) {
        // Mantener la hora seleccionada al cambiar la fecha
            const [hours, minutes] = timeValue.split(":").map((num) => Number.parseInt(num, 10));
            date.setHours(hours);
            date.setMinutes(minutes);
        }

        onChange(date);
    };

    // Formatear la fecha para mostrar en el botón
    const getFormattedDate = () => {
        if (!value) {
            return "Selecciona una fecha";
        }

        if (withTime) {
            return format(value, "PPP 'a las' HH:mm", { locale: es });
        } else {
            return format(value, "PPP", { locale: es });
        }
    };

    // Actualizar el timeValue cuando cambia el valor externo
    React.useEffect(() => {
        if (value) {
            setTimeValue(`${value.getHours().toString()
                .padStart(2, "0")}:${value.getMinutes().toString()
                .padStart(2, "0")}`);
        }
    }, [value]);

    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
                    tabIndex={0}
                >
                    {withTime ? (
                        <Clock className={`mr-2 h-4 w-4 ${iconColor ? `${iconColor}` : ""}`} />
                    ) : (
                        <CalendarIcon className={`mr-2 h-4 w-4 ${iconColor ? `${iconColor}` : ""}`} />
                    )}
                    <span className="truncate text-ellipsis">
                        {getFormattedDate()}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom" onOpenAutoFocus={(e) => e.preventDefault()}>
                <div className="flex items-center justify-between p-3 gap-3">
                    <Select value={month.toString()} onValueChange={handleMonthChange}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month, index) => (
                                <SelectItem key={month} value={index.toString()}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={year.toString()} onValueChange={handleYearChange}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="p-2">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleDateSelect}
                        month={new Date(year, month)}
                        onMonthChange={(newMonth) => {
                            setMonth(newMonth.getMonth());
                            setYear(newMonth.getFullYear());
                        }}
                        initialFocus
                        locale={es}
                        className="capitalize"
                    />
                </div>

                {withTime && (
                    <>
                        <Separator />
                        <div className="p-4">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="time-input" className="text-sm font-medium">
                                        Hora
                                    </Label>
                                    <div className="flex items-center">
                                        <Input
                                            id="time-input"
                                            type="time"
                                            value={timeValue}
                                            onChange={handleTimeChange}
                                            className="w-[120px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    );
}
