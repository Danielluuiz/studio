'use server';

/**
 * @fileOverview Generates a personalized workout plan based on user input.
 *
 * - generateWorkoutPlan - A function that generates a workout plan.
 * - WorkoutPlanInput - The input type for the generateWorkoutPlan function.
 * - WorkoutPlanOutput - The return type for the generateWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WorkoutPlanInputSchema = z.object({
  goal: z
    .string()
    .describe('The user`s fitness goal (e.g., lose weight, build muscle, improve endurance).'),
  experienceLevel: z
    .string()
    .describe('The user`s experience level (beginner, intermediate, advanced).'),
  availableTime: z
    .string()
    .describe('The user`s available time per week for workouts (e.g., 3 hours, 5 hours).'),
  equipmentAvailable: z
    .string()
    .describe('The equipment the user has access to (e.g., dumbbells, barbell, gym access).'),
});
export type WorkoutPlanInput = z.infer<typeof WorkoutPlanInputSchema>;

const WorkoutPlanOutputSchema = z.object({
  weeklySplit: z
    .string()
    .describe('Resumo da divisão semanal (ex.: Push/Pull/Legs, Full Body, etc.).'),
  days: z.object({
    monday: z.string().describe('Treino de segunda-feira.'),
    tuesday: z.string().describe('Treino de terça-feira.'),
    wednesday: z.string().describe('Treino de quarta-feira.'),
    thursday: z.string().describe('Treino de quinta-feira.'),
    friday: z.string().describe('Treino de sexta-feira.'),
    saturday: z.string().describe('Treino de sábado.'),
    sunday: z.string().describe('Treino de domingo (descanso/ativa).'),
  }),
  warmupAndCooldown: z
    .string()
    .describe('Orientações de aquecimento e alongamento/relaxamento.'),
  notesAndProgression: z
    .string()
    .describe('Notas gerais, progressões, dicas de forma e segurança.'),
});
export type WorkoutPlanOutput = z.infer<typeof WorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: WorkoutPlanInput): Promise<WorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: WorkoutPlanInputSchema},
  output: {schema: WorkoutPlanOutputSchema},
  prompt: `You are a bilingual (pt-BR) personal trainer who creates structured, weekly workout plans.

  Based on the user's inputs, return a STRICT JSON matching the provided output schema fields.
  Keep content concise, readable and formatted with bullet points and clear exercise lists (sets x reps).
  Use Portuguese (Brasil) in all texts.

  Inputs:
  - Fitness Goal: {{{goal}}}
  - Experience Level: {{{experienceLevel}}}
  - Available Time: {{{availableTime}}}
  - Equipment Available: {{{equipmentAvailable}}}

  Output fields:
  - weeklySplit: short summary of the weekly split
  - days.monday..sunday: list of exercises for each day (or descanso/ativo), use bullet points with sets x reps
  - warmupAndCooldown: guidelines for aquecimento alongamentos (5-10 min), pós-treino
  - notesAndProgression: concise tips and progression advice
  `,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: WorkoutPlanInputSchema,
    outputSchema: WorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

