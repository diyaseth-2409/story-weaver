import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  id: string;
  text: string;
  imageUrl: string;
  duration: number;
}

interface SlideTimelineProps {
  slides: Slide[];
  selectedSlide: number;
  onSlideSelect: (index: number) => void;
}

const SlideTimeline = ({ slides, selectedSlide, onSlideSelect }: SlideTimelineProps) => {
  return (
    <div className="bg-editor-panel border-t border-editor-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-editor-text font-semibold text-sm">Slides ({slides.length})</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-editor-bg text-editor-text border-editor-border hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Slide
          </Button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            onClick={() => onSlideSelect(index)}
            className={cn(
              "relative flex-shrink-0 w-48 cursor-pointer group transition-all",
              selectedSlide === index && "ring-2 ring-primary rounded-lg"
            )}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-editor-bg border border-editor-border">
              <img
                src={slide.imageUrl}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Slide Number */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>

              {/* Duration */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {slide.duration}s
              </div>

              {/* Delete Button (on hover) */}
              <button className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Text Preview */}
            <p className="mt-2 text-xs text-editor-text line-clamp-2">
              {slide.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideTimeline;
