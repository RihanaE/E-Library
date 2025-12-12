import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookCard, Book } from "@/components/books/BookCard";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Star,
  Heart,
  Download,
  BookOpen,
  Clock,
  Share2,
  ChevronLeft,
  User,
  Calendar,
  BookMarked,
  FileText,
  Tag,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Import book covers
import gatsbyBook from "@/assets/books/gatsby.jpg";
import physicsBook from "@/assets/books/physics.jpg";
import mathBook from "@/assets/books/mathematics.jpg";
import hamletBook from "@/assets/books/hamlet.jpg";
import historyBook from "@/assets/books/history.jpg";
import biologyBook from "@/assets/books/biology.jpg";

// Mock book data
const mockBook = {
  id: "1",
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  cover: gatsbyBook,
  category: "Literature",
  rating: 4.8,
  reviewCount: 342,
  available: true,
  gradeLevel: "11-12",
  description: `The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.

The novel was inspired by a youthful romance Fitzgerald had with socialite Ginevra King, and the riotous parties he attended on Long Island's North Shore in 1922. Following a move to the French Riviera, Fitzgerald completed a rough draft of the novel in 1924.`,
  isbn: "978-0-7432-7356-5",
  publisher: "Scribner",
  publishDate: "1925",
  pages: 180,
  language: "English",
  subjects: ["American Literature", "Classic Fiction", "Jazz Age", "Social Commentary"],
  borrowDuration: 14,
  totalBorrows: 1247,
};

const reviews = [
  {
    id: 1,
    user: "Sarah M.",
    rating: 5,
    date: "2024-01-15",
    comment:
      "An absolute masterpiece! Fitzgerald's prose is beautiful and the themes are timeless. Required reading for all students.",
  },
  {
    id: 2,
    user: "James T.",
    rating: 4,
    date: "2024-01-10",
    comment:
      "Great story with deep symbolism. The writing style takes some getting used to but it's worth it.",
  },
  {
    id: 3,
    user: "Emily R.",
    rating: 5,
    date: "2024-01-05",
    comment:
      "One of the best books I've read for English class. The character development is incredible.",
  },
];

const relatedBooks: Book[] = [
  {
    id: "4",
    title: "Hamlet",
    author: "William Shakespeare",
    cover: hamletBook,
    category: "Drama",
    rating: 4.9,
    reviewCount: 421,
    available: true,
    gradeLevel: "10-12",
  },
  {
    id: "5",
    title: "World History",
    author: "Dr. Emily Chen",
    cover: historyBook,
    category: "History",
    rating: 4.7,
    reviewCount: 178,
    available: true,
    gradeLevel: "9-12",
  },
  {
    id: "2",
    title: "Advanced Physics",
    author: "Dr. Sarah Mitchell",
    cover: physicsBook,
    category: "Science",
    rating: 4.6,
    reviewCount: 189,
    available: true,
    gradeLevel: "10-12",
  },
  {
    id: "6",
    title: "Biology Essentials",
    author: "Dr. Michael Brown",
    cover: biologyBook,
    category: "Science",
    rating: 4.4,
    reviewCount: 203,
    available: true,
    gradeLevel: "9-10",
  },
];

export default function BookDetailPage() {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const ratingDistribution = [
    { stars: 5, percentage: 72 },
    { stars: 4, percentage: 18 },
    { stars: 3, percentage: 7 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container">
        {/* Back Button */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Browse
        </Link>

        {/* Book Header */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-book">
                <img
                  src={mockBook.cover}
                  alt={mockBook.title}
                  className="w-full h-full object-cover"
                />
                <div className="book-spine" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <Button variant="hero" size="lg" className="w-full gap-2">
                  <BookOpen className="h-5 w-5" />
                  Borrow Book
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="lg" className="gap-2">
                    <BookMarked className="h-5 w-5" />
                    Preview
                  </Button>
                  <Button
                    variant={isFavorite ? "secondary" : "outline"}
                    size="lg"
                    className="gap-2"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Book Info */}
          <div className="lg:col-span-2">
            {/* Category Badge */}
            <span className="category-badge mb-4">{mockBook.category}</span>

            {/* Title & Author */}
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              {mockBook.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              by <span className="text-foreground">{mockBook.author}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(mockBook.rating)
                        ? "fill-secondary text-secondary"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{mockBook.rating}</span>
              <span className="text-muted-foreground">
                ({mockBook.reviewCount} reviews)
              </span>
            </div>

            {/* Availability Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                mockBook.available
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  mockBook.available ? "bg-success" : "bg-destructive"
                }`}
              />
              {mockBook.available ? "Available to borrow" : "Currently borrowed"}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                {mockBook.description}
              </p>
            </div>

            {/* Book Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-muted/50 rounded-xl p-4">
                <FileText className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Pages</p>
                <p className="font-semibold">{mockBook.pages}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <Calendar className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="font-semibold">{mockBook.publishDate}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <Clock className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Borrow Period</p>
                <p className="font-semibold">{mockBook.borrowDuration} days</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <BookOpen className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Total Borrows</p>
                <p className="font-semibold">{mockBook.totalBorrows.toLocaleString()}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="w-32 text-muted-foreground">ISBN:</span>
                <span className="font-medium">{mockBook.isbn}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Publisher:</span>
                <span className="font-medium">{mockBook.publisher}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Language:</span>
                <span className="font-medium">{mockBook.language}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Grade Level:</span>
                <span className="font-medium">{mockBook.gradeLevel}</span>
              </div>
              <div className="flex flex-wrap items-start">
                <span className="w-32 text-muted-foreground">Subjects:</span>
                <div className="flex flex-wrap gap-2">
                  {mockBook.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="px-3 py-1 bg-muted rounded-full text-xs font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="reviews" className="mb-16">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="details">More Details</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <div className="text-center mb-6">
                  <p className="text-5xl font-display font-bold text-foreground mb-2">
                    {mockBook.rating}
                  </p>
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(mockBook.rating)
                            ? "fill-secondary text-secondary"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {mockBook.reviewCount} reviews
                  </p>
                </div>

                {/* Rating Bars */}
                <div className="space-y-3">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="text-sm w-8">{item.stars}★</span>
                      <Progress value={item.percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground w-10">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-card rounded-xl p-6 border border-border/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{review.user}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-secondary text-secondary"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground/80">{review.comment}</p>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h3 className="text-lg font-display font-semibold mb-4">
                About This Book
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                {mockBook.description}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Books */}
        <section>
          <SectionHeader
            title="You May Also Like"
            subtitle="Similar books from our collection"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedBooks.map((book, index) => (
              <div
                key={book.id}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
