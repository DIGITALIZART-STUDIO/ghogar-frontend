"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Download, RotateCcw, Settings, Smartphone, Upload, Scissors, Clock, CheckCircle, Target, Eye, Maximize2 } from "lucide-react";
import imageCompression from "browser-image-compression";

import { Alert, AlertDescription } from "./alert";
import { Button } from "./button";
import { Card } from "./card";

/**
 * Modern Image Cropper compatible with React 19
 * Uses canvas-based approach instead of react-document-crop
 */

interface Point {
  x: number;
  y: number;
}

interface ModernImageCropperProps {
  onImageCropped?: (croppedImageBlob: Blob) => void;
  initialImageUrl?: string; // URL de imagen existente para edición
}

export default function ModernImageCropper({
    onImageCropped,
    initialImageUrl,
}: ModernImageCropperProps) {
    const [img, setImg] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl ?? null);
    const [inputKey, setInputKey] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [croppedResult, setCroppedResult] = useState<string | null>(null);
    const [openCvLoaded, setOpenCvLoaded] = useState(false);
    const [openCvError, setOpenCvError] = useState<string | null>(null);

    // Cropping state
    const [corners, setCorners] = useState<Array<Point>>([]);
    const [draggedCorner, setDraggedCorner] = useState<number | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isReset, setIsReset] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Helper function to order corners correctly (top-left, top-right, bottom-right, bottom-left)
    const orderCorners = useCallback((corners: Array<Point>) => {
        if (corners.length !== 4) {
            return corners;
        }

        // Make a copy to avoid mutating the original
        const cornersCopy = [...corners];

        // Sort by y coordinate to get top and bottom pairs
        const sortedByY = cornersCopy.sort((a, b) => a.y - b.y);
        const topPair = sortedByY.slice(0, 2);
        const bottomPair = sortedByY.slice(2, 4);

        // Sort each pair by x coordinate
        const topSorted = topPair.sort((a, b) => a.x - b.x);
        const bottomSorted = bottomPair.sort((a, b) => a.x - b.x);

        const topLeft = topSorted[0];
        const topRight = topSorted[1];
        const bottomLeft = bottomSorted[0];
        const bottomRight = bottomSorted[1];

        return [topLeft, topRight, bottomRight, bottomLeft];
    }, []);

    // Helper function to calculate if corners form a reasonable rectangle
    const isValidRectangle = useCallback(
        (corners: Array<Point>) => {
            if (corners.length !== 4) {
                return false;
            }

            // Check if corners form a convex quadrilateral
            // and have reasonable aspect ratio
            const ordered = orderCorners([...corners]);

            // Calculate distances
            const width1 = Math.sqrt(Math.pow(ordered[1].x - ordered[0].x, 2) + Math.pow(ordered[1].y - ordered[0].y, 2));
            const width2 = Math.sqrt(Math.pow(ordered[2].x - ordered[3].x, 2) + Math.pow(ordered[2].y - ordered[3].y, 2));
            const height1 = Math.sqrt(Math.pow(ordered[3].x - ordered[0].x, 2) + Math.pow(ordered[3].y - ordered[0].y, 2));
            const height2 = Math.sqrt(Math.pow(ordered[2].x - ordered[1].x, 2) + Math.pow(ordered[2].y - ordered[1].y, 2));

            // Check if it's roughly rectangular (opposite sides should be similar)
            const widthRatio = Math.min(width1, width2) / Math.max(width1, width2);
            const heightRatio = Math.min(height1, height2) / Math.max(height1, height2);

            return widthRatio > 0.8 && heightRatio > 0.8;
        },
        [orderCorners]
    );

    // Check OpenCV availability
    useEffect(() => {
        const checkOpenCV = () => {
            if (typeof window !== "undefined") {
                // @ts-expect-error OpenCV is not defined in the global scope
                if (window.cv && window.cv.Mat) {
                    setOpenCvLoaded(true);
                    setOpenCvError(null);
                } else {
                    setOpenCvError("OpenCV no está disponible. Cargando...");
                }
            }
        };

        const handleOpenCVReady = () => {
            setTimeout(checkOpenCV, 100);
        };

        checkOpenCV();

        if (typeof window !== "undefined") {
            window.addEventListener("opencv-ready", handleOpenCVReady);
        }

        const timeout1 = setTimeout(checkOpenCV, 2000);
        const timeout2 = setTimeout(checkOpenCV, 5000);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            if (typeof window !== "undefined") {
                window.removeEventListener("opencv-ready", handleOpenCVReady);
            }
        };
    }, []);

    // Load image and detect corners
    useEffect(() => {
        if (img) {
            const url = URL.createObjectURL(img);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [img]);

    // Auto-detect corners when image loads
    const detectCorners = useCallback(
        (image: HTMLImageElement) => {
            if (!canvasRef.current) {
                return;
            }

            const canvas = canvasRef.current;
            const containerRect = containerRef.current?.getBoundingClientRect();
            if (!containerRect) {
                return;
            }

            // Set canvas size to container size
            canvas.width = containerRect.width;
            canvas.height = containerRect.height;

            // Calculate image scaling to fit in canvas
            const imageAspect = image.naturalWidth / image.naturalHeight;
            const containerAspect = canvas.width / canvas.height;

            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let offsetX = 0;
            let offsetY = 0;

            if (imageAspect > containerAspect) {
                drawHeight = canvas.width / imageAspect;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawWidth = canvas.height * imageAspect;
                offsetX = (canvas.width - drawWidth) / 2;
            }

            // Set default corners with margin
            const margin = 20;
            setCorners([
                { x: offsetX + margin, y: offsetY + margin },
                { x: offsetX + drawWidth - margin, y: offsetY + margin },
                { x: offsetX + drawWidth - margin, y: offsetY + drawHeight - margin },
                { x: offsetX + margin, y: offsetY + drawHeight - margin },
            ]);

            // Try OpenCV intelligent detection if available
            if (openCvLoaded) {
                try {
                    // Create temporary canvas for OpenCV processing
                    const tempCanvas = document.createElement("canvas");
                    const tempCtx = tempCanvas.getContext("2d");
                    if (!tempCtx) {
                        return;
                    }

                    tempCanvas.width = image.naturalWidth;
                    tempCanvas.height = image.naturalHeight;
                    tempCtx.drawImage(image, 0, 0);

                    // @ts-expect-error OpenCV is not defined in the global scope
                    const cv = window.cv;
                    const src = cv.imread(tempCanvas);
                    const gray = new cv.Mat();
                    const blurred = new cv.Mat();
                    const edges = new cv.Mat();
                    const contours = new cv.MatVector();
                    const hierarchy = new cv.Mat();

                    // Advanced preprocessing for better edge detection
                    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

                    // Apply bilateral filter to reduce noise while keeping edges sharp
                    cv.bilateralFilter(gray, blurred, 11, 17, 17);

                    // Adaptive edge detection with multiple thresholds
                    const lowThreshold = 50;
                    const highThreshold = 150;
                    cv.Canny(blurred, edges, lowThreshold, highThreshold);

                    // Morphological operations to close gaps
                    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
                    cv.morphologyEx(edges, edges, cv.MORPH_CLOSE, kernel);

                    // Find contours
                    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

                    let bestContour = null;
                    let maxArea = 0;
                    const imageArea = image.naturalWidth * image.naturalHeight;
                    const minArea = imageArea * 0.1; // At least 10% of image area

                    // Find the best rectangular contour
                    for (let i = 0; i < contours.size(); i += 1) {
                        const contour = contours.get(i);
                        const area = cv.contourArea(contour);

                        if (area > minArea && area > maxArea) {
                            // Approximate to polygon
                            const epsilon = 0.02 * cv.arcLength(contour, true);
                            const approx = new cv.Mat();
                            cv.approxPolyDP(contour, approx, epsilon, true);

                            // Check if it's a good quadrilateral
                            if (approx.rows === 4) {
                                // Extract points for validation
                                const tempCorners: Array<Point> = [];
                                for (let j = 0; j < 4; j += 1) {
                                    const point = approx.data32S;
                                    tempCorners.push({
                                        x: point[j * 2],
                                        y: point[j * 2 + 1],
                                    });
                                }

                                // Validate if it's a reasonable rectangle
                                if (isValidRectangle(tempCorners)) {
                                    maxArea = area;
                                    if (bestContour) {
                                        bestContour.delete();
                                    }
                                    bestContour = approx.clone();
                                }
                            }
                            approx.delete();
                        }
                    }

                    if (bestContour && bestContour.rows === 4) {
                        // Extract and order corners properly
                        const rawCorners: Array<Point> = [];
                        for (let i = 0; i < 4; i += 1) {
                            const point = bestContour.data32S;
                            rawCorners.push({
                                x: point[i * 2],
                                y: point[i * 2 + 1],
                            });
                        }

                        // Order corners: top-left, top-right, bottom-right, bottom-left
                        const orderedCorners = orderCorners(rawCorners);

                        // Convert to display coordinates
                        const displayCorners = orderedCorners.map((corner) => ({
                            x: (corner.x * drawWidth) / image.naturalWidth + offsetX,
                            y: (corner.y * drawHeight) / image.naturalHeight + offsetY,
                        }));

                        setCorners(displayCorners);

                        bestContour.delete();
                    }

                    // Cleanup
                    src.delete();
                    gray.delete();
                    blurred.delete();
                    edges.delete();
                    contours.delete();
                    hierarchy.delete();
                    kernel.delete();
                    if (bestContour) {
                        bestContour.delete();
                    }
                } catch {
                }
            }
        },
        [openCvLoaded, orderCorners, isValidRectangle]
    );

    // Handle initial image URL for editing
    useEffect(() => {
        if (initialImageUrl && !img) {
            // Try to load external image as blob to avoid CORS issues
            const loadExternalImage = async () => {
                try {

                    // Fetch the image as blob
                    const response = await fetch(initialImageUrl);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image: ${response.status}`);
                    }

                    const blob = await response.blob();
                    const localUrl = URL.createObjectURL(blob);

                    setImageUrl(localUrl);
                    setImageLoaded(true);

                    // Create image element and trigger corner detection
                    const tempImg = new Image();
                    tempImg.onload = () => {
                        detectCorners(tempImg);
                    };
                    tempImg.src = localUrl;

                } catch {

                    // Fallback: try direct loading (will have CORS limitations)
                    setImageUrl(initialImageUrl);
                    setImageLoaded(true);

                    const tempImg = new Image();
                    tempImg.crossOrigin = "anonymous";
                    tempImg.onload = () => {
                        detectCorners(tempImg);
                    };
                    tempImg.onerror = () => {
                        setOpenCvError("Imagen cargada desde URL externa. La detección automática de bordes está deshabilitada por restricciones de seguridad.");
                    };
                    tempImg.src = initialImageUrl;
                }
            };

            loadExternalImage();
        }
    }, [initialImageUrl, detectCorners]); // Removed 'img' from dependencies

    const handleImageLoad = useCallback(() => {
        if (imageRef.current) {
            setImageLoaded(true);
            setIsImageLoading(false);
            detectCorners(imageRef.current);
        }
    }, [detectCorners]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find((file) => file.type.startsWith("image/"));

        if (imageFile) {
            setIsImageLoading(true);
            setImg(imageFile);
            setCroppedResult(null);
            setImageLoaded(false);
            setIsReset(false); // Reset the reset state when new image is loaded
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsImageLoading(true);
            setImg(file);
            setCroppedResult(null);
            setImageLoaded(false);
            setIsReset(false); // Reset the reset state when new image is loaded
        }
    }, []);

    // Canvas drawing
    const drawCanvas = useCallback(() => {
        if (!canvasRef.current || !imageRef.current || !imageLoaded) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) {
            return;
        }

        // Set canvas size to container size
        canvas.width = containerRect.width;
        canvas.height = containerRect.height;

        // Set high quality rendering for main canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Calculate image scaling
        const imageAspect = imageRef.current.naturalWidth / imageRef.current.naturalHeight;
        const containerAspect = canvas.width / canvas.height;

        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imageAspect > containerAspect) {
            drawHeight = canvas.width / imageAspect;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imageAspect;
            offsetX = (canvas.width - drawWidth) / 2;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image
        ctx.drawImage(imageRef.current, offsetX, offsetY, drawWidth, drawHeight);

        // Draw crop area only if corners are set
        if (corners.length === 4) {
            // Draw semi-transparent overlay
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Cut out the crop area
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.moveTo(corners[0].x, corners[0].y);
            ctx.lineTo(corners[1].x, corners[1].y);
            ctx.lineTo(corners[2].x, corners[2].y);
            ctx.lineTo(corners[3].x, corners[3].y);
            ctx.closePath();
            ctx.fill();

            ctx.globalCompositeOperation = "source-over";

            // Draw border lines
            ctx.strokeStyle = "#ffc107"; // Amarrillo del Primario
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(corners[0].x, corners[0].y);
            ctx.lineTo(corners[1].x, corners[1].y);
            ctx.lineTo(corners[2].x, corners[2].y);
            ctx.lineTo(corners[3].x, corners[3].y);
            ctx.closePath();
            ctx.stroke();

            // Draw corner handles
            corners.forEach((corner, index) => {
                const isActive = draggedCorner === index;

                // Draw handle background
                ctx.fillStyle = isActive ? "#ffc107" : "#ffc107"; // Amarrillo del Primario
                ctx.beginPath();
                ctx.arc(corner.x, corner.y, 10, 0, 2 * Math.PI);
                ctx.fill();

                // Draw handle border
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 3;
                ctx.stroke();
            });
        }
    }, [corners, draggedCorner, imageLoaded]);

    // Redraw canvas when dependencies change
    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    // Mouse handlers for corner dragging
    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (!canvasRef.current || corners.length !== 4) {
                return;
            }

            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Find closest corner
            let closestCorner = -1;
            let minDistance = Infinity;

            corners.forEach((corner, index) => {
                const distance = Math.sqrt((x - corner.x) ** 2 + (y - corner.y) ** 2);
                if (distance < 20 && distance < minDistance) {
                    minDistance = distance;
                    closestCorner = index;
                }
            });

            if (closestCorner !== -1) {
                setDraggedCorner(closestCorner);
            }
        },
        [corners]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (draggedCorner === null || !canvasRef.current) {
                return;
            }

            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newCorners = [...corners];
            newCorners[draggedCorner] = { x, y };
            setCorners(newCorners);
        },
        [draggedCorner, corners]
    );

    const handleMouseUp = useCallback(() => {
        setDraggedCorner(null);
    }, []);

    // Process image with basic cropping (works without OpenCV)
    const processImage = useCallback(async () => {
        if (!imageRef.current || !canvasRef.current || corners.length !== 4) {
            return;
        }

        setIsProcessing(true);

        try {
            // Create output canvas
            const outputCanvas = document.createElement("canvas");
            const outputCtx = outputCanvas.getContext("2d");
            if (!outputCtx) {
                return;
            }

            // Use original image dimensions for maximum quality (as it was working perfectly)
            const originalWidth = imageRef.current.naturalWidth;
            const originalHeight = imageRef.current.naturalHeight;

            // Use original image dimensions with slight adjustments for better quality
            const outputWidth = Math.round(originalWidth * 1.25); // Slight width increase (25%)
            const outputHeight = Math.round(originalHeight * 1.25); // Slight height increase (25%)

            outputCanvas.width = outputWidth;
            outputCanvas.height = outputHeight;

            // Set high quality rendering
            outputCtx.imageSmoothingEnabled = true;
            outputCtx.imageSmoothingQuality = "high";

            if (openCvLoaded) {
                // Use OpenCV for perspective correction
                try {
                    // @ts-expect-error OpenCV is not defined in the global scope
                    const cv = window.cv;

                    // Create temporary canvas with original image
                    const tempCanvas = document.createElement("canvas");
                    const tempCtx = tempCanvas.getContext("2d");
                    if (!tempCtx) {
                        throw new Error("No temp context");
                    }

                    tempCanvas.width = imageRef.current.naturalWidth;
                    tempCanvas.height = imageRef.current.naturalHeight;
                    tempCtx.drawImage(imageRef.current, 0, 0);

                    // Load image into OpenCV
                    const src = cv.imread(tempCanvas);

                    // Calculate scaling factor from display to original image
                    const containerRect = containerRef.current?.getBoundingClientRect();
                    if (!containerRect) {
                        throw new Error("No container");
                    }

                    const imageAspect = imageRef.current.naturalWidth / imageRef.current.naturalHeight;
                    const containerAspect = containerRect.width / containerRect.height;

                    let drawWidth = containerRect.width;
                    let drawHeight = containerRect.height;
                    let offsetX = 0;
                    let offsetY = 0;

                    if (imageAspect > containerAspect) {
                        drawHeight = containerRect.width / imageAspect;
                        offsetY = (containerRect.height - drawHeight) / 2;
                    } else {
                        drawWidth = containerRect.height * imageAspect;
                        offsetX = (containerRect.width - drawWidth) / 2;
                    }

                    const scaleX = imageRef.current.naturalWidth / drawWidth;
                    const scaleY = imageRef.current.naturalHeight / drawHeight;

                    // Use ordered corners to avoid deformation
                    const orderedDisplayCorners = orderCorners([...corners]);

                    // Convert corners to original image coordinates
                    const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
                        (orderedDisplayCorners[0].x - offsetX) * scaleX,
                        (orderedDisplayCorners[0].y - offsetY) * scaleY,
                        (orderedDisplayCorners[1].x - offsetX) * scaleX,
                        (orderedDisplayCorners[1].y - offsetY) * scaleY,
                        (orderedDisplayCorners[2].x - offsetX) * scaleX,
                        (orderedDisplayCorners[2].y - offsetY) * scaleY,
                        (orderedDisplayCorners[3].x - offsetX) * scaleX,
                        (orderedDisplayCorners[3].y - offsetY) * scaleY,
                    ]);

                    // Destination points (rectangle)
                    const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
                        0,
                        0,
                        outputWidth,
                        0,
                        outputWidth,
                        outputHeight,
                        0,
                        outputHeight,
                    ]);

                    // Calculate perspective transform matrix
                    const M = cv.getPerspectiveTransform(srcPoints, dstPoints);

                    // Apply perspective transform with high quality interpolation
                    const dst = new cv.Mat();
                    cv.warpPerspective(src, dst, M, new cv.Size(outputWidth, outputHeight), cv.INTER_LANCZOS4);

                    // Convert back to canvas
                    cv.imshow(outputCanvas, dst);

                    // Cleanup
                    src.delete();
                    srcPoints.delete();
                    dstPoints.delete();
                    M.delete();
                    dst.delete();

                } catch {
                    // Fallback to basic crop
                    outputCtx.drawImage(imageRef.current, 0, 0, outputWidth, outputHeight);
                }
            } else {
                // Fallback: simple scaling
                outputCtx.drawImage(imageRef.current, 0, 0, outputWidth, outputHeight);
            }

            // Create high-quality blob first
            const highQualityBlob = await new Promise<Blob>((resolve) => {
                outputCanvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    }
                }, "image/jpeg", 1.0);
            });

            // Convert blob to file for compression
            const highQualityFile = new File([highQualityBlob], "image.jpg", { type: "image/jpeg" });

            // Compress intelligently using browser-image-compression
            try {
                const compressedFile = await imageCompression(highQualityFile, {
                    maxSizeMB: 0.8, // 800KB máximo
                    useWebWorker: true, // No bloquea UI
                    fileType: "image/jpeg",
                    maxWidthOrHeight: Math.max(outputWidth, outputHeight), // Mantener dimensiones
                });

                if (onImageCropped) {
                    onImageCropped(compressedFile);
                }
            } catch {
                // Fallback: usar el blob original si la compresión falla
                if (onImageCropped) {
                    onImageCropped(highQualityBlob);
                }
            }

            // Create high-quality preview using PNG format
            const previewDataUrl = outputCanvas.toDataURL("image/png", 1.0);
            setCroppedResult(previewDataUrl);

            // Small delay to show processing state
            await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
            setOpenCvError(`Error al procesar la imagen: ${error}`);
        } finally {
            setIsProcessing(false);
        }

    }, [corners, openCvLoaded, onImageCropped, orderCorners]);

    const resetComponent = useCallback(() => {
        setImg(null);
        setImageUrl(null);
        setCroppedResult(null);
        setImageLoaded(false);
        setIsImageLoading(false);
        setCorners([]);
        setInputKey((prev) => prev + 1);
        setOpenCvError(null);
        setIsReset(true); // Mark as reset to show drag & drop area
    }, []);

    return (
        <div className="w-full space-y-4">
            <Card className="p-4">

                {/* OpenCV Status Alert */}
                {openCvError && (
                    <Alert className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{openCvError}</AlertDescription>
                    </Alert>
                )}

                {!openCvLoaded && !openCvError && (
                    <Alert className="mb-4">
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                            <Settings className="h-4 w-4" />
                        </div>
                        <AlertDescription>Cargando OpenCV... Esto puede tomar unos segundos la primera vez.</AlertDescription>
                    </Alert>
                )}

                {(!img && !initialImageUrl) || isReset ? (
                    <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-2">Arrastra una imagen aquí o haz clic para seleccionar</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            El sistema detectará automáticamente los bordes del documento
                        </p>
                        <Button type="button" onClick={() => fileInputRef.current?.click()}>Seleccionar Imagen</Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            key={inputKey}
                        />
                    </div>
                ) : (img || initialImageUrl) && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 justify-between items-center">
                            <Button variant="outline" type="button" size="sm" onClick={resetComponent}>
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Nueva Imagen
                            </Button>

                            <div className="flex gap-2 items-center">
                                <Button type="button" onClick={processImage} disabled={isProcessing || corners.length !== 4}>
                                    <Smartphone className="h-4 w-4 mr-1" />
                                    {isProcessing ? "Procesando..." : "Recortar"}
                                </Button>
                            </div>
                        </div>

                        <div className="relative border rounded-lg overflow-hidden bg-muted/50" style={{ height: "400px" }}>
                            {isImageLoading && (
                                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                                        <p className="text-sm">Procesando imagen...</p>
                                        <p className="text-xs text-muted-foreground">Preparando para detección de bordes</p>
                                    </div>
                                </div>
                            )}

                            {isProcessing && (
                                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                                        <p className="text-sm">Procesando con IA...</p>
                                    </div>
                                </div>
                            )}

                            <div ref={containerRef} className="relative w-full h-full">
                                {imageUrl && (
                                    <img ref={imageRef} src={imageUrl} alt="Image to crop" className="hidden" onLoad={handleImageLoad} />
                                )}
                                <canvas
                                    ref={canvasRef}
                                    className="absolute inset-0 w-full h-full cursor-crosshair"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                />
                            </div>
                        </div>

                        {imageLoaded && corners.length === 4 && (
                            <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-medium text-accent-foreground flex items-center">
                                        <Scissors className="h-4 w-4 mr-2" />
                                        Área de Recorte Definida
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    <Smartphone className="h-4 w-4 inline mr-1" />
                                    <strong>Arrastra las esquinas</strong> para ajustar el área de recorte, luego haz clic en
                                    &quot;Recortar&quot; para procesar la imagen.
                                </p>
                            </div>
                        )}

                        {imageLoaded && corners.length !== 4 && (
                            <div className="bg-muted/50 border border-muted-foreground/20 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-muted-foreground flex items-center">
                                            <Clock className="h-4 w-4 mr-2" />
                                            Detectando bordes automáticamente...
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            El sistema está analizando la imagen para encontrar los bordes del documento.
                                        </p>
                                    </div>
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                                </div>
                            </div>
                        )}

                        {croppedResult && (
                            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-medium text-primary flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Recorte Completado
                                    </h3>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const link = document.createElement("a");
                                            link.download = `documento-recortado-${Date.now()}.jpg`;
                                            link.href = croppedResult;
                                            link.click();
                                        }}
                                        size="sm"
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        Descargar
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    <Target className="h-4 w-4 inline mr-1" />
                                    Imagen procesada con corrección de perspectiva. Lista para descargar en alta calidad.
                                </p>

                                {/* Preview de la imagen recortada */}
                                <div className="mt-4 p-4 bg-background border rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-medium flex items-center">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Vista previa del resultado:
                                        </h4>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const link = document.createElement("a");
                                                link.href = croppedResult;
                                                link.target = "_blank";
                                                link.click();
                                            }}
                                        >
                                            <Maximize2 className="h-4 w-4 mr-1" />
                                            Ver completo
                                        </Button>
                                    </div>
                                    <div className="flex justify-center bg-muted/20 rounded-lg p-4">
                                        <img
                                            src={croppedResult}
                                            alt="Imagen recortada"
                                            className="max-w-full h-auto max-h-96 object-contain rounded-lg border border-border"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}
