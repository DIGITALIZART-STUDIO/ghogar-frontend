import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {  ArrowLeft, Database } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg border-2 border-primary/20">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Database className="w-10 h-10 text-primary" />
                    </div>
                </CardHeader>

                <CardContent className="text-center space-y-6">
                    {/* Error Display */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-5xl font-bold text-primary">4</span>
                            <div className="w-12 h-12 border-4 border-primary rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary">0</span>
                            </div>
                            <span className="text-5xl font-bold text-primary">4</span>
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Registro no encontrado</h2>
                        <p className="text-muted-foreground text-sm">
                            El recurso que buscas no existe en el CRM
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" asChild className="flex-1 bg-transparent">
                            <Link href="/dashboard">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Link>
                        </Button>

                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
