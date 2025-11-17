import { useState } from "react";
import {
  Image,
  Music,
  Type,
  Sparkles,
  Palette,
  Video,
  Mic,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const EditorToolbar = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const tools = [
    { id: "visuals", icon: Image, label: "Visuals" },
    { id: "audio", icon: Music, label: "Audio" },
    { id: "text", icon: Type, label: "Text" },
    { id: "animate", icon: Sparkles, label: "Animate" },
    { id: "logos", icon: Upload, label: "Logos" },
    { id: "themes", icon: Palette, label: "Themes" },
    { id: "video", icon: Video, label: "Video" },
    { id: "voiceover", icon: Mic, label: "VO" },
  ];

  return (
    <div className="w-80 bg-editor-panel border-l border-editor-border flex flex-col">
      {/* Tool Icons */}
      <div className="grid grid-cols-4 gap-1 p-2 border-b border-editor-border">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(activeTab === tool.id ? null : tool.id)}
              className={cn(
                "flex flex-col gap-1 h-auto py-3 text-editor-text hover:text-primary hover:bg-editor-bg",
                activeTab === tool.id && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{tool.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Tool Content */}
      <ScrollArea className="flex-1">
        {activeTab && (
          <div className="p-4">
            {activeTab === "visuals" && <VisualsPanel />}
            {activeTab === "audio" && <AudioPanel />}
            {activeTab === "text" && <TextPanel />}
            {activeTab === "animate" && <AnimatePanel />}
            {activeTab === "logos" && <LogosPanel />}
            {activeTab === "themes" && <ThemesPanel />}
            {activeTab === "video" && <VideoPanel />}
            {activeTab === "voiceover" && <VoiceoverPanel />}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

const VisualsPanel = () => (
  <div className="space-y-4">
    <h3 className="text-editor-text font-semibold mb-3">Visuals</h3>
    <Tabs defaultValue="stock">
      <TabsList className="w-full bg-editor-bg">
        <TabsTrigger value="stock" className="flex-1">Stock</TabsTrigger>
        <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
      </TabsList>
      <TabsContent value="stock" className="mt-4">
        <Input placeholder="Search images..." className="mb-4 bg-editor-bg text-editor-text border-editor-border" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-editor-bg rounded border border-editor-border cursor-pointer hover:border-primary transition-colors">
              <img
                src={`https://images.unsplash.com/photo-148571550${i}-89b55fcc595e?w=200`}
                alt={`Stock ${i}`}
                className="w-full h-full object-cover rounded"
              />
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="upload">
        <Button variant="outline" className="w-full border-dashed border-2 h-32 bg-editor-bg text-editor-text border-editor-border hover:border-primary">
          <Upload className="w-6 h-6 mr-2" />
          Upload Image
        </Button>
      </TabsContent>
    </Tabs>
  </div>
);

const AudioPanel = () => (
  <div className="space-y-4">
    <h3 className="text-editor-text font-semibold mb-3">Audio</h3>
    <div className="space-y-2">
      {["Corporate Background", "News Intro", "Upbeat Energy"].map((track) => (
        <div key={track} className="p-3 bg-editor-bg rounded border border-editor-border hover:border-primary cursor-pointer transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-editor-text font-medium">{track}</p>
              <p className="text-xs text-muted-foreground">30s</p>
            </div>
            <Button size="sm" variant="ghost" className="text-primary">
              Add
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TextPanel = () => (
  <div className="space-y-4">
    <h3 className="text-editor-text font-semibold mb-3">Text Styling</h3>
    <div className="space-y-3">
      <div>
        <Label className="text-editor-text">Font Size</Label>
        <Input type="number" defaultValue={32} className="bg-editor-bg text-editor-text border-editor-border" />
      </div>
      <div>
        <Label className="text-editor-text">Font Family</Label>
        <select className="w-full p-2 bg-editor-bg text-editor-text border border-editor-border rounded">
          <option>Merriweather</option>
          <option>Open Sans</option>
          <option>Roboto</option>
        </select>
      </div>
      <div>
        <Label className="text-editor-text">Color</Label>
        <Input type="color" defaultValue="#FFFFFF" className="bg-editor-bg border-editor-border" />
      </div>
    </div>
  </div>
);

const AnimatePanel = () => (
  <div className="space-y-4">
    <h3 className="text-editor-text font-semibold mb-3">Animation Effects</h3>
    <div className="grid grid-cols-2 gap-2">
      {["Fade", "Slide", "Zoom In", "Pan Left"].map((effect) => (
        <Button key={effect} variant="outline" className="bg-editor-bg text-editor-text border-editor-border hover:border-primary">
          {effect}
        </Button>
      ))}
    </div>
  </div>
);

const LogosPanel = () => (
  <div className="space-y-4">
    <h3 className="text-editor-text font-semibold mb-3">Brand Logos</h3>
    <Button variant="outline" className="w-full border-dashed border-2 h-24 bg-editor-bg text-editor-text border-editor-border">
      <Upload className="w-5 h-5 mr-2" />
      Upload Logo
    </Button>
  </div>
);

const ThemesPanel = () => (
  <div className="space-y-4">
    <h3 className="text-editor-text font-semibold mb-3">Themes</h3>
    <div className="space-y-2">
      {[
        { name: "Times of India", colors: ["#C8102E", "#1A1A1A", "#D4AF37"] },
        { name: "Modern Blue", colors: ["#0066CC", "#333333", "#00AAFF"] },
        { name: "Dark Elegant", colors: ["#8B0000", "#000000", "#FFD700"] },
      ].map((theme) => (
        <div key={theme.name} className="p-3 bg-editor-bg rounded border border-editor-border hover:border-primary cursor-pointer transition-colors">
          <p className="text-sm text-editor-text font-medium mb-2">{theme.name}</p>
          <div className="flex gap-2">
            {theme.colors.map((color) => (
              <div key={color} className="w-8 h-8 rounded border border-editor-border" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const VideoPanel = () => (
  <div className="space-y-4">
    <h3 className="text-editor-text font-semibold mb-3">Video Settings</h3>
    <div className="space-y-3">
      <div>
        <Label className="text-editor-text">Aspect Ratio</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {["16:9", "9:16", "1:1"].map((ratio) => (
            <Button key={ratio} variant="outline" className="bg-editor-bg text-editor-text border-editor-border">
              {ratio}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-editor-text">Duration (seconds)</Label>
        <Input type="number" defaultValue={30} className="bg-editor-bg text-editor-text border-editor-border" />
      </div>
      <div>
        <Label className="text-editor-text">FPS</Label>
        <Input type="number" defaultValue={30} className="bg-editor-bg text-editor-text border-editor-border" />
      </div>
    </div>
  </div>
);

const VoiceoverPanel = () => (
  <div className="space-y-4">
    <h3 className="text-editor-text font-semibold mb-3">Voiceover</h3>
    <Button variant="outline" className="w-full bg-editor-bg text-editor-text border-editor-border">
      <Upload className="w-4 h-4 mr-2" />
      Upload Audio
    </Button>
    <div className="text-center text-editor-text text-sm">or</div>
    <Button className="w-full bg-primary text-primary-foreground">
      <Mic className="w-4 h-4 mr-2" />
      Generate with AI
    </Button>
  </div>
);

export default EditorToolbar;
