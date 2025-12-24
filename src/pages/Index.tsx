import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ImageUpload } from "@/components/ImageUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Suggestion = {
  title: string;
  description: string;
  icon: "sparkles" | "lightbulb" | "palette" | "layout";
};

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { toast } = useToast();

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setSuggestions([]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedImage(null);
    setSuggestions([]);
  }, []);

  const analyzeRoom = useCallback(async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    setSuggestions([]);

    // Simulate AI analysis with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock suggestions - in production, this would come from an AI API
    const mockSuggestions: Suggestion[] = [
      {
        title: "Create a Conversation Zone",
        description: "Try angling your sofa 45 degrees toward the window and adding a pair of accent chairs facing it. This creates an inviting space for conversation while taking advantage of natural light.",
        icon: "layout",
      },
      {
        title: "Add Visual Balance",
        description: "Consider placing a tall floor lamp or potted plant in the corner opposite your main furniture grouping. This will balance the visual weight of the room and add vertical interest.",
        icon: "lightbulb",
      },
      {
        title: "Layer Your Textures",
        description: "Introduce a woven jute rug under your seating area and layer throw pillows in warm terracotta and sage tones. This adds depth and warmth to your space.",
        icon: "palette",
      },
      {
        title: "Optimize Traffic Flow",
        description: "Move the coffee table slightly closer to the sofa (about 18 inches away) and ensure there's at least 36 inches for walkways. This creates better functionality while maintaining openness.",
        icon: "sparkles",
      },
    ];

    setSuggestions(mockSuggestions);
    setIsAnalyzing(false);

    toast({
      title: "Analysis Complete!",
      description: "We've generated personalized suggestions for your space.",
    });
  }, [uploadedImage, toast]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="pb-20">
        <Hero />
        
        <section className="px-6 py-8">
          <ImageUpload 
            onImageUpload={handleImageUpload}
            currentImage={uploadedImage}
            onClear={handleClear}
            isLoading={isAnalyzing}
          />

          {uploadedImage && suggestions.length === 0 && !isAnalyzing && (
            <div 
              className="flex justify-center mt-8 opacity-0 animate-fade-in"
              style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
            >
              <Button 
                variant="hero" 
                size="xl"
                onClick={analyzeRoom}
                className="gap-3"
              >
                <Sparkles className="w-5 h-5" />
                Analyze My Room
              </Button>
            </div>
          )}
        </section>

        <section className="px-6">
          <AnalysisResults 
            isLoading={isAnalyzing}
            suggestions={suggestions}
          />
        </section>
      </main>

      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground font-body">
            © 2024 RoomRevive. AI-powered interior design suggestions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
