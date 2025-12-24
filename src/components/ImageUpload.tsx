import { useState, useRef, useCallback } from "react";
import { Upload, Camera, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  currentImage: string | null;
  onClear: () => void;
  isLoading?: boolean;
}

export function ImageUpload({ onImageUpload, currentImage, onClear, isLoading }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (currentImage) {
    return (
      <div className="relative w-full max-w-2xl mx-auto animate-scale-in">
        <div className="relative rounded-3xl overflow-hidden shadow-elevated">
          <img 
            src={currentImage} 
            alt="Uploaded room" 
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
          <Button
            variant="soft"
            size="icon"
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={onClear}
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("upload-zone w-full max-w-2xl mx-auto", isDragging && "dragging")}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      <div className="flex flex-col items-center justify-center py-12 gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center animate-float">
            <ImageIcon className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center shadow-soft">
            <Upload className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Drop your room photo here
          </h3>
          <p className="text-muted-foreground font-body">
            or click to browse your files
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="hero" size="lg" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
            <Upload className="w-5 h-5" />
            Upload Photo
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Supports JPG, PNG, WebP up to 10MB
        </p>
      </div>
    </div>
  );
}
