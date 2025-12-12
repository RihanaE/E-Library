import { Link } from "react-router-dom";
import { Heart, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  gradeLevel?: string;
}

interface BookCardProps {
  book: Book;
  className?: string;
}

export function BookCard({ book, className }: BookCardProps) {
  return (
    <Link
      to={`/book/${book.id}`}
      className={cn("book-card group block", className)}
    >
      {/* Book spine accent */}
      <div className="book-spine" />
      
      {/* Cover Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick actions on hover */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Button size="sm" variant="hero" className="flex-1 text-xs">
            <BookOpen className="h-3 w-3" />
            Preview
          </Button>
          <Button size="sm" variant="ghost" className="bg-background/90 hover:bg-background">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="category-badge">{book.category}</span>
        </div>
        
        {/* Availability indicator */}
        {!book.available && (
          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-medium">
            Borrowed
          </div>
        )}
      </div>
      
      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({book.reviewCount} reviews)
          </span>
        </div>
        
        {book.gradeLevel && (
          <p className="text-xs text-muted-foreground mt-2">
            Grade: {book.gradeLevel}
          </p>
        )}
      </div>
    </Link>
  );
}
