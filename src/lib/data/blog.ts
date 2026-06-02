import type { BlogPost } from "@/lib/types";
import { slugify } from "@/lib/utils";

type B = {
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  excerpt: string;
  body: string[];
};

const colorFor = (cat: string) => {
  const map: Record<string, string> = {
    AI: "#0D1B4B", Technology: "#1F3A93", Careers: "#C9A84C",
    Finance: "#1F3A93", Scholarships: "#0D1B4B", "Study Abroad": "#C9A84C",
  };
  return map[cat] ?? "#1F3A93";
};

const raw: B[] = [
  { title: "How to Become a Data Analyst in 2026 (Complete Roadmap)", category: "Careers", author: "Abdikarim Mataan", date: "2026-05-20", readTime: 9,
    excerpt: "Data analysis is the fastest-growing non-coding path into tech. Here is the exact sequence of skills, tools and projects that takes you from zero to hired.",
    body: [
      "Becoming a data analyst is not about collecting certificates — it is about building a small set of skills deeply and proving them with real projects. The good news is that the path is well understood and you can complete it in eight to twelve months of consistent effort.",
      "Start with the fundamentals: spreadsheets, basic statistics and data literacy. Then learn SQL, which is the single most-tested skill in analyst interviews. From there, pick one visualisation tool — Power BI is the strongest choice for the Irish and Gulf job markets — and learn it properly.",
      "The mistake most learners make is jumping between tutorials without ever building anything. Instead, take one real dataset and build three or four dashboards that answer real business questions. That portfolio, plus a clean CV and the PL-300 certification, is what gets you interviews.",
      "Finally, practise explaining your analysis out loud in plain language. Employers hire analysts who can turn numbers into decisions — not people who can only produce charts.",
    ] },
  { title: "Power BI vs Excel: Which Should You Learn First?", category: "Technology", author: "Abdikarim Mataan", date: "2026-05-12", readTime: 6,
    excerpt: "Both are essential, but the order matters. Here is how to decide where to start based on your goals and current level.",
    body: [
      "Excel and Power BI are not competitors — they are partners. Excel is where you learn to think about data: formulas, pivot tables, cleaning and basic modelling. Power BI is where you scale that thinking into interactive dashboards that update automatically.",
      "If you are a complete beginner, start with Excel. The mental models you build there — rows, columns, relationships, aggregation — transfer directly to Power BI and make it far easier to learn.",
      "If you already know Excel well, move to Power BI immediately. The combination of Power Query for cleaning, a proper data model and DAX measures is what separates a beginner from a job-ready analyst.",
    ] },
  { title: "What Is Prompt Engineering and Why It Matters", category: "AI", author: "Abdikarim Mataan", date: "2026-05-04", readTime: 7,
    excerpt: "AI tools are only as good as the instructions you give them. Prompt engineering is the practical skill of getting reliable, useful output.",
    body: [
      "Prompt engineering sounds technical, but at its core it is simply clear communication with an AI model. The clearer your context, constraints and examples, the better the result.",
      "The biggest improvements come from four habits: giving the model a role, providing concrete examples, specifying the exact format you want, and asking it to reason step by step for complex tasks.",
      "For knowledge workers, prompt engineering is quietly becoming one of the highest-leverage skills of the decade — it multiplies your output across research, writing, analysis and automation.",
    ] },
  { title: "10 Fully Funded Scholarships for Somali Students", category: "Scholarships", author: "Mataan Scholarships", date: "2026-04-28", readTime: 11,
    excerpt: "From Chevening to Türkiye Bursları, these programmes cover tuition, living costs and flights. Here is how to find the right fit and apply with confidence.",
    body: [
      "Funded study abroad is more accessible than most students realise. Programmes like Chevening, Erasmus Mundus, DAAD, Türkiye Bursları and MEXT cover tuition, living costs and travel — and Somali citizens are eligible for almost all of them.",
      "The key is matching the scholarship to your level, field and timeline. Some require work experience (Chevening), others are open straight after your bachelor's (Erasmus Mundus, Türkiye Bursları).",
      "Start early. Strong applications take months: securing references, drafting essays, sitting language tests and obtaining university offers all take time. Build a simple tracker and work backwards from each deadline.",
      "Above all, your essays must show a clear story — who you are, what you want to study, and how you will use it to serve your community. That narrative is what wins selection panels.",
    ] },
  { title: "Forex Trading for Beginners: Start With Risk, Not Profit", category: "Finance", author: "Abdikarim Mataan", date: "2026-04-22", readTime: 8,
    excerpt: "Most new traders blow their accounts because they chase profit before mastering risk. Reverse the order and you change your odds entirely.",
    body: [
      "The uncomfortable truth about trading is that most beginners lose money — not because they pick the wrong direction, but because they risk too much and have no plan.",
      "Before you think about strategy, define your risk: never more than 1–2% of your account per trade, a clear stop loss on every position, and a journal that records every decision.",
      "Discipline beats prediction. A mediocre strategy with strict risk management will outlast a brilliant strategy applied emotionally. Build the habits first; the edge comes later.",
    ] },
  { title: "How to Write a Winning Scholarship Motivation Letter", category: "Scholarships", author: "Mataan Scholarships", date: "2026-04-15", readTime: 7,
    excerpt: "Your motivation letter is where most applications are won or lost. Here is the structure that selection committees actually respond to.",
    body: [
      "A motivation letter is not a list of achievements — it is a story. Committees read hundreds of them, and the ones that stand out have a clear narrative thread connecting your past, present and future.",
      "Open with a specific moment or problem that shaped your goals. Then connect it to the exact programme you are applying to, showing you have done your research.",
      "Close with impact: what you will do after the scholarship, and how it serves your community or country. Vague ambition loses; concrete contribution wins.",
    ] },
  { title: "Learning to Code in Somali: Why Language Matters", category: "Technology", author: "Eng. Mohamud Ali", date: "2026-04-08", readTime: 6,
    excerpt: "Technical concepts are hard enough without a language barrier on top. Learning core ideas in your mother tongue accelerates everything.",
    body: [
      "When you learn a difficult concept in a language you only partly understand, you are solving two problems at once: the concept and the translation. That doubles the cognitive load.",
      "Learning the core ideas in Somali — while keeping the English technical terms — lets you grasp the logic first, then attach the vocabulary. Comprehension comes faster and sticks longer.",
      "This is the entire philosophy behind Yaclam: world-class material, delivered in the language learners understand best, without dumbing anything down.",
    ] },
  { title: "The 2026 Guide to Studying in Türkiye", category: "Study Abroad", author: "Mataan Scholarships", date: "2026-04-01", readTime: 9,
    excerpt: "Türkiye Bursları is one of the most generous and Somali-friendly scholarships in the world. Here is everything you need to apply.",
    body: [
      "Türkiye Bursları is a fully funded, government-backed scholarship that covers tuition, accommodation, a monthly stipend, health insurance and return flights — at every study level.",
      "What makes it especially friendly to first-time applicants is that university placement is handled for you: you apply once, and the programme matches you to suitable universities.",
      "Applications typically open early in the year. Prepare your transcripts, passport, a strong statement of purpose and references well ahead of the deadline.",
    ] },
  { title: "SQL in 30 Days: A Realistic Study Plan", category: "Technology", author: "Abdikarim Mataan", date: "2026-03-25", readTime: 7,
    excerpt: "SQL is the most valuable skill you can learn in a month. Here is a day-by-day plan that gets you query-confident.",
    body: [
      "SQL rewards consistency more than talent. Thirty focused days — even 45 minutes a day — is enough to become genuinely useful with real data.",
      "Week one: SELECT, WHERE, ORDER BY and basic filtering. Week two: aggregation, GROUP BY and HAVING. Week three: JOINs across multiple tables. Week four: subqueries, window functions and a real project.",
      "Practise on real datasets, not toy examples. The moment you can answer a business question with a single query, the skill becomes permanent.",
    ] },
  { title: "Building Your First Data Portfolio Project", category: "Careers", author: "Abdikarim Mataan", date: "2026-03-18", readTime: 8,
    excerpt: "A portfolio beats a certificate every time. Here is how to choose a project, scope it and present it so employers take notice.",
    body: [
      "Employers do not hire certificates — they hire evidence. A single, well-executed portfolio project tells them more than a wall of course completions.",
      "Choose a dataset you find genuinely interesting, then frame it around a real question: what is happening, why, and what should be done about it. That framing turns a chart collection into analysis.",
      "Document your process clearly — the cleaning, the model, the decisions — and present the final dashboard as if you were briefing a manager. Clarity is the skill being assessed.",
    ] },
  { title: "Halal Investing: A Practical Beginner's Guide", category: "Finance", author: "Hodan Abdi", date: "2026-03-11", readTime: 7,
    excerpt: "You can grow your wealth while staying within Islamic principles. Here are the core concepts and where to start.",
    body: [
      "Halal investing avoids interest (riba), excessive uncertainty (gharar) and prohibited industries, while still allowing you to build long-term wealth through real ownership.",
      "Common halal-friendly options include Shariah-compliant equity funds, ethical ETFs that screen out prohibited sectors, and direct ownership in productive assets and businesses.",
      "Start small, automate regular contributions, and prioritise understanding what you own. The goal is steady, principled growth — not speculation.",
    ] },
  { title: "Cybersecurity Careers: Where to Begin", category: "Careers", author: "Dr. Ahmed Yusuf", date: "2026-03-04", readTime: 8,
    excerpt: "There are more cybersecurity jobs than qualified people. Here is how a beginner breaks into the field.",
    body: [
      "Cybersecurity has a genuine talent shortage, which means motivated newcomers have real opportunities — if they build the right foundations.",
      "Start with networking and operating systems, especially Linux. Then learn core security concepts, get comfortable with common tools, and practise in safe lab environments and capture-the-flag challenges.",
      "The CompTIA Security+ certification is a respected entry point. Pair it with a portfolio of labs and you have a credible application for a junior security role.",
    ] },
  { title: "How AI Is Changing the Job Market (And What to Do)", category: "AI", author: "Abdikarim Mataan", date: "2026-02-25", readTime: 9,
    excerpt: "AI will not replace you, but someone using AI well might. Here is how to stay ahead instead of being left behind.",
    body: [
      "The fear that AI will eliminate all jobs is overblown, but the disruption is real. Routine, repetitive tasks are being automated quickly across every industry.",
      "The winners are not those who avoid AI, but those who learn to direct it — using it to do more, faster, while focusing their own time on judgement, strategy and relationships.",
      "Practically, this means learning to use AI tools in your field today, and doubling down on skills that AI complements rather than replaces: critical thinking, communication and domain expertise.",
    ] },
  { title: "From Mogadishu to Dublin: A Data Analyst's Journey", category: "Careers", author: "Hodan Abdi", date: "2026-02-18", readTime: 6,
    excerpt: "A real story of moving from no technical background to a data analyst role abroad — and the lessons along the way.",
    body: [
      "Career change is rarely a straight line. The path from a non-technical background to an analyst role is built from small, consistent steps repeated over months.",
      "The turning point is almost always the same: stop consuming tutorials passively and start building. Real projects create confidence, and confidence creates momentum.",
      "Community matters too. Learning alongside others who share your language and goals turns a lonely grind into a sustainable habit.",
    ] },
  { title: "Excel VBA: Automate Your Boring Tasks", category: "Technology", author: "Faadumo Hassan", date: "2026-02-11", readTime: 7,
    excerpt: "If you do the same thing in Excel every week, VBA can do it for you in seconds. Here is where to start.",
    body: [
      "VBA (Visual Basic for Applications) lets you record and write small programs that automate repetitive Excel tasks — formatting reports, cleaning data, generating summaries.",
      "The fastest way to start is the macro recorder: perform a task once, record it, then read the generated code to understand how it works.",
      "From there, learn loops, conditions and variables. Even a basic grasp of VBA can save hours every week and makes your spreadsheets dramatically more powerful.",
    ] },
  { title: "DAAD Scholarship: A Step-by-Step Application Guide", category: "Scholarships", author: "Mataan Scholarships", date: "2026-02-04", readTime: 10,
    excerpt: "Germany's DAAD funds thousands of international students each year. Here is how to navigate the application successfully.",
    body: [
      "DAAD offers some of the most respected and well-funded scholarships for postgraduate study in Germany, with dedicated tracks for applicants from developing countries.",
      "Begin by identifying the right programme in the DAAD database — the eligibility, deadlines and required documents vary significantly between them.",
      "Prepare a strong Europass CV, a focused motivation letter, recommendation letters and your language certificate. For development-related courses, relevant work experience is often required.",
    ] },
  { title: "The Beginner's Guide to Digital Marketing", category: "Careers", author: "Hodan Abdi", date: "2026-01-28", readTime: 8,
    excerpt: "Digital marketing is one of the most accessible high-income skills. Here are the core areas and how they fit together.",
    body: [
      "Digital marketing is not one skill but several: SEO, content, social media, paid advertising and analytics. Understanding how they connect is what makes a marketer effective.",
      "Beginners should pick one channel and go deep before spreading wide. Mastering SEO or paid ads first gives you a measurable result you can build a career on.",
      "Everything in marketing is measurable, which means everything is improvable. Learn to read the data and you will always have a job.",
    ] },
  { title: "Why You Should Learn TypeScript in 2026", category: "Technology", author: "Eng. Mohamud Ali", date: "2026-01-21", readTime: 6,
    excerpt: "TypeScript has become the default for serious web development. Here is why it is worth the small extra effort.",
    body: [
      "TypeScript adds types to JavaScript, which means many bugs are caught while you write code rather than after it ships. On real projects, that saves enormous amounts of time.",
      "It has become the industry standard for professional front-end and full-stack work, especially with React and Next.js. Most job listings now expect it.",
      "The learning curve is gentle if you already know JavaScript — and the productivity gains, especially on larger codebases, are well worth it.",
    ] },
  { title: "IELTS Preparation: Score Higher in Less Time", category: "Study Abroad", author: "Mataan Scholarships", date: "2026-01-14", readTime: 9,
    excerpt: "Most scholarships and universities require IELTS. Here is how to prepare efficiently and avoid the common mistakes.",
    body: [
      "IELTS tests four skills — listening, reading, writing and speaking — and most candidates underperform not from lack of English, but from lack of familiarity with the test format.",
      "Focus your preparation on the format itself: timed practice tests, understanding the band descriptors, and targeted work on your weakest section.",
      "Writing and speaking are where structure matters most. Learn the expected templates, practise under time pressure, and get feedback on real responses.",
    ] },
  { title: "How to Build a Freelance Career From Anywhere", category: "Careers", author: "Abdikarim Mataan", date: "2026-01-07", readTime: 8,
    excerpt: "Freelancing offers freedom and income without relocating. Here is how to build a sustainable client base from scratch.",
    body: [
      "Freelancing rewards specialists. Choose one clear service — data dashboards, web development, design, writing — and become known for it rather than offering everything.",
      "Your first clients are the hardest. Build a small portfolio of real or sample work, set a fair rate, and deliver beyond expectations to earn reviews and referrals.",
      "Treat freelancing as a business: track your time, manage your finances, and reinvest in skills. Consistency over months is what turns occasional gigs into a stable income.",
    ] },
];

export const blogPosts: BlogPost[] = raw.map((b, i) => ({
  id: i + 1,
  slug: slugify(b.title),
  title: b.title,
  category: b.category,
  author: b.author,
  date: b.date,
  readTime: b.readTime,
  excerpt: b.excerpt,
  body: b.body,
  color: colorFor(b.category),
}));

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
export const blogCategories = Array.from(new Set(blogPosts.map((p) => p.category)));
