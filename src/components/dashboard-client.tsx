"use client";

import { useState } from "react";
import { analyzeCode } from "@/ai/flows/code-analysis";
import { getDebuggingSuggestions } from "@/ai/flows/intelligent-debugging-suggestions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGES } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Bot, Code2, LoaderCircle, Terminal } from "lucide-react";

type AnalysisResult = {
  analysis: string;
  potentialErrors: string;
  suggestions: string;
} | null;

type DebuggingResult = {
  suggestions: string[];
  errorDetected: boolean;
  errorMessage?: string;
} | null;

export function DashboardClient() {
  const [code, setCode] = useState("function greet(name) {\n  console.log('Hello, ' + name);\n}");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState("analysis");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(null);
  const [debuggingResult, setDebuggingResult] = useState<DebuggingResult>(null);
  const [executionOutput, setExecutionOutput] = useState("");
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setActiveTab("analysis");
    setAnalysisResult(null);
    try {
      const result = await analyzeCode({ code, language });
      setAnalysisResult(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Analysis Failed", description: "Could not analyze the code." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebug = async () => {
    setIsLoading(true);
    setActiveTab("debugging");
    setDebuggingResult(null);
    try {
      const result = await getDebuggingSuggestions({ code, language });
      setDebuggingResult(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Debugging Failed", description: "Could not get debugging suggestions." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = () => {
    setIsLoading(true);
    setActiveTab("output");
    setExecutionOutput("");
    setTimeout(() => {
      setExecutionOutput(`> Hello, World!\n\nExecution simulation finished.`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="grid h-full gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Code Editor</CardTitle>
              <div className="w-40">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code here..."
              className="h-96 min-h-96 font-code text-[14px] leading-6"
            />
          </CardContent>
        </Card>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading && activeTab === 'analysis' ? <LoaderCircle className="animate-spin" /> : <Bot />}
            Analyze Code
          </Button>
          <Button onClick={handleDebug} variant="secondary" disabled={isLoading}>
            {isLoading && activeTab === 'debugging' ? <LoaderCircle className="animate-spin" /> : <Code2 />}
            Debug
          </Button>
          <Button onClick={handleRun} variant="secondary" disabled={isLoading}>
            {isLoading && activeTab === 'output' ? <LoaderCircle className="animate-spin" /> : <Terminal />}
            Run Code
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="debugging">Debugging</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 flex-1">
            {isLoading ? (
                <div className="flex h-full items-center justify-center rounded-lg border bg-card p-6">
                    <LoaderCircle className="size-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <TabsContent value="analysis" className="m-0">
                        {analysisResult ? (
                        <Card className="h-full">
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">Analysis</h3>
                                    <p className="text-muted-foreground">{analysisResult.analysis}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Potential Errors</h3>
                                    <p className="text-muted-foreground">{analysisResult.potentialErrors}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Suggestions</h3>
                                    <p className="text-muted-foreground">{analysisResult.suggestions}</p>
                                </div>
                            </CardContent>
                        </Card>
                        ) : (
                        <div className="text-center text-muted-foreground p-10">Click "Analyze Code" to see the results.</div>
                        )}
                    </TabsContent>
                    <TabsContent value="debugging" className="m-0">
                    {debuggingResult ? (
                      debuggingResult.errorDetected ? (
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <Alert variant="destructive">
                                    <AlertTitle>{debuggingResult.errorMessage}</AlertTitle>
                                </Alert>
                                <div>
                                <h3 className="font-semibold text-lg mt-4">Suggestions</h3>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                    {debuggingResult.suggestions.map((s, i) => (
                                    <li key={i}>{s}</li>
                                    ))}
                                </ul>
                                </div>
                            </CardContent>
                        </Card>
                      ) : (
                        <Alert>
                          <AlertTitle>No Errors Detected!</AlertTitle>
                          <AlertDescription>The AI assistant did not find any obvious errors in your code.</AlertDescription>
                        </Alert>
                      )
                    ) : (
                      <div className="text-center text-muted-foreground p-10">Click "Debug" to get AI-powered suggestions.</div>
                    )}
                    </TabsContent>
                    <TabsContent value="output" className="m-0">
                        <Card className="h-full">
                            <CardContent className="p-0">
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto h-full"><code className="font-code text-sm text-foreground whitespace-pre-wrap">{executionOutput || 'Click "Run Code" to see the output.'}</code></pre>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
