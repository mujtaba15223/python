"use client";

import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROGRESS_DATA } from "@/lib/data";
import { ChartContainer, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

const skillsChartConfig = {
  value: {
    label: "Score",
  },
  ...PROGRESS_DATA.skills.reduce((acc, skill) => {
    acc[skill.name] = { label: skill.name };
    return acc;
  }, {} as any)
} satisfies ChartConfig;

const activityChartConfig = {
  value: {
    label: "Activity"
  }
} satisfies ChartConfig;


export function ProgressClient() {
  const { summary, skills, activity } = PROGRESS_DATA;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tutorials Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{summary.tutorialsCompleted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Exercises Solved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{summary.exercisesSolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{summary.averageScore}%</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={skillsChartConfig} className="h-64 w-full">
              <BarChart data={skills} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-primary)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Language Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
             <ChartContainer config={activityChartConfig} className="h-64 w-full">
              <PieChart>
                <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={activity} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {activity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
