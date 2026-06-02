export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon name
  count: number;
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
  courses: number;
  students: string;
  color: string;
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  category: string;
  instructor: string;
  level: Level;
  rating: number;
  reviews: number;
  students: number;
  hours: number;
  lessons: number;
  price: number;
  oldPrice?: number;
  free: boolean;
  badge?: string;
  color: string;
  description: string;
  outcomes: string[];
  language: string;
  expiry: string;
  certificate: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g. "08:24"
  vimeoId: string;
  free?: boolean;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Scholarship {
  id: number;
  slug: string;
  name: string;
  provider: string;
  country: string;
  level: string;
  funding: "Full" | "Partial";
  deadline: string;
  flag: string;
  website: string;
  overview: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
}

export interface Roadmap {
  id: string;
  title: string;
  icon: string;
  demand: "Very High" | "High" | "Medium";
  salary: string;
  months: number;
  skills: string[];
  description: string;
  steps: { title: string; detail: string }[];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  excerpt: string;
  body: string[];
  color: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  initials: string;
}
