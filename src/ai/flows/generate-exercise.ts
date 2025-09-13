'use server';

/**
 * @fileOverview Generates programming exercises based on user preferences.
 *
 * - generateExercise - A function that generates a programming exercise.
 * - GenerateExerciseInput - The input type for the generateExercise function.
 * - GenerateExerciseOutput - The return type for the generateExercise function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExerciseInputSchema = z.object({
  language: z.string().describe('The programming language for the exercise.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the exercise.'),
  topic: z.string().optional().describe('The topic of the exercise.'),
});
export type GenerateExerciseInput = z.infer<typeof GenerateExerciseInputSchema>;

const GenerateExerciseOutputSchema = z.object({
  exerciseTitle: z.string().describe('The title of the generated exercise.'),
  exerciseDescription: z.string().describe('The description of the exercise.'),
  initialCode: z.string().describe('The initial code provided for the exercise.'),
  testCases: z.string().describe('The test cases for the exercise.'),
});
export type GenerateExerciseOutput = z.infer<typeof GenerateExerciseOutputSchema>;

export async function generateExercise(input: GenerateExerciseInput): Promise<GenerateExerciseOutput> {
  return generateExerciseFlow(input);
}

const generateExercisePrompt = ai.definePrompt({
  name: 'generateExercisePrompt',
  input: {schema: GenerateExerciseInputSchema},
  output: {schema: GenerateExerciseOutputSchema},
  prompt: `You are a programming exercise generator. Generate a programming exercise based on the following criteria:

Language: {{{language}}}
Difficulty: {{{difficulty}}}
Topic: {{topic}}

Exercise Title:
Exercise Description:
Initial Code:
Test Cases:`, // Fixed: Removed unnecessary backticks and added missing colon.
});

const generateExerciseFlow = ai.defineFlow(
  {
    name: 'generateExerciseFlow',
    inputSchema: GenerateExerciseInputSchema,
    outputSchema: GenerateExerciseOutputSchema,
  },
  async input => {
    const {output} = await generateExercisePrompt(input);
    return output!;
  }
);
