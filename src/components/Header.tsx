import { Home, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="w-full py-6 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-soft">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-semibold text-foreground">
            RoomRevive
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-body text-foreground/80">
            AI-Powered Design
          </span>
        </div>
      </div>
    </header>
  );
}
