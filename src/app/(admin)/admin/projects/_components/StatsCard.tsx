import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  total: number;
  icon: LucideIcon;
  gradient: string;
  description: string;
}

export function StatsCard({ title, value, total, icon: Icon, gradient, description }: StatsCardProps) {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

    // Mapear los nombres de gradientes a clases de Tailwind
    const gradientClasses = {
        "gradient-purple": "bg-gradient-to-r from-purple-500 to-indigo-600",
        "gradient-green": "bg-gradient-to-r from-green-500 to-emerald-600",
        "gradient-orange": "bg-gradient-to-r from-orange-500 to-red-600",
        "gradient-teal": "bg-gradient-to-r from-teal-500 to-cyan-600",
    };

    const gradientClass =
    gradientClasses[gradient as keyof typeof gradientClasses] || "bg-gradient-to-r from-gray-500 to-gray-600";

    return (
        <Card className="overflow-hidden hover-lift border-0 pt-0">
            <div className={`h-2 ${gradientClass}`} />
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">
                            {title}
                        </p>
                        <div className="flex items-baseline space-x-2">
                            <p className="text-3xl font-bold text-gray-900">
                                {value}
                            </p>
                            <p className="text-sm text-gray-500">
                                de
                                {total}
                            </p>
                        </div>
                        <p className="text-xs text-gray-500">
                            {description}
                        </p>
                    </div>
                    <div className={`p-3 rounded-full ${gradientClass}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                            Progreso
                        </span>
                        <span className="font-medium text-gray-900">
                            {percentage}
                            %
                        </span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${gradientClass} transition-all duration-500 ease-out`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
