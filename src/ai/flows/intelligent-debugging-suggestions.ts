'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing intelligent debugging suggestions based on code with errors.
 *
 * - `getDebuggingSuggestions` - A function that takes code as input and returns debugging suggestions.
 * - `DebuggingSuggestionsInput` - The input type for the `getDebuggingSuggestions` function.
 * - `DebuggingSuggestionsOutput` - The return type for the `getDebuggingSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DebuggingSuggestionsInputSchema = z.object({
  code: z.string().describe('The code snippet to analyze for debugging suggestions.'),
  language: z.string().optional().describe('The programming language of the code snippet. Defaults to javascript if not provided.'),
});
export type DebuggingSuggestionsInput = z.infer<typeof DebuggingSuggestionsInputSchema>;

const DebuggingSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of debugging suggestions for the given code.'),
  errorDetected: z.boolean().describe('Whether or not an error was detected in the code.'),
  errorMessage: z.string().optional().describe('A description of the error, if any.'),
});
export type DebuggingSuggestionsOutput = z.infer<typeof DebuggingSuggestionsOutputSchema>;

export async function getDebuggingSuggestions(input: DebuggingSuggestionsInput): Promise<DebuggingSuggestionsOutput> {
  return intelligentDebuggingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentDebuggingPrompt',
  input: {schema: DebuggingSuggestionsInputSchema},
  output: {schema: DebuggingSuggestionsOutputSchema},
  prompt: `You are an AI debugging assistant. You will be given a code snippet and your task is to identify any errors and provide debugging suggestions.

  Analyze the following code snippet, paying close attention to syntax errors, runtime errors, and potential bugs. Provide specific suggestions for how to fix these issues.
  If no errors are found, return an empty suggestions array, set errorDetected to false, and omit errorMessage.

  Programming Language: {{language}}
  Code Snippet:
  {{code}}
  \n
  Follow the below schema:
  errorDetected: if any error was detected.
  errorMessage: description of the error if any error was detected.
  suggestions: List of suggestions how to fix code.
  `,
});

const intelligentDebuggingFlow = ai.defineFlow(
  {
    name: 'intelligentDebuggingFlow',
    inputSchema: DebuggingSuggestionsInputSchema,
    outputSchema: DebuggingSuggestionsOutputSchema,
  },
  async input => {
    // if language is undefined, default to javascript
    const language = input.language ?? 'javascript';
    const {
      output,
    } = await prompt({
      ...input,
      language,
    });
    return output!;
  }
);
