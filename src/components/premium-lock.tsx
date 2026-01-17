import React from "react";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PremiumLock({ featureName }: { featureName: string }) {
    return (
        <Card className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-80">
            <CardHeader>
                <div className="mx-auto bg-secondary p-4 rounded-full mb-4">
                    <Lock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-headline">Recurso Premium</CardTitle>
                <CardDescription className="max-w-md mx-auto">
                    O acesso a <strong>{featureName}</strong> é exclusivo para assinantes Premium.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="font-bold bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white border-0">
                    Assinar Premium
                </Button>
            </CardContent>
        </Card>
    );
}
