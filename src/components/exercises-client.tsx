"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateExercise, type GenerateExerciseOutput } from "@/ai/flows/generate-exercise";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LANGUAGES } from "@/lib/data";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  language: z.string().min(1, "Please select a language."),
  difficulty: z.enum(["easy", "medium", "hard"]),
  topic: z.string().optional(),
});

export function ExercisesClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [exercise, setExercise] = useState<GenerateExerciseOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "javascript",
      difficulty: "easy",
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setExercise(null);
    try {
      const result = await generateExercise(values);
      setExercise(result);
      toast({ title: "Exercise Generated!", description: "A new exercise has been created for you." });
    } catch (error) {
      toast({ variant: "destructive", title: "Generation Failed", description: "Could not generate an exercise." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Generate Exercise</CardTitle>
            <CardDescription>Select your preferences to generate a new programming exercise.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Programming Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Arrays, Sorting, API" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  Generate
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {isLoading && (
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed bg-card">
            <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}
        {exercise && (
          <Card>
            <CardHeader>
              <CardTitle>{exercise.exerciseTitle}</CardTitle>
              <CardDescription>{exercise.exerciseDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Initial Code</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto"><code className="font-code text-sm">{exercise.initialCode}</code></pre>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Test Cases</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto"><code className="font-code text-sm">{exercise.testCases}</code></pre>
              </div>
            </CardContent>
          </Card>
        )}
        {!isLoading && !exercise && (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-8 text-center">
            <h3 className="text-xl font-semibold">Your exercise will appear here</h3>
            <p className="text-muted-foreground mt-2">Fill out the form and click "Generate" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
