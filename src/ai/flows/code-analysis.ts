'use server';

/**
 * @fileOverview Provides static code analysis using an LLM to identify potential errors and bugs in the submitted code.
 *
 * - analyzeCode - A function that handles the code analysis process.
 * - AnalyzeCodeInput - The input type for the analyzeCode function.
 * - AnalyzeCodeOutput - The return type for the analyzeCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeInputSchema = z.object({
  code: z.string().describe('The code to be analyzed.'),
  language: z.string().describe('The programming language of the code.'),
});
export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

const AnalyzeCodeOutputSchema = z.object({
  analysis: z.string().describe('The static analysis feedback from the LLM.'),
  potentialErrors: z.string().describe('A list of potential errors and bugs identified in the code.'),
  suggestions: z.string().describe('Suggestions for improving the code and fixing potential errors.'),
});
export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;

export async function analyzeCode(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  return analyzeCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCodePrompt',
  input: {schema: AnalyzeCodeInputSchema},
  output: {schema: AnalyzeCodeOutputSchema},
  prompt: `You are a static code analysis tool. You will receive code and provide feedback on potential errors and bugs.

  Analyze the following code, written in {{language}}:
  \`\`\`{{language}}
  {{{code}}}
  \`\`\`

  Provide a detailed analysis of the code, identify potential errors and bugs, and suggest improvements.
  Your analysis should be structured and easy to understand.

  Output the analysis, potential errors, and suggestions in a clear and concise manner.

  Here's an example of how to structure your response:
  \\\`\`\`json
  {
    "analysis": "[Detailed analysis of the code...]",
    "potentialErrors": "[List of potential errors and bugs...]",
    "suggestions": "[Suggestions for improving the code and fixing errors...]"
  }
  \\\`\`\`
  `,
});

const analyzeCodeFlow = ai.defineFlow(
  {
    name: 'analyzeCodeFlow',
    inputSchema: AnalyzeCodeInputSchema,
    outputSchema: AnalyzeCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
