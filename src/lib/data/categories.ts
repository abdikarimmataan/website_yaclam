import type { Category } from "@/lib/types";

export const categories: Category[] = [
  { id: "data", name: "Data Analytics", icon: "BarChart3", count: 7 },
  { id: "ai", name: "Artificial Intelligence", icon: "Brain", count: 5 },
  { id: "dev", name: "Software Development", icon: "Code2", count: 6 },
  { id: "finance", name: "Finance & Trading", icon: "DollarSign", count: 5 },
  { id: "design", name: "Design", icon: "PenTool", count: 4 },
  { id: "marketing", name: "Digital Marketing", icon: "Megaphone", count: 4 },
  { id: "cyber", name: "Cybersecurity", icon: "Lock", count: 3 },
  { id: "cloud", name: "Cloud & DevOps", icon: "Cloud", count: 3 },
  { id: "business", name: "Business & Entrepreneurship", icon: "Briefcase", count: 4 },
  { id: "career", name: "Career & Study Abroad", icon: "GraduationCap", count: 3 },
];

export const categoryName = (id: string) =>
  categories.find((c) => c.id === id)?.name ?? id;

export const categoryIcon = (id: string) =>
  categories.find((c) => c.id === id)?.icon ?? "BookOpen";
