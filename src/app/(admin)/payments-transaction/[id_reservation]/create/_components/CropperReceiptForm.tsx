import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ModernImageCropper from "@/components/ui/modern-image-cropper";
import { CheckCircle, FileText } from "lucide-react";
import { useState } from "react";

interface CropperReceiptFormProps {
  onImageCropped: (blob: Blob) => void;
  initialImageUrl?: string; // URL de imagen existente para edición
}

export default function CropperReceiptForm({ onImageCropped, initialImageUrl }: CropperReceiptFormProps) {
    const [hasComprobante, setHasComprobante] = useState(!!initialImageUrl);

    const handleCropped = (blob: Blob) => {
        onImageCropped(blob);
        setHasComprobante(true);
    };

    return (
        <Card className="border overflow-hidden pt-0">
            <CardHeader className="pb-4 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-gray-100 pt-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-200 dark:bg-zinc-900 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Comprobante de Pago</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Sube y recorta el comprobante</p>
                        </div>
                    </div>
                    {hasComprobante && (
                        <div className="flex items-center text-primary">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span className="text-sm font-medium">Comprobante listo</span>
                        </div>
                    )}

                </div>
            </CardHeader>
            <CardContent className="px-1">
                <div className="flex items-center justify-center px-6">
                    <ModernImageCropper
                        onImageCropped={handleCropped}
                        initialImageUrl={initialImageUrl}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
