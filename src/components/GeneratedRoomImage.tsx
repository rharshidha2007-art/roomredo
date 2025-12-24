import { Sparkles, Download, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GeneratedRoomImageProps {
  imageUrl: string | null;
  isLoading: boolean;
  error?: string | null;
}

export function GeneratedRoomImage({ imageUrl, isLoading, error }: GeneratedRoomImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-card border border-border/50 aspect-video flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse-soft">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="font-display text-lg font-medium text-foreground">
                Creating your redesigned room...
              </p>
              <p className="text-sm text-muted-foreground">
                This may take a moment
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-3xl overflow-hidden bg-muted/50 border border-border/50 p-8 text-center">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'redesigned-room.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-2xl mx-auto opacity-0 animate-scale-in" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-display text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Your Redesigned Room
          </h3>
          <p className="text-muted-foreground mt-1">
            AI-generated visualization of your space
          </p>
        </div>
        
        <div 
          className="relative rounded-3xl overflow-hidden shadow-elevated cursor-pointer group"
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img 
            src={imageUrl} 
            alt="AI redesigned room" 
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="soft" size="icon" className="bg-background/80 backdrop-blur-sm">
              <ZoomIn className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="soft" onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download Image
          </Button>
        </div>
      </div>

      {/* Fullscreen modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsZoomed(false)}
        >
          <img 
            src={imageUrl} 
            alt="AI redesigned room" 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
