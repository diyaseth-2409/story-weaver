import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Calendar, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data - will be replaced with real API call
const mockArticles = [
  {
    id: "1",
    title: "Breaking: Tech Giant Announces Revolutionary AI Platform",
    author: "Sarah Johnson",
    category: "Technology",
    published_at: "2025-11-17T10:30:00Z",
    thumbnail_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
    excerpt: "Major technology company unveils groundbreaking artificial intelligence platform..."
  },
  {
    id: "2",
    title: "Markets Surge Amid Economic Recovery Signs",
    author: "Michael Chen",
    category: "Business",
    published_at: "2025-11-17T09:15:00Z",
    thumbnail_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    excerpt: "Global markets show strong performance as economic indicators improve..."
  },
  {
    id: "3",
    title: "Climate Summit Reaches Historic Agreement",
    author: "Emma Wilson",
    category: "Environment",
    published_at: "2025-11-17T08:00:00Z",
    thumbnail_url: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=400",
    excerpt: "World leaders commit to ambitious carbon reduction targets at international summit..."
  },
  {
    id: "4",
    title: "Sports: Championship Finals Draw Record Viewership",
    author: "David Martinez",
    category: "Sports",
    published_at: "2025-11-16T22:00:00Z",
    thumbnail_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
    excerpt: "Historic match attracts millions of viewers worldwide in thrilling finale..."
  },
];

const ArticleSelection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredArticles = mockArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleArticleSelect = (articleId: string) => {
    navigate(`/editor?article=${articleId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Times of India</h1>
                <p className="text-sm text-muted-foreground">Video Editor</p>
              </div>
            </div>
            <Button variant="outline">Recent Projects</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles by title, category, or author..."
              className="pl-12 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group"
              onClick={() => handleArticleSelect(article.id)}
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={article.thumbnail_url}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                  {article.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search query</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArticleSelection;
