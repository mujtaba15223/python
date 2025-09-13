export const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
];

export const TUTORIALS = [
  {
    id: 1,
    title: "JavaScript Basics: Variables and Data Types",
    language: "JavaScript",
    difficulty: "Easy",
    description: "Learn the fundamentals of JavaScript, including variables, constants, and various data types.",
  },
  {
    id: 2,
    title: "Python for Data Science: NumPy and Pandas",
    language: "Python",
    difficulty: "Medium",
    description: "An introduction to the most popular Python libraries for data analysis and scientific computing.",
  },
  {
    id: 3,
    title: "Advanced TypeScript: Generics and Decorators",
    language: "TypeScript",
    difficulty: "Hard",
    description: "Dive deep into advanced TypeScript features to write scalable and type-safe applications.",
  },
  {
    id: 4,
    title: "Go Concurrency: Goroutines and Channels",
    language: "Go",
    difficulty: "Hard",
    description: "Master concurrent programming in Go using its powerful built-in features.",
  },
  {
    id: 5,
    title: "Introduction to React Hooks",
    language: "JavaScript",
    difficulty: "Medium",
    description: "Understand how to use React Hooks to manage state and side effects in functional components.",
  },
  {
    id: 6,
    title: "Java Object-Oriented Programming",
    language: "Java",
    difficulty: "Easy",
    description: "A beginner-friendly guide to the core concepts of OOP in Java.",
  },
];

export const PROGRESS_DATA = {
  summary: {
    tutorialsCompleted: 12,
    exercisesSolved: 35,
    averageScore: 88,
  },
  skills: [
    { name: 'JavaScript', value: 90 },
    { name: 'Python', value: 80 },
    { name: 'TypeScript', value: 95 },
    { name: 'Go', value: 75 },
    { name: 'Java', value: 85 },
    { name: 'React', value: 92 },
  ],
  activity: [
    { name: 'JavaScript', value: 400, fill: "hsl(var(--chart-1))" },
    { name: 'Python', value: 300, fill: "hsl(var(--chart-2))" },
    { name: 'TypeScript', value: 300, fill: "hsl(var(--chart-3))" },
    { name: 'Go', value: 200, fill: "hsl(var(--chart-4))" },
    { name: 'Java', value: 278, fill: "hsl(var(--chart-5))" },
  ]
};
