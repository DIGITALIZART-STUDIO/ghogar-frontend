"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, Upload, X, ImageIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: File | null
  onChange: (file: File | null) => void
  disabled?: boolean
  className?: string
  initialImageUrl?: string // Added support for initial image URL for edit mode
}

export function ImageUpload({ value, onChange, disabled, className, initialImageUrl }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isInitialImageRemoved, setIsInitialImageRemoved] = useState(false);

    useEffect(() => {
        if (initialImageUrl && !value && !preview && !isInitialImageRemoved) {
            setPreview(initialImageUrl);
        }
    }, [initialImageUrl, value, preview, isInitialImageRemoved]);

    // Reset preview when value changes to null (when removing image)
    useEffect(() => {
        if (!value && !initialImageUrl) {
            setPreview(null);
        }
    }, [value, initialImageUrl]);

    const handleImageChange = useCallback((file: File | null) => {
        onChange(file);
        if (file) {
            // Create preview for new file
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            // If removing image, clear preview completely
            setPreview(null);
            // Mark initial image as removed if it exists
            if (initialImageUrl) {
                setIsInitialImageRemoved(true);
            }
        }
    }, [onChange, initialImageUrl]);

    const onDrop = useCallback(
        (acceptedFiles: Array<File>) => {
            const file = acceptedFiles[0];
            if (file) {
                handleImageChange(file);
            }
        },
        [handleImageChange],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif", ".svg"],
        },
        maxFiles: 1,
        disabled,
        onDragEnter: () => setIsHovering(true),
        onDragLeave: () => setIsHovering(false),
    });

    const removeImage = () => {
        handleImageChange(null);
    };

    if (preview || value || (initialImageUrl && !isInitialImageRemoved)) {
        return (
            <div className={cn("relative group", className)}>
                <div className="relative overflow-hidden rounded-md border-2 border-dashed border-border bg-primary/5 dark:bg-primary/10">
                    <div className="aspect-video relative">
                        <img
                            src={preview ?? (value ? URL.createObjectURL(value) : (initialImageUrl && !isInitialImageRemoved ? initialImageUrl : ""))}
                            alt="Project preview"
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute top-2 right-2">
                                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            </div>
                        </div>

                        {/* Remove button */}
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                            onClick={removeImage}
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        {/* Restore initial image button - only show if initial image was removed */}
                        {isInitialImageRemoved && initialImageUrl && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 px-2 text-xs"
                                onClick={() => {
                                    setIsInitialImageRemoved(false);
                                    setPreview(initialImageUrl);
                                    onChange(null); // Clear the file value
                                }}
                            >
                                Restaurar
                            </Button>
                        )}
                    </div>

                    <div className="p-3 bg-background/80 backdrop-blur-sm border-t border-border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <ImageIcon className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-sm font-medium text-foreground">{value?.name ?? "Imagen del proyecto"}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {value ? `${(value.size / 1024 / 1024).toFixed(1)} MB` : ""}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("relative", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "relative cursor-pointer transition-all duration-300 ease-in-out",
                    "border-2 border-dashed rounded-xl p-8",
                    "bg-primary/5 dark:bg-primary/10",
                    isDragActive || isHovering
                        ? "border-primary bg-primary/10 dark:bg-primary/20 scale-[1.02] shadow-lg shadow-primary/20"
                        : "border-border hover:border-primary/50",
                    disabled && "opacity-50 cursor-not-allowed",
                )}
            >
                <input {...getInputProps()} />

                <div className="absolute inset-0 opacity-10">
                    <div
                        className={cn("absolute inset-0 bg-primary rounded-xl", "animate-pulse", isDragActive && "animate-ping")}
                    />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                    <div
                        className={cn(
                            "relative p-4 rounded-full transition-all duration-300",
                            "bg-primary/10 dark:bg-primary/20",
                            isDragActive && "scale-110 rotate-6",
                        )}
                    >
                        {isDragActive ? (
                            <Upload className="h-8 w-8 text-primary animate-bounce" />
                        ) : (
                            <Camera className="h-8 w-8 text-muted-foreground" />
                        )}

                        {isDragActive && (
                            <>
                                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-primary animate-ping" />
                                <Sparkles className="absolute -bottom-1 -left-1 h-3 w-3 text-primary/70 animate-pulse" />
                            </>
                        )}
                    </div>

                    {/* Text content */}
                    <div className="text-center space-y-2">
                        <h3
                            className={cn(
                                "font-semibold transition-colors duration-200",
                                isDragActive ? "text-primary" : "text-foreground",
                            )}
                        >
                            {isDragActive ? "¡Suelta la imagen aquí!" : "Imagen del Proyecto"}
                        </h3>

                        <p className="text-sm text-muted-foreground max-w-xs">
                            {isDragActive ? "Procesaremos tu imagen al instante" : "Arrastra una imagen o haz clic para seleccionar"}
                        </p>

                        <div className="flex flex-wrap justify-center gap-1 text-xs text-muted-foreground">
                            <span className="px-2 py-1 bg-muted rounded">JPG</span>
                            <span className="px-2 py-1 bg-muted rounded">PNG</span>
                            <span className="px-2 py-1 bg-muted rounded">WEBP</span>
                            <span className="px-2 py-1 bg-muted rounded">SVG</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={cn(
                            "transition-all duration-200 border-primary/20 hover:bg-primary hover:text-primary-foreground",
                            isDragActive && "bg-primary text-primary-foreground border-primary",
                        )}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Seleccionar Imagen
                    </Button>
                </div>
            </div>
        </div>
    );
}
