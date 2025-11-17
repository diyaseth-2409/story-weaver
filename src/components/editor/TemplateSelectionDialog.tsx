import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface TemplateSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: () => void;
}

const templates = [
  {
    id: "1",
    name: "News Breaking",
    description: "Bold breaking news style with red accents",
    thumbnail: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400",
    category: "News",
  },
  {
    id: "2",
    name: "Classic Report",
    description: "Traditional news reporting format",
    thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400",
    category: "News",
  },
  {
    id: "3",
    name: "Modern Minimal",
    description: "Clean and minimal design",
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400",
    category: "Minimal",
  },
  {
    id: "4",
    name: "Dynamic Sports",
    description: "High-energy sports template",
    thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
    category: "Sports",
  },
];

const TemplateSelectionDialog = ({ open, onOpenChange, onSelect }: TemplateSelectionDialogProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      onSelect();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Choose a Template</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a template to start generating your video
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4 overflow-y-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedTemplate === template.id
                  ? "border-primary shadow-lg scale-[1.02]"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-muted">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 bg-card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating}>
            Back
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!selectedTemplate || isGenerating}
            className="bg-primary text-primary-foreground hover:bg-primary-glow min-w-[150px]"
          >
            {isGenerating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              "Generate Video"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionDialog;
