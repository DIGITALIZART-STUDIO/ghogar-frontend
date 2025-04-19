import React from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SmallErrorMessage({
    error,
    reset,
    errorMessage,
}: {
  error: Error;
  errorMessage?: string;
  reset: () => void;
}) {
    const DEFAULT_ERROR = "Algo salió mal";
    return (
        <div className="flex h-fit shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <h3 className="mt-4 text-lg font-semibold">
                    Algo salió mal
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    {error.message ?? errorMessage ?? DEFAULT_ERROR}
                </p>
                <Button size="sm" onClick={reset}>
                    Intentar de nuevo
                </Button>
            </div>
        </div>
    );
}
