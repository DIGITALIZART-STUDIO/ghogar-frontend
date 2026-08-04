"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Landmark, Users } from "lucide-react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportCardDefinition {
  title: string;
  description: string;
  href?: string;
  icon: React.ElementType;
  status: "available" | "coming-soon";
}

const commercialReports: Array<ReportCardDefinition> = [
  {
    title: "Actividad de Asesores",
    description:
      "Leads ingresados, estado, medio de captación y tareas realizadas por cada asesor en el periodo seleccionado.",
    href: "/reports/commercial/advisor-activity",
    icon: Users,
    status: "available",
  },
];

const administrativeReports: Array<ReportCardDefinition> = [
  {
    title: "Reportes administrativos",
    description: "Próximamente: reportes financieros y operativos para administración.",
    icon: Landmark,
    status: "coming-soon",
  },
];

function ReportCard({ report }: { report: ReportCardDefinition }) {
  const Icon = report.icon;

  const content = (
    <Card className={report.status === "available" ? "transition-colors hover:bg-accent/50" : "opacity-70"}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="h-5 w-5 text-muted-foreground" />
            {report.title}
          </CardTitle>
          {report.status === "coming-soon" ? (
            <Badge variant="secondary">Próximamente</Badge>
          ) : (
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <CardDescription>{report.description}</CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  );

  if (report.href) {
    return <Link href={report.href}>{content}</Link>;
  }

  return content;
}

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <HeaderPage title="Reportes" description="Consulta y descarga reportes operativos y comerciales del sistema." />

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Reportes Comerciales</h2>
        </div>
        <p className="text-sm text-muted-foreground -mt-2">
          Para supervisores, gerentes y administradores: seguimiento de la actividad de los asesores.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {commercialReports.map((report) => (
            <ReportCard key={report.title} report={report} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Reportes Administrativos</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {administrativeReports.map((report) => (
            <ReportCard key={report.title} report={report} />
          ))}
        </div>
      </section>
    </div>
  );
}
