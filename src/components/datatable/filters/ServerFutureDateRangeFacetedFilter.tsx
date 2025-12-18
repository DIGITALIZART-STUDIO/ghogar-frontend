"use client";

import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { endOfDay, endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { es } from "date-fns/locale/es";
import { Calendar1, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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

const multiSelectVariants = cva(
  "flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground text-background",
        link: "text-primary underline-offset-4 hover:underline text-background",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "sm",
    },
  }
);

interface ServerFutureDateRangeFacetedFilterProps extends VariantProps<typeof multiSelectVariants> {
  title?: string;
  from?: Date;
  to?: Date;
  onChange: (range: { from?: Date; to?: Date }) => void;
  closeOnSelect?: boolean;
  numberOfMonths?: 1 | 2;
  yearsRange?: number;
  disabled?: boolean;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function ServerFutureDateRangeFacetedFilter({
  title = "Fecha futura",
  from,
  to,
  onChange,
  closeOnSelect = false,
  numberOfMonths = 2,
  yearsRange = 10,
  variant,
  size,
  disabled,
  className,
  icon: Icon,
  ...props
}: ServerFutureDateRangeFacetedFilterProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState<string | null>(
    numberOfMonths === 2 ? "Next Month" : "Today"
  );
  const [monthFrom, setMonthFrom] = React.useState<Date | undefined>(from);
  const [yearFrom, setYearFrom] = React.useState<number | undefined>(from?.getFullYear());
  const [monthTo, setMonthTo] = React.useState<Date | undefined>(numberOfMonths === 2 ? to : from);
  const [yearTo, setYearTo] = React.useState<number | undefined>(
    numberOfMonths === 2 ? to?.getFullYear() : from?.getFullYear()
  );

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date: DateRange = { from, to };
  const today = new Date();

  const hasAny = Boolean(from ?? to);
  const formatWithTz = (date: Date, fmt: string) => formatInTimeZone(date, timeZone, fmt, { locale: es });

  const handleClose = () => setIsPopoverOpen(false);
  const handleTogglePopover = () => setIsPopoverOpen((prev) => !prev);

  // Rangos de fechas futuras
  const futureDateRanges = [
    { label: "Hoy", start: startOfDay(today), end: endOfDay(today) },
    {
      label: "Esta semana",
      start: startOfDay(today),
      end: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
    },
    {
      label: "Próximo mes",
      start: startOfMonth(new Date(today.getFullYear(), today.getMonth() + 1, 1)),
      end: endOfMonth(new Date(today.getFullYear(), today.getMonth() + 1, 1)),
    },
    {
      label: "Próximo año",
      start: startOfYear(new Date(today.getFullYear() + 1, 0, 1)),
      end: endOfYear(new Date(today.getFullYear() + 1, 11, 31)),
    },
  ];

  const selectDateRange = (from: Date, to: Date, range: string) => {
    // Asegurar que las fechas no sean pasadas
    const startDate = from < today ? today : startOfDay(toDate(from, { timeZone }));
    const endDate = numberOfMonths === 2 ? endOfDay(toDate(to, { timeZone })) : startDate;

    onChange({ from: startDate, to: endDate });
    setSelectedRange(range);
    setMonthFrom(startDate);
    setYearFrom(startDate.getFullYear());
    setMonthTo(endDate);
    setYearTo(endDate.getFullYear());
    if (closeOnSelect) {
      setIsPopoverOpen(false);
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      let from = range.from ? startOfDay(toDate(range.from as Date, { timeZone })) : today;
      let to = range.to ? endOfDay(toDate(range.to as Date, { timeZone })) : from;

      // Asegurar que las fechas no sean pasadas
      if (from < today) {
        from = today;
      }
      if (to < from) {
        to = from;
      }

      if (numberOfMonths === 1) {
        if (range.from !== date.from) {
          to = from;
        } else {
          from = startOfDay(toDate(range.to as Date, { timeZone }));
          if (from < today) {
            from = today;
          }
        }
      }

      onChange({ from, to });
      setMonthFrom(from);
      setYearFrom(from.getFullYear());
      setMonthTo(to);
      setYearTo(to.getFullYear());
      if (closeOnSelect) {
        setIsPopoverOpen(false);
      }
    }
    setSelectedRange(null);
  };

  const years = Array.from({ length: yearsRange + 1 }, (_, i) => today.getFullYear() + i);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          {...props}
          disabled={disabled}
          className={cn(
            "h-8 border-secondary",
            multiSelectVariants({ variant, className, size }),
            hasAny && "border-emerald-500"
          )}
          variant="secondary"
          onClick={handleTogglePopover}
          suppressHydrationWarning
        >
          {Icon ? <Icon className="mr-2 h-4 w-4" /> : <Calendar1 className="mr-2 h-4 w-4" />}
          {title}
          {hasAny && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                1
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {date?.from ? (
                    date.to ? (
                      <>
                        {formatWithTz(date.from, "dd MMM y")} - {formatWithTz(date.to, "dd MMM y")}
                      </>
                    ) : (
                      formatWithTz(date.from, "dd MMM y")
                    )
                  ) : (
                    "Seleccione fecha"
                  )}
                </Badge>
              </div>
            </>
          )}
          {hasAny && (
            <span
              role="button"
              aria-label="Limpiar selección"
              className="ml-2 p-1 rounded-full inline-flex items-center justify-center hover:bg-accent cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onChange({ from: undefined, to: undefined });
                setSelectedRange(null);
                handleClose();
              }}
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      {isPopoverOpen && (
        <PopoverContent
          className="w-auto"
          align="start"
          side="bottom"
          avoidCollisions
          onInteractOutside={handleClose}
          onEscapeKeyDown={handleClose}
        >
          <div className="flex">
            {numberOfMonths === 2 && (
              <div className="hidden md:flex flex-col gap-1 pr-4 text-left border-r border-foreground/10">
                {futureDateRanges.map(({ label, start, end }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "justify-start hover:bg-primary hover:text-background",
                      selectedRange === label && "bg-primary text-background hover:bg-primary/90 hover:text-background"
                    )}
                    onClick={() => {
                      selectDateRange(start, end, label);
                      setMonthFrom(start);
                      setYearFrom(start.getFullYear());
                      setMonthTo(end);
                      setYearTo(end.getFullYear());
                    }}
                  >
                    {label}
                  </Button>
                ))}

                <Separator className="my-2" />

                <div className="text-xs font-medium text-muted-foreground mb-2">Seleccionar mes</div>
                <Select
                  onValueChange={(value) => {
                    const [monthIndex, year] = value.split("-").map(Number);
                    const start = startOfMonth(new Date(year, monthIndex, 1));
                    const end = endOfMonth(new Date(year, monthIndex, 1));
                    selectDateRange(start, end, `${months[monthIndex]} ${year}`);
                    setMonthFrom(start);
                    setYearFrom(year);
                    setMonthTo(end);
                    setYearTo(year);
                  }}
                >
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Elegir mes..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const currentDate = new Date();
                      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
                      const monthIndex = targetDate.getMonth();
                      const year = targetDate.getFullYear();
                      const value = `${monthIndex}-${year}`;
                      const label = `${months[monthIndex]} ${year}`;
                      return (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <div className="flex gap-2 ml-3">
                  <Select
                    onValueChange={(value) => {
                      const monthIndex = months.indexOf(value);
                      const newMonth = new Date(yearFrom ?? today.getFullYear(), monthIndex, 1);
                      const adjustedMonth = newMonth < today ? today : newMonth;
                      setMonthFrom(adjustedMonth);
                      setSelectedRange(null);
                    }}
                    value={monthFrom ? months[monthFrom.getMonth()] : undefined}
                  >
                    <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, idx) => (
                        <SelectItem key={idx} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) => {
                      const newYear = Number(value);
                      const newMonth = monthFrom ? new Date(newYear, monthFrom.getMonth(), 1) : new Date(newYear, 0, 1);
                      const adjustedMonth = newMonth < today ? today : newMonth;
                      setYearFrom(newYear);
                      setMonthFrom(adjustedMonth);
                      setSelectedRange(null);
                    }}
                    value={yearFrom ? yearFrom.toString() : undefined}
                  >
                    <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year, idx) => (
                        <SelectItem key={idx} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {numberOfMonths === 2 && (
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(value) => {
                        const monthIndex = months.indexOf(value);
                        const newMonth = new Date(yearTo ?? today.getFullYear(), monthIndex, 1);
                        setMonthTo(newMonth);
                        setSelectedRange(null);
                      }}
                      value={monthTo ? months[monthTo.getMonth()] : undefined}
                    >
                      <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                        <SelectValue placeholder="Mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, idx) => (
                          <SelectItem key={idx} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) => {
                        const newYear = Number(value);
                        const newMonth = monthTo ? new Date(newYear, monthTo.getMonth(), 1) : new Date(newYear, 0, 1);
                        setYearTo(newYear);
                        setMonthTo(newMonth);
                        setSelectedRange(null);
                      }}
                      value={yearTo ? yearTo.toString() : undefined}
                    >
                      <SelectTrigger className="hidden sm:flex w-[122px] focus:ring-0 focus:ring-offset-0 font-medium hover:bg-accent hover:text-accent-foreground">
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year, idx) => (
                          <SelectItem key={idx} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex">
                <Calendar
                  mode="range"
                  defaultMonth={monthFrom}
                  month={monthFrom}
                  onMonthChange={setMonthFrom}
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={numberOfMonths}
                  showOutsideDays
                  className={className}
                  locale={es}
                  disabled={(date) => date < today}
                />
              </div>
              <div className="flex justify-end mt-2">
                <span
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })
                  )}
                  onClick={() => {
                    onChange({
                      from: undefined,
                      to: undefined,
                    });
                    setSelectedRange(null);
                    handleClose();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onChange({
                        from: undefined,
                        to: undefined,
                      });
                      setSelectedRange(null);
                      handleClose();
                    }
                  }}
                >
                  Limpiar
                </span>
              </div>
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}

export default ServerFutureDateRangeFacetedFilter;
