import CodeCompassLayout from "@/components/code-compass-layout";
import { ExercisesClient } from "@/components/exercises-client";
import { Suspense } from "react";

export default function ExercisesPage() {
  return (
    <CodeCompassLayout title="Exercises">
      <Suspense fallback={<div>Loading...</div>}>
        <ExercisesClient />
      </Suspense>
    </CodeCompassLayout>
  );
}
