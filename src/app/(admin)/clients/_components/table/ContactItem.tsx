import { ExternalLink, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactItemProps {
    icon: LucideIcon;
    label: string;
    value: string;
    href?: string;
    variant?: "default" | "primary" | "secondary" | "danger"; // Agrega "danger"
}

const variantStyles = {
    default: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
    primary: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    secondary: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400", // Nueva variante
};

export default function ContactItem({
    icon: Icon,
    label,
    value,
    href,
    variant = "default",
}: ContactItemProps) {
    const content = (
        <div className="group flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-border hover:bg-accent/50 transition-all duration-200">
            <div
                className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    variantStyles[variant],
                )}
            >
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">{label}</div>
                <div className="text-sm font-semibold text-foreground truncate group-hover:text-foreground transition-colors">
                    {value}
                </div>
            </div>
            {href && (
                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
        </div>
    );

    if (href) {
        return (
            <a href={href} className="block" target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    }

    return content;
}
