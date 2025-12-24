import { SuggestionCard } from "./SuggestionCard";
import { Loader2, Sparkles } from "lucide-react";

interface AnalysisResultsProps {
  isLoading: boolean;
  suggestions: {
    title: string;
    description: string;
    icon: "sparkles" | "lightbulb" | "palette" | "layout";
  }[];
}

export function AnalysisResults({ isLoading, suggestions }: AnalysisResultsProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-5 h-5 text-primary animate-pulse-soft" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Analyzing your space...
            </h3>
            <p className="text-muted-foreground font-body">
              Our AI is studying your room's layout and furniture
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="text-center mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
          Design Suggestions
        </h2>
        <p className="text-muted-foreground font-body text-lg">
          Here's how you could transform your space
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {suggestions.map((suggestion, index) => (
          <SuggestionCard
            key={index}
            title={suggestion.title}
            description={suggestion.description}
            icon={suggestion.icon}
            delay={200 + index * 100}
          />
        ))}
      </div>
    </div>
  );
}
