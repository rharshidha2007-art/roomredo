import { ArrowRight, Sparkles, Lightbulb, Palette, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuggestionCardProps {
  title: string;
  description: string;
  icon: "sparkles" | "lightbulb" | "palette" | "layout";
  delay?: number;
}

const iconMap = {
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  palette: Palette,
  layout: Layout,
};

export function SuggestionCard({ title, description, icon, delay = 0 }: SuggestionCardProps) {
  const Icon = iconMap[icon];

  return (
    <div 
      className="suggestion-card p-6 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-display text-xl font-semibold text-foreground">
            {title}
          </h4>
          <p className="text-muted-foreground font-body leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
