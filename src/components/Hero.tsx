import { Sparkles, ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-16 md:py-24 px-6 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 opacity-0 animate-fade-in"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-body font-medium text-foreground">
            Transform your living space
          </span>
        </div>

        <h1 
          className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight text-balance opacity-0 animate-fade-in"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          Reimagine Your Room with{" "}
          <span className="text-primary">AI Design</span>
        </h1>

        <p 
          className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in"
          style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
        >
          Upload a photo of any room and discover creative furniture arrangements 
          and decoration ideas tailored to your space.
        </p>

        <div 
          className="flex justify-center pt-8 opacity-0 animate-fade-in"
          style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm font-body">Start by uploading a photo</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
    </section>
  );
}
