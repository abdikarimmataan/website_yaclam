import {
  Award, BarChart3, Brain, Code2, DollarSign, PenTool, Megaphone, Lock, Cloud,
  Briefcase, GraduationCap, BookOpen, Cpu, GitBranch, Settings, Layout,
  Database, Smartphone, Image, ClipboardList, TrendingUp, Rocket, LineChart,
  Globe, Target, Mail, Phone, MapPin,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Award, BarChart3, Brain, Code2, DollarSign, PenTool, Megaphone, Lock, Cloud,
  Briefcase, GraduationCap, BookOpen, Cpu, GitBranch, Settings, Layout,
  Database, Smartphone, Image, ClipboardList, TrendingUp, Rocket, LineChart,
  Globe, Target, Mail, Phone, MapPin,
};

export function Icon({ name, ...props }: { name: string } & React.ComponentProps<LucideIcon>) {
  const Cmp = map[name] ?? BookOpen;
  return <Cmp {...props} />;
}
