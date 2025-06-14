import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
            <div
                className={cn(
                    "animate-spin rounded-full border-b-2 border-primary",
                    sizeClasses[size],
                    className,
                )}
            />
            {text && (
                <p className="text-sm text-muted-foreground animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}

// For full-page loading
export function FullPageLoader({ text = "Cargando..." }: { text?: string }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}
