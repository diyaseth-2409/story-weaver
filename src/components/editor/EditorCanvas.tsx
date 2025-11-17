import { useEffect, useState } from "react";

interface EditorCanvasProps {
  slide: {
    id: string;
    text: string;
    imageUrl: string;
    duration: number;
  };
  isPlaying: boolean;
}

const EditorCanvas = ({ slide, isPlaying }: EditorCanvasProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (slide.duration * 10));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, slide.duration]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-editor-border">
        {/* Background Image */}
        <img
          src={slide.imageUrl}
          alt="Slide background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Text Content */}
        <div className="absolute inset-0 flex items-end p-12">
          <div className="max-w-3xl">
            <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider mb-4 rounded">
              Breaking News
            </div>
            <h2 className="text-white text-4xl font-bold leading-tight drop-shadow-lg">
              {slide.text}
            </h2>
          </div>
        </div>

        {/* Times of India Logo */}
        <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded shadow-lg">
          <span className="text-primary font-bold text-lg">THE TIMES OF INDIA</span>
        </div>

        {/* Progress Bar (when playing) */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;
