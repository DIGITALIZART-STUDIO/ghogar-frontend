import { LucideIcon } from "lucide-react";

// Componente para estado sin datos
export const EmptyState = ({ icon: Icon, title, description }: {
  icon: LucideIcon,
  title: string,
  description: string
}) => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-500/10 to-stone-500/10 rounded-full blur-xl" />
            <Icon className="relative w-12 h-12 text-muted-foreground/60 shrink-0" />
        </div>
        <h4 className="text-lg font-medium mt-4 mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground text-center max-w-sm">{description}</p>
    </div>
);
