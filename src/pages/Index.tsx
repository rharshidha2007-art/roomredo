import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ImageUpload } from "@/components/ImageUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Suggestion = {
  title: string;
  description: string;
  icon: "sparkles" | "lightbulb" | "palette" | "layout";
};

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [currentLayout, setCurrentLayout] = useState<string>("");
  const { toast } = useToast();

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setSuggestions([]);
      setGeneratedImage(null);
      setImageError(null);
      setCurrentLayout("");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedImage(null);
    setSuggestions([]);
    setGeneratedImage(null);
    setImageError(null);
    setCurrentLayout("");
  }, []);

  const analyzeRoom = useCallback(async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    setSuggestions([]);
    setGeneratedImage(null);
    setImageError(null);
    setCurrentLayout("");

    try {
      const { data, error } = await supabase.functions.invoke('analyze-room', {
        body: { imageBase64: uploadedImage }
      });

      if (error) {
        console.error("Analysis error:", error);
        throw new Error(error.message || "Failed to analyze room");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setSuggestions(data.suggestions || []);
      setGeneratedImage(data.generatedImage || null);
      setImageError(data.imageError || null);
      setCurrentLayout(data.currentLayout || "");

      toast({
        title: "Analysis Complete!",
        description: data.generatedImage 
          ? "We've generated your redesigned room and personalized suggestions."
          : "We've generated personalized suggestions for your space.",
      });
    } catch (error) {
      console.error("Error analyzing room:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Could not analyze the room. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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

          {uploadedImage && suggestions.length === 0 && !isAnalyzing && !generatedImage && (
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
                Analyze & Redesign My Room
              </Button>
            </div>
          )}
        </section>

        <section className="px-6">
          <AnalysisResults 
            isLoading={isAnalyzing}
            suggestions={suggestions}
            generatedImage={generatedImage}
            imageError={imageError}
            currentLayout={currentLayout}
          />
        </section>

        {/* Re-analyze button after results */}
        {(suggestions.length > 0 || generatedImage) && !isAnalyzing && (
          <section className="px-6 py-8 flex justify-center">
            <Button 
              variant="soft" 
              size="lg"
              onClick={analyzeRoom}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Another Design
            </Button>
          </section>
        )}
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
