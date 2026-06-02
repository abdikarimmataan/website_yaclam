import {
  BarChart3, Brain, Code2, DollarSign, PenTool, Megaphone, Lock, Cloud,
  Briefcase, GraduationCap, BookOpen, Cpu, GitBranch, Settings, Layout,
  Database, Smartphone, Image, ClipboardList, TrendingUp, Rocket, LineChart,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  BarChart3, Brain, Code2, DollarSign, PenTool, Megaphone, Lock, Cloud,
  Briefcase, GraduationCap, BookOpen, Cpu, GitBranch, Settings, Layout,
  Database, Smartphone, Image, ClipboardList, TrendingUp, Rocket, LineChart,
};

export function Icon({ name, ...props }: { name: string } & React.ComponentProps<LucideIcon>) {
  const Cmp = map[name] ?? BookOpen;
  return <Cmp {...props} />;
}
