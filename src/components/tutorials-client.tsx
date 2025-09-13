"use client";

import { TUTORIALS } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TutorialsClient() {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {TUTORIALS.map((tutorial) => (
        <Card key={tutorial.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{tutorial.title}</CardTitle>
            <CardDescription>{tutorial.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow"></CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex gap-2">
              <Badge variant="secondary">{tutorial.language}</Badge>
              <Badge variant={tutorial.difficulty === 'Easy' ? 'default' : tutorial.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                {tutorial.difficulty}
              </Badge>
            </div>
            <Button>Start Learning</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
