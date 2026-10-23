import { format, startOfMonth } from "date-fns";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function formatDateOnly(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseLocalDate(dateOnly: string): Date {
  return new Date(`${dateOnly}T00:00:00`);
}

export function defaultReportDateRange(): { from: string; to: string } {
  const now = new Date();
  return {
    from: formatDateOnly(startOfMonth(now)),
    to: formatDateOnly(now),
  };
}

export function formatReportDate(dateString?: string | null): string {
  if (!dateString) {
    return "—";
  }

  try {
    const date = DATE_ONLY.test(dateString) ? parseLocalDate(dateString) : new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Lima",
    }).format(date);
  } catch {
    return "—";
  }
}

export function nextReportDateRange(
  range: { from?: Date; to?: Date } | undefined,
  currentFrom: string,
  currentTo: string
): { from: string; to: string } | null {
  const next =
    range?.from && range.to
      ? { from: formatDateOnly(range.from), to: formatDateOnly(range.to) }
      : defaultReportDateRange();

  if (next.from === currentFrom && next.to === currentTo) {
    return null;
  }

  return next;
}
