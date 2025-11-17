import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface VideoMetadataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

const VideoMetadataDialog = ({ open, onOpenChange, onComplete }: VideoMetadataDialogProps) => {
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [slideCount, setSlideCount] = useState(5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Video Configuration</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set up your video metadata and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Video Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Video Title</Label>
            <Input
              id="title"
              placeholder="Enter video title..."
              defaultValue="Revolutionary AI Platform Announcement"
              className="bg-background border-border"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the video..."
              rows={3}
              className="bg-background border-border resize-none"
            />
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <Label className="text-foreground">Video Type (Aspect Ratio)</Label>
            <div className="flex gap-3">
              {["16:9", "9:16", "1:1"].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`flex-1 py-8 rounded-lg border-2 transition-all ${
                    aspectRatio === ratio
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground mb-1">{ratio}</p>
                    <p className="text-xs text-muted-foreground">
                      {ratio === "16:9" && "Landscape"}
                      {ratio === "9:16" && "Portrait"}
                      {ratio === "1:1" && "Square"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Slide Count */}
          <div className="space-y-2">
            <Label htmlFor="slides" className="text-foreground">
              Number of Slides (Text to Video)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="slides"
                type="number"
                min={1}
                max={20}
                value={slideCount}
                onChange={(e) => setSlideCount(parseInt(e.target.value) || 1)}
                className="w-24 bg-background border-border"
              />
              <div className="flex gap-2">
                {[3, 5, 10].map((count) => (
                  <Badge
                    key={count}
                    variant={slideCount === count ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSlideCount(count)}
                  >
                    {count}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-foreground">Keywords (comma separated)</Label>
            <Input
              id="keywords"
              placeholder="AI, Technology, Innovation, Breaking News"
              className="bg-background border-border"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onComplete} className="bg-primary text-primary-foreground hover:bg-primary-glow">
            Continue to Templates
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoMetadataDialog;
