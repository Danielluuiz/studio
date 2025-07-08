"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { analyzeProgressAndProvideFeedback } from "@/ai/flows/analyze-progress-and-provide-feedback";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart as LucideLineChart, Lightbulb } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import type { UserProfile } from "./profile-tab";

interface ProgressTabProps {
  userProfile: UserProfile | null;
}

const weightData = [
  { date: "Semana 1", weight: 85 },
  { date: "Semana 2", weight: 84.5 },
  { date: "Semana 3", weight: 84 },
  { date: "Semana 4", weight: 83 },
  { date: "Semana 5", weight: 83.2 },
  { date: "Semana 6", weight: 82.5 },
];

const performanceData = [
  { exercise: "Supino", lift: 60 },
  { exercise: "Agachamento", lift: 80 },
  { exercise: "Levantamento", lift: 100 },
  { exercise: "Remada", lift: 50 },
  { exercise: "Desenvolvimento", lift: 40 },
];

export default function ProgressTab({ userProfile }: ProgressTabProps) {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [workoutLogs, setWorkoutLogs] = useState("");
  const [nutritionLogs, setNutritionLogs] = useState("");

  const handleAnalyzeProgress = async () => {
    if (!userProfile) {
      toast({
        title: "Perfil Incompleto",
        description: "Por favor, preencha seu perfil para análise.",
        variant: "destructive",
      });
      return;
    }
    if (!workoutLogs || !nutritionLogs) {
        toast({
            title: "Dados Insuficientes",
            description: "Por favor, preencha seus logs de treino e nutrição.",
            variant: "destructive",
        });
        return;
    }

    setIsLoading(true);
    setFeedback("");
    try {
      const result = await analyzeProgressAndProvideFeedback({
        workoutLogs,
        nutritionLogs,
        userProfile: JSON.stringify(userProfile),
      });
      setFeedback(result.feedback);
      toast({
        title: "Análise Concluída!",
        description: "Seu feedback personalizado está pronto.",
      });
    } catch (error) {
      console.error("Error analyzing progress:", error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível analisar seu progresso. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline mb-4 flex items-center gap-2"><LucideLineChart className="text-primary"/> Acompanhamento de Progresso</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Peso (kg)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']}/>
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance nos Exercícios (kg)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="exercise" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="lift" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Lightbulb className="text-primary" /> Análise de Progresso com IA
          </CardTitle>
          <CardDescription>
            Insira seus logs de treino e nutrição para receber feedback e sugestões personalizadas da nossa IA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="workout-logs">Logs de Treino</label>
              <Textarea
                id="workout-logs"
                placeholder="Ex: Semana 4 - Supino: 3x5 80kg (aumento de 2.5kg)"
                value={workoutLogs}
                onChange={(e) => setWorkoutLogs(e.target.value)}
                rows={6}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="nutrition-logs">Logs de Nutrição</label>
              <Textarea
                id="nutrition-logs"
                placeholder="Ex: Média da Semana 4 - 2500 kcal, 180g proteína"
                value={nutritionLogs}
                onChange={(e) => setNutritionLogs(e.target.value)}
                rows={6}
                disabled={isLoading}
              />
            </div>
          </div>
          <Button onClick={handleAnalyzeProgress} disabled={isLoading || !userProfile}>
            {isLoading ? "Analisando..." : "Analisar Progresso"}
          </Button>
           {!userProfile && (
             <p className="text-sm text-destructive mt-2">Preencha seu perfil para habilitar a análise.</p>
          )}
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-2">
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
      )}

      {feedback && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle className="font-headline">Feedback da IA</AlertTitle>
          <AlertDescription>
            <pre className="whitespace-pre-wrap font-sans text-sm">{feedback}</pre>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
