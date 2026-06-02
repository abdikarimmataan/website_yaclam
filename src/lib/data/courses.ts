import type { Course, Level } from "@/lib/types";
import { slugify } from "@/lib/utils";

type Seed = [
  title: string,
  category: string,
  instructor: string,
  level: Level,
  price: number, // 0 = free
  badge?: string
];

// Base catalogue — 40 courses across every category.
const seeds: Seed[] = [
  // Data Analytics (7)
  ["Power BI & Data Analytics Mastery", "data", "Abdikarim Mataan", "Intermediate", 49, "Bestseller"],
  ["Python for Data Analysis", "data", "Eng. Mohamud Ali", "Beginner", 0, "Free"],
  ["SQL for Data Analysts: Zero to Job-Ready", "data", "Abdikarim Mataan", "Beginner", 39, "Popular"],
  ["Excel for Business & Analytics", "data", "Faadumo Hassan", "Beginner", 29, "Bestseller"],
  ["Data Visualisation & Storytelling", "data", "Abdikarim Mataan", "Intermediate", 45],
  ["Statistics for Data Analysts", "data", "Eng. Mohamud Ali", "Intermediate", 35],
  ["Building Dashboards with Looker Studio", "data", "Faadumo Hassan", "Beginner", 0, "Free"],
  // Artificial Intelligence (5)
  ["AI & Prompt Engineering Essentials", "ai", "Abdikarim Mataan", "Beginner", 39, "New"],
  ["Machine Learning Foundations", "ai", "Eng. Mohamud Ali", "Intermediate", 59],
  ["Build AI Apps with the Claude & OpenAI APIs", "ai", "Eng. Mohamud Ali", "Advanced", 69, "New"],
  ["Generative AI for Productivity", "ai", "Hodan Abdi", "Beginner", 29],
  ["Deep Learning with PyTorch", "ai", "Eng. Mohamud Ali", "Advanced", 79],
  // Software Development (6)
  ["Full-Stack Web Development with Next.js", "dev", "Eng. Mohamud Ali", "Advanced", 79, "Top Rated"],
  ["JavaScript from Scratch", "dev", "Eng. Mohamud Ali", "Beginner", 0, "Free"],
  ["React & TypeScript in Practice", "dev", "Eng. Mohamud Ali", "Intermediate", 49],
  ["Mobile App Development with Flutter", "dev", "Faadumo Hassan", "Intermediate", 55],
  ["Git, GitHub & Team Workflows", "dev", "Eng. Mohamud Ali", "Beginner", 19],
  ["Backend APIs with Node.js & PostgreSQL", "dev", "Eng. Mohamud Ali", "Intermediate", 59],
  // Finance & Trading (5)
  ["Forex & ICT Trading Foundations", "finance", "Abdikarim Mataan", "Intermediate", 59, "Popular"],
  ["Crypto & Blockchain Basics", "finance", "Abdikarim Mataan", "Beginner", 0, "Free"],
  ["Trading Psychology & Risk Management", "finance", "Abdikarim Mataan", "Intermediate", 39],
  ["Personal Finance & Halal Investing", "finance", "Hodan Abdi", "Beginner", 25],
  ["Financial Modelling in Excel", "finance", "Faadumo Hassan", "Intermediate", 45],
  // Design (4)
  ["UI/UX Design with Figma", "design", "Faadumo Hassan", "Intermediate", 45, "Popular"],
  ["Graphic Design Fundamentals", "design", "Faadumo Hassan", "Beginner", 0, "Free"],
  ["Design Systems & Branding", "design", "Faadumo Hassan", "Advanced", 49],
  ["Canva for Content Creators", "design", "Hodan Abdi", "Beginner", 15],
  // Digital Marketing (4)
  ["Digital Marketing Complete Guide", "marketing", "Hodan Abdi", "Beginner", 39, "Bestseller"],
  ["Social Media Marketing & Growth", "marketing", "Hodan Abdi", "Beginner", 29],
  ["SEO & Content Strategy", "marketing", "Hodan Abdi", "Intermediate", 35],
  ["YouTube Channel Growth Blueprint", "marketing", "Abdikarim Mataan", "Beginner", 0, "Free"],
  // Cybersecurity (3)
  ["Cybersecurity Essentials", "cyber", "Dr. Ahmed Yusuf", "Beginner", 0, "Free"],
  ["Ethical Hacking Fundamentals", "cyber", "Dr. Ahmed Yusuf", "Intermediate", 59],
  ["Network Security & Defence", "cyber", "Dr. Ahmed Yusuf", "Advanced", 65],
  // Cloud & DevOps (3)
  ["Cloud Computing with AWS", "cloud", "Dr. Ahmed Yusuf", "Intermediate", 55, "New"],
  ["Docker & Kubernetes for Beginners", "cloud", "Eng. Mohamud Ali", "Intermediate", 49],
  ["DevOps & CI/CD Pipelines", "cloud", "Dr. Ahmed Yusuf", "Advanced", 59],
  // Business & Entrepreneurship (4)
  ["Start & Grow Your Online Business", "business", "Hodan Abdi", "Beginner", 35, "Popular"],
  ["Project Management Fundamentals", "business", "Hodan Abdi", "Beginner", 29],
  ["Freelancing & Remote Work Mastery", "business", "Abdikarim Mataan", "Beginner", 0, "Free"],
  ["Business Analysis & Strategy", "business", "Hodan Abdi", "Intermediate", 45],
  // Career & Study Abroad (3)
  ["Scholarship Application Masterclass", "career", "Mataan Scholarships", "Beginner", 0, "Free"],
  ["CV, LinkedIn & Interview Mastery", "career", "Mataan Scholarships", "Beginner", 19, "Popular"],
  ["IELTS Preparation Bootcamp", "career", "Mataan Scholarships", "Beginner", 25],
];

