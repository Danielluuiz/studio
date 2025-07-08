import { config } from 'dotenv';
config();

import '@/ai/flows/generate-workout-plan.ts';
import '@/ai/flows/generate-meal-suggestions.ts';
import '@/ai/flows/ai-virtual-assistant.ts';
import '@/ai/flows/analyze-progress-and-provide-feedback.ts';