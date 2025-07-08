'use server';
/**
 * @fileOverview AI flow for analyzing user progress and providing personalized feedback.
 *
 * - analyzeProgressAndProvideFeedback - A function that analyzes workout and nutrition logs to provide feedback and suggestions.
 * - AnalyzeProgressInput - The input type for the analyzeProgressAndProvideFeedback function.
 * - AnalyzeProgressOutput - The return type for the analyzeProgressAndProvideFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProgressInputSchema = z.object({
  workoutLogs: z.string().describe('The user\u2019s workout logs, including exercises, sets, reps, and weight used.'),
  nutritionLogs: z.string().describe('The user\u2019s nutrition logs, including meals, calories, and macronutrient breakdown.'),
  userProfile: z.string().describe('The user\u2019s profile information, including goals, experience level, and preferences.'),
});
export type AnalyzeProgressInput = z.infer<typeof AnalyzeProgressInputSchema>;

const AnalyzeProgressOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback and suggestions based on the user\u2019s progress, including potential plateaus and how to overcome them.'),
});
export type AnalyzeProgressOutput = z.infer<typeof AnalyzeProgressOutputSchema>;

export async function analyzeProgressAndProvideFeedback(input: AnalyzeProgressInput): Promise<AnalyzeProgressOutput> {
  return analyzeProgressAndProvideFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProgressAndProvideFeedbackPrompt',
  input: {schema: AnalyzeProgressInputSchema},
  output: {schema: AnalyzeProgressOutputSchema},
  prompt: `You are a fitness and nutrition expert. Analyze the user's workout and nutrition logs, taking into account their profile information to provide personalized feedback and suggestions.

Workout Logs: {{{workoutLogs}}}
Nutrition Logs: {{{nutritionLogs}}}
User Profile: {{{userProfile}}}

Provide feedback to help the user avoid plateaus and achieve their goals.
`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const analyzeProgressAndProvideFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeProgressAndProvideFeedbackFlow',
    inputSchema: AnalyzeProgressInputSchema,
    outputSchema: AnalyzeProgressOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
