import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Download, Settings, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EditorCanvas from "@/components/editor/EditorCanvas";
import SlideTimeline from "@/components/editor/SlideTimeline";
import EditorToolbar from "@/components/editor/EditorToolbar";
import VideoMetadataDialog from "@/components/editor/VideoMetadataDialog";
import TemplateSelectionDialog from "@/components/editor/TemplateSelectionDialog";

const VideoEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("article");

  const [showMetadataDialog, setShowMetadataDialog] = useState(true);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock slides data
  const [slides] = useState([
    {
      id: "1",
      text: "Breaking News: Revolutionary AI Platform Announced",
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
      duration: 5,
    },
    {
      id: "2",
      text: "Tech Giant Unveils Groundbreaking Features",
      imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800",
      duration: 5,
    },
    {
      id: "3",
      text: "Industry Experts React to Innovation",
      imageUrl: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=800",
      duration: 4,
    },
  ]);

  const handleMetadataComplete = () => {
    setShowMetadataDialog(false);
    setShowTemplateDialog(true);
  };

  const handleTemplateSelected = () => {
    setShowTemplateDialog(false);
  };

  return (
    <div className="h-screen bg-editor-bg flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="bg-editor-panel border-b border-editor-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-editor-text hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-editor-border" />
          <div>
            <h1 className="text-editor-text font-semibold">Revolutionary AI Platform</h1>
            <p className="text-xs text-muted-foreground">16:9 • 3 Slides • 14s</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-editor-panel text-editor-text border-editor-border hover:bg-primary hover:text-primary-foreground"
          >
            <Play className="w-4 h-4 mr-2" />
            {isPlaying ? "Pause" : "Preview"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-editor-panel text-editor-text border-editor-border"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-glow">
            <Download className="w-4 h-4 mr-2" />
            Export Video
          </Button>
        </div>
      </header>

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Canvas Preview */}
        <div className="flex-1 flex flex-col bg-canvas-bg p-6">
          <EditorCanvas
            slide={slides[selectedSlide]}
            isPlaying={isPlaying}
          />
        </div>

        {/* Right: Editing Toolbar */}
        <EditorToolbar />
      </div>

      {/* Bottom: Timeline */}
      <SlideTimeline
        slides={slides}
        selectedSlide={selectedSlide}
        onSlideSelect={setSelectedSlide}
      />

      {/* Dialogs */}
      <VideoMetadataDialog
        open={showMetadataDialog}
        onOpenChange={setShowMetadataDialog}
        onComplete={handleMetadataComplete}
      />

      <TemplateSelectionDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        onSelect={handleTemplateSelected}
      />
    </div>
  );
};

export default VideoEditor;
