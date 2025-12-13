import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard, Book } from "@/components/books/BookCard";

import {
  Search,
  Grid3X3,
  List,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "All Categories",
  "Literature",
  "Science",
  "Mathematics",
  "History",
  "Drama",
  "Art & Music",
  "Languages",
  "Technology",
];

const gradeLevels = [
  "All Grades",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

export default function BrowsePage() {
  const location = useLocation();
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const CATEGORY_MAP: Record<string, string> = {
  literature: "Literature",
  science: "Science",
  mathematics: "Mathematics",
  history: "History",
  drama: "Drama",
  "art-music": "Art & Music",
  languages: "Languages",
  technology: "Technology",
};

  useEffect(() => {
  const params = new URLSearchParams(location.search);

  const search = params.get("search");
  const categoryParam = params.get("category");

  if (search) {
    setSearchQuery(search);
  }

  if (categoryParam && CATEGORY_MAP[categoryParam]) {
    setSelectedCategory(CATEGORY_MAP[categoryParam]);
  } else {
    setSelectedCategory("All Categories");
  }
}, [location.search]);



  const fetchBooks = async () => {
    setIsLoading(true);
    try {
     
      let query = supabase
        .from("books")
        .select(
          `
            id,
            title,
            author,
            cover_url,
            available,
            grade_level,
            rating:reviews(rating), 
            reviewCount:reviews(count),
            categories(name)
          `
        )
        // 4. Sort by newest by default
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      const booksData = data.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover_url || "/placeholder-cover.jpg", 
        category: (book.categories as { name: string } | null)?.name || "N/A",
        rating: 4.5, 
        reviewCount: 0, 
        available: book.available,
        gradeLevel: book.grade_level,
      }));

      setAllBooks(booksData as unknown as Book[]);
    } catch (error) {
      console.error("Error fetching books:", error);
      console.error("Failed to load books from the server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = allBooks.filter((book) => {
    const searchMatch = book.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const categoryMatch =
      selectedCategory === "All Categories" ||
      book.category === selectedCategory;

    return searchMatch && categoryMatch;
  });

  
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return 0; 
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Browse Library
          </h1>
          <p className="text-muted-foreground">
            Explore our collection of {allBooks.length.toLocaleString()}+ books
          </p>
        </div>

        
        <div className="bg-card rounded-2xl p-4 md:p-6 shadow-md border border-border/50 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px] h-12">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-[140px] h-12">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevels.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== "All Categories" || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory !== "All Categories" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All Categories")}
                    className="ml-1 hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {sortedBooks.length}
            </span>{" "}
            results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Books Grid */}
        {sortedBooks.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
                : "flex flex-col gap-4"
            }
          >
            {sortedBooks.map((book, index) => (
              <div
                key={book.id}
                className="opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground mb-2">
              No books found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {sortedBooks.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <span className="px-2 text-muted-foreground">...</span>
              <Button variant="outline" size="sm">
                12
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