const colorFor = (cat: string) => {
  const map: Record<string, string> = {
    data: "#1F3A93", ai: "#0D1B4B", dev: "#1F3A93", finance: "#C9A84C",
    design: "#0D1B4B", marketing: "#1F3A93", cyber: "#0D1B4B", cloud: "#1F3A93",
    business: "#0D1B4B", career: "#C9A84C",
  };
  return map[cat] ?? "#1F3A93";
};

const genericOutcomes = (title: string) => [
  "Build real, portfolio-ready projects from scratch",
  "Understand the core concepts deeply, explained in Somali",
  `Apply ${title.split(" ")[0]} skills to job-ready scenarios`,
  "Earn a verified certificate of completion",
  "Prepare confidently for interviews and assessments",
  "Learn at your own pace with lifetime access",
];

// Deterministic pseudo-random so data is stable between renders.
const seedRand = (n: number, min: number, max: number) => {
  const x = Math.sin(n * 99.13) * 10000;
  const f = x - Math.floor(x);
  return Math.round(min + f * (max - min));
};

export const courses: Course[] = seeds.map(([title, category, instructor, level, price, badge], i) => {
  const id = i + 1;
  const free = price === 0;
  const rating = +(4.5 + (seedRand(id, 0, 49) / 100)).toFixed(1);
  const reviews = seedRand(id * 3, 180, 2200);
  const students = seedRand(id * 7, 900, 6800);
  const hours = seedRand(id * 2, 12, 56);
  const lessons = seedRand(id * 5, 48, 220);
  const oldPrice = free ? undefined : Math.round(price * (1.8 + (seedRand(id, 0, 40) / 100)));
  return {
    id,
    slug: slugify(title),
    title,
    category,
    instructor,
    level,
    rating,
    reviews,
    students,
    hours,
    lessons,
    price,
    oldPrice,
    free,
    badge,
    color: colorFor(category),
    description:
      `A practical, project-based course taught in Somali with English technical terms. ${title} takes you from the fundamentals to confident, job-ready application — built for the real expectations of employers in the Gulf, East Africa and the diaspora.`,
    outcomes: genericOutcomes(title),
    language: "Somali",
    expiry: "1 Year",
    certificate: true,
  };
});

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);
export const featuredCourses = courses.filter((c) => c.badge).slice(0, 6);
export const freeCourses = courses.filter((c) => c.free);
