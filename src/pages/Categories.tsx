import { CategoryCard } from "@/components/books/CategoryCard";
import {
  BookOpen,
  Microscope,
  Calculator,
  Globe,
  Palette,
  Music,
  Code,
  Beaker,
  Languages,
  Heart,
  Brain,
  TreePine,
  Scale,
  Landmark,
  Theater,
  Dumbbell,
} from "lucide-react";

const allCategories = [
  { name: "Literature", icon: BookOpen, bookCount: 412, href: "/browse?category=literature", color: "#10b981" },
  { name: "Science", icon: Microscope, bookCount: 324, href: "/browse?category=science", color: "#3b82f6" },
  { name: "Mathematics", icon: Calculator, bookCount: 189, href: "/browse?category=mathematics", color: "#8b5cf6" },
  { name: "History", icon: Globe, bookCount: 245, href: "/browse?category=history", color: "#f59e0b" },
  { name: "Art & Music", icon: Palette, bookCount: 98, href: "/browse?category=art-music", color: "#ec4899" },
  { name: "Music", icon: Music, bookCount: 58, href: "/browse?category=music", color: "#f43f5e" },
  { name: "Technology", icon: Code, bookCount: 134, href: "/browse?category=technology", color: "#6366f1" },
  { name: "Chemistry", icon: Beaker, bookCount: 98, href: "/browse?category=chemistry", color: "#f97316" },
  { name: "Languages", icon: Languages, bookCount: 178, href: "/browse?category=languages", color: "#14b8a6" },
  { name: "Psychology", icon: Brain, bookCount: 87, href: "/browse?category=psychology", color: "#a855f7" },
  { name: "Health & PE", icon: Dumbbell, bookCount: 65, href: "/browse?category=health", color: "#22c55e" },
  { name: "Geography", icon: TreePine, bookCount: 92, href: "/browse?category=geography", color: "#059669" },
  { name: "Law & Ethics", icon: Scale, bookCount: 43, href: "/browse?category=law", color: "#64748b" },
  { name: "Economics", icon: Landmark, bookCount: 78, href: "/browse?category=economics", color: "#0ea5e9" },
  { name: "Drama & Theater", icon: Theater, bookCount: 56, href: "/browse?category=drama", color: "#dc2626" },
  { name: "Philosophy", icon: Heart, bookCount: 34, href: "/browse?category=philosophy", color: "#7c3aed" },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Browse by Category
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our extensive collection organized by subject. Find the
            perfect book for your studies or discover something new.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {allCategories.map((category, index) => (
            <div
              key={category.name}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-6 bg-muted/50 rounded-2xl">
            <div>
              <p className="text-3xl font-display font-bold text-foreground">16</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <p className="text-3xl font-display font-bold text-foreground">12,500+</p>
              <p className="text-sm text-muted-foreground">Total Books</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <p className="text-3xl font-display font-bold text-foreground">50+</p>
              <p className="text-sm text-muted-foreground">Authors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
