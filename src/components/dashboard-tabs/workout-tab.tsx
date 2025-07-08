"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateWorkoutPlan } from "@/ai/flows/generate-workout-plan";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell, Zap } from "lucide-react";
import type { UserProfile } from "./profile-tab";

interface WorkoutTabProps {
  userProfile: UserProfile | null;
}

export default function WorkoutTab({ userProfile }: WorkoutTabProps) {
  const { toast } = useToast();
  const [workoutPlan, setWorkoutPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async () => {
    if (!userProfile) {
      toast({
        title: "Perfil Incompleto",
        description: "Por favor, preencha seu perfil antes de gerar um plano de treino.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setWorkoutPlan("");
    try {
      const result = await generateWorkoutPlan({
        goal: userProfile.goal,
        experienceLevel: userProfile.experienceLevel,
        availableTime: userProfile.weeklyAvailability,
        equipmentAvailable: userProfile.equipmentAvailable,
      });
      setWorkoutPlan(result.workoutPlan);
      toast({
        title: "Plano de Treino Gerado!",
        description: "Seu plano de treino personalizado está pronto.",
      });
    } catch (error) {
      console.error("Error generating workout plan:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o plano de treino. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Dumbbell className="text-primary" />
            Plano de Treino IA
          </CardTitle>
          <CardDescription>
            Gere um plano de treino personalizado com base no seu perfil e objetivos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGeneratePlan} disabled={isLoading || !userProfile} className="bg-primary hover:bg-primary/90">
            {isLoading ? "Gerando Plano..." : "Gerar Plano de Treino"}
          </Button>
           {!userProfile && (
             <p className="text-sm text-destructive mt-2">Preencha seu perfil para habilitar a geração de plano.</p>
          )}
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      )}

      {workoutPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-primary"/> Seu Plano de Treino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none p-4 bg-secondary rounded-md">
                <pre className="whitespace-pre-wrap font-sans text-sm">{workoutPlan}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
