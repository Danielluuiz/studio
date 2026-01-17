"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateWorkoutPlan } from "@/ai/flows/generate-workout-plan";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell, Zap } from "lucide-react";
import type { UserProfile } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface WorkoutTabProps {
  userProfile: UserProfile | null;
}

export default function WorkoutTab({ userProfile }: WorkoutTabProps) {
  const { toast } = useToast();
  const [workoutPlan, setWorkoutPlan] = useState<null | {
    weeklySplit: string;
    days: Record<string, string>;
    warmupAndCooldown: string;
    notesAndProgression: string;
    createdAt?: string;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(`workoutPlan:${user.uid}`);
      if (cached) {
        try {
          setWorkoutPlan(JSON.parse(cached));
        } catch { }
      }
    }
    (async () => {
      try {
        const ref = doc(db, "users", user.uid, "plans", "workout");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          setWorkoutPlan(data);
          if (typeof window !== "undefined") {
            sessionStorage.setItem(`workoutPlan:${user.uid}`, JSON.stringify(data));
          }
        }
      } catch (e) {
        console.warn("Falha ao carregar plano de treino:", e);
      }
    })();
  }, [user]);

  const handleGeneratePlan = async () => {
    if (!userProfile) {
      toast({
        title: "Perfil Incompleto",
        description: "Por favor, preencha seu perfil antes de gerar um plano de treino.",
        variant: "destructive",
      });
      return;
    }

    // Check if plan already exists and is recent (Basic Plan Constraint)
    if (workoutPlan?.createdAt) {
      const planDate = new Date(workoutPlan.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - planDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 30) {
        toast({
          title: "Limite do Plano Grátis",
          description: `Você só pode gerar um novo plano a cada 30 dias. Próximo disponível em ${30 - diffDays} dias.`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    setWorkoutPlan(null);
    try {
      const result = await generateWorkoutPlan({
        goal: userProfile.goal,
        experienceLevel: userProfile.experienceLevel,
        availableTime: userProfile.weeklyAvailability,
        equipmentAvailable: userProfile.equipmentAvailable,
      });
      const resultWithDate = {
        ...result,
        createdAt: new Date().toISOString()
      };
      setWorkoutPlan(resultWithDate as any);
      if (typeof window !== "undefined" && user) {
        sessionStorage.setItem(`workoutPlan:${user.uid}`, JSON.stringify(resultWithDate));
      }
      if (user) {
        try {
          await setDoc(doc(db, "users", user.uid, "plans", "workout"), resultWithDate as any);
        } catch (e) {
          console.warn("Falha ao salvar plano de treino:", e);
        }
      }
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
              <Zap className="text-primary" /> Seu Plano de Treino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="split">
                <AccordionTrigger className="text-lg font-medium">
                  Divisão Semanal
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{workoutPlan.weeklySplit}</pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="mon">
                <AccordionTrigger className="text-lg font-medium">Segunda-feira</AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{workoutPlan.days.monday}</pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tue">
                <AccordionTrigger className="text-lg font-medium">Terça-feira</AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{workoutPlan.days.tuesday}</pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="wed">
                <AccordionTrigger className="text-lg font-medium">Quarta-feira</AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{workoutPlan.days.wednesday}</pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="thu">
                <AccordionTrigger className="text-lg font-medium">Quinta-feira</AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{workoutPlan.days.thursday}</pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="fri">
                <AccordionTrigger className="text-lg font-medium">Sexta-feira</AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{workoutPlan.days.friday}</pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sat">
                <AccordionTrigger className="text-lg font-medium">Sábado</AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{workoutPlan.days.saturday}</pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sun">
                <AccordionTrigger className="text-lg font-medium">Domingo</AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{workoutPlan.days.sunday}</pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="warmup">
                <AccordionTrigger className="text-lg font-medium">Aquecimento e Recuperação</AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{workoutPlan.warmupAndCooldown}</pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="notes">
                <AccordionTrigger className="text-lg font-medium">Notas e Progressão</AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap p-4 bg-secondary rounded-md font-sans text-sm">{workoutPlan.notesAndProgression}</pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
