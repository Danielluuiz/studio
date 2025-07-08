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
  workoutPlan: z
    .string()
    .describe('A personalized workout plan including exercises, sets, reps, and progression.'),
});
export type WorkoutPlanOutput = z.infer<typeof WorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: WorkoutPlanInput): Promise<WorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: WorkoutPlanInputSchema},
  output: {schema: WorkoutPlanOutputSchema},
  prompt: `You are a personal trainer who specializes in creating personalized workout plans.

  Based on the user's input, generate a workout plan that is tailored to their fitness goals, experience level, available time, and equipment.

  Fitness Goal: {{{goal}}}
  Experience Level: {{{experienceLevel}}}
  Available Time: {{{availableTime}}}
  Equipment Available: {{{equipmentAvailable}}}

  Workout Plan:
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

