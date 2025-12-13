// /mnt/data/BookDetail.tsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookCard, Book } from "@/components/books/BookCard";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Star,
  Heart,
  BookOpen,
  Clock,
  ChevronLeft,
  User,
  Calendar,
  BookMarked,
  FileText,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

// If your Book type from BookCard doesn't include the extra fields,
// we create an extended local shape here for safety.
type BookDetailShape = Book & {
  description?: string | null;
  isbn?: string | null;
  publisher?: string | null;
  publish_year?: number | null;
  pages?: number | null;
  language?: string | null;
  grade_level?: string | null;
  borrow_duration_days?: number | null;
  total_borrows?: number | null;
  subjects?: string[] | null;
  file_url?: string | null;
  file_type?: string | null;
  category_id?: string | null;
};

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetailShape | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingMoreReviews, setLoadingMoreReviews] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;

  useEffect(() => {
    if (!id) return;
    fetchBook(id);
    fetchReviews(id, 1);
  }, [id]);

  // Fetch book and include its recent reviews and category
  const fetchBook = async (bookId: string) => {
    setIsLoading(true);
    try {
      // Select the book, its category, and the most recent approved reviews with profile info
      const { data, error } = await supabase
        .from("books")
        .select(
          `
  *,
  categories:category_id ( id, name ),
  reviews:reviews (
    id, rating, comment, created_at, user_id,
    profiles:profiles ( first_name, last_name )
  )
`
        )
        .eq("id", bookId)
        .single();

      if (error || !data) {
        throw error || new Error("Book not found");
      }

      // Map DB result to frontend-friendly shape
      const mapped: BookDetailShape = {
        id: data.id,
        title: data.title,
        author: data.author,
        cover: data.cover_url || "/placeholder-cover.jpg",
        category: (data.categories && data.categories.name) || "N/A",
        // rating & reviewCount computed from reviews if available
        rating:
          data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0
            ? Math.round(
                (data.reviews.reduce(
                  (s: number, r: any) => s + (r.rating || 0),
                  0
                ) /
                  data.reviews.length) *
                  10
              ) / 10
            : 0,
        reviewCount: data.reviews ? (data.reviews.length as number) : 0,
        available: data.available ?? true,
        gradeLevel: data.grade_level ?? "N/A",
        description: data.description ?? "",
        // other details directly mapped from your DB columns
        pages: data.pages ?? 0,
        publish_year: data.publish_year ?? null,
        borrow_duration_days: data.borrow_duration_days ?? 14,
        total_borrows: data.total_borrows ?? 0,
        isbn: data.isbn ?? null,
        publisher: data.publisher ?? null,
        language: data.language ?? "English",
        subjects: data.subjects ?? [],
        file_url: data.file_url ?? null,
        file_type: data.file_type ?? null,
        category_id: data.category_id ?? null,
      };

      setBook(mapped);

      // If reviews came in the book select, map them for immediate display (limit to REVIEWS_PER_PAGE)
      if (data.reviews && Array.isArray(data.reviews)) {
        const initialReviews = (data.reviews as any[])
          .filter((r) => r) // filter nulls
          .slice(0, REVIEWS_PER_PAGE)
          .map((r) => ({
            id: r.id,
            user_name:
              (r.profiles &&
                (r.profiles.first_name ||
                  `${r.profiles.first_name || ""} ${
                    r.profiles.last_name || ""
                  }`.trim())) ||
              "Anonymous",
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
          }));
        setReviews(initialReviews);
      } else {
        setReviews([]);
      }

      // Fetch related books by same category id (excludes this book)
      if (mapped.category_id) {
        fetchRelatedBooks(mapped.category_id, mapped.id);
      } else {
        setRelatedBooks([]);
      }
    } catch (err: any) {
      console.error("Error fetching book:", err);
      toast.error("Failed to load book details.");
      setBook(null);
      setReviews([]);
      setRelatedBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reviews separately (paginated) - only approved ones visible to public as per your RLS/policies
  const fetchReviews = async (bookId: string, page = 1) => {
    if (!bookId) return;
    if (page === 1) setIsLoading(true);
    else setLoadingMoreReviews(true);

    try {
      const from = (page - 1) * REVIEWS_PER_PAGE;
      const to = from + REVIEWS_PER_PAGE - 1;

      // Query reviews with profile join so we can show the reviewer's name
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
            id,
            rating,
            comment,
            created_at,
            user_id,
            profiles:profiles(first_name,last_name)
          `
        )
        .eq("book_id", bookId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const mapped = (data || []).map((r: any) => ({
        id: r.id,
        user_name:
          (r.profiles &&
            (r.profiles.first_name ||
              `${r.profiles.first_name || ""} ${
                r.profiles.last_name || ""
              }`.trim())) ||
          "Anonymous",
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
      }));

      if (page === 1) {
        setReviews(mapped);
        setReviewsPage(1);
      } else {
        setReviews((prev) => [...prev, ...mapped]);
        setReviewsPage(page);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Failed to load reviews.");
    } finally {
      setIsLoading(false);
      setLoadingMoreReviews(false);
    }
  };

  const loadMoreReviews = () => {
    fetchReviews(id as string, reviewsPage + 1);
  };

  const fetchRelatedBooks = async (
    categoryId: string,
    excludeBookId?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select(
          `
            id,
            title,
            author,
            cover_url,
            available,
            grade_level,
            categories:categories(name)
          `
        )
        .eq("category_id", categoryId)
        .neq("id", excludeBookId)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;

      const mapped = (data || []).map((b: any) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        cover: b.cover_url || "/placeholder-cover.jpg",
        category: (b.categories && b.categories.name) || "N/A",
        rating: 0,
        reviewCount: 0,
        available: b.available,
        gradeLevel: b.grade_level,
      }));

      setRelatedBooks(mapped);
    } catch (err) {
      console.error("Error fetching related books:", err);
    }
  };

  function extractStoragePath(publicUrl: string) {
    const marker = "/book-files/";
    const index = publicUrl.indexOf(marker);

    if (index === -1) {
      throw new Error("Invalid storage URL");
    }

    return publicUrl.substring(index + marker.length);
  }

  // Basic borrow handler (stub) - adapt to your borrow flow
  const handleBorrow = async () => {
    if (!book || !book.file_url) {
      toast.error("This book has no readable file.");
      return;
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("You must be logged in to borrow a book.");
      return;
    }

    try {
      // 1️⃣ Prevent duplicate active borrow
      const { data: existingBorrow } = await supabase
        .from("borrows")
        .select("id, due_at")
        .eq("user_id", user.id)
        .eq("book_id", book.id)
        .eq("status", "active")
        .maybeSingle();

      if (existingBorrow) {
        const dueAt = new Date(existingBorrow.due_at);
        const remainingSeconds = Math.floor(
          (dueAt.getTime() - Date.now()) / 1000
        );

        if (remainingSeconds <= 0) {
          toast.error("Your borrow period has expired.");
          return;
        }

        const storagePath = extractStoragePath(book.file_url!);

        const { data: signed, error: signedError } = await supabase.storage
          .from("book-files")
          .createSignedUrl(storagePath, remainingSeconds);

        if (signedError || !signed?.signedUrl) {
          toast.error("Failed to generate access link.");
          return;
        }

        toast(
          <div className="space-y-1 max-w-sm">
            <p className="font-medium">You already borrowed this book</p>
            <a
              href={signed.signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              Open book
            </a>
            <p className="text-xs text-muted-foreground">
              Access expires on {dueAt.toLocaleDateString()}
            </p>
          </div>,
          { duration: 12000 }
        );

        return;
      }

      // 2️⃣ Calculate due date
      const borrowDays = book.borrow_duration_days ?? 14;
      const dueAt = new Date();
      dueAt.setDate(dueAt.getDate() + borrowDays);

      // 3️⃣ Insert borrow record
      const { data: borrow, error: borrowError } = await supabase
        .from("borrows")
        .insert({
          user_id: user.id,
          book_id: book.id,
          due_at: dueAt.toISOString(),
          status: "active",
        })
        .select()
        .single();

      if (borrowError) throw borrowError;

      // 4️⃣ Generate signed URL from PRIVATE bucket
      // file_url is the STORAGE PATH, not a URL
      const expiresInSeconds = Math.max(
        60,
        Math.floor((dueAt.getTime() - Date.now()) / 1000)
      );

      const storagePath = extractStoragePath(book.file_url);

      const { data: signed, error: signedError } = await supabase.storage
        .from("book-files")
        .createSignedUrl(storagePath, expiresInSeconds);

      if (signedError || !signed?.signedUrl) {
        throw signedError || new Error("Failed to generate access link");
      }

      // 6️⃣ Toast with expiring access link
      toast(
        <div className="space-y-1 max-w-sm">
          <p className="font-medium">Book borrowed successfully</p>
          <a
            href={signed.signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            Open book
          </a>
          <p className="text-xs text-muted-foreground">
            Access expires on {dueAt.toLocaleDateString()}
          </p>
        </div>,
        { duration: 12000 }
      );
    } catch (err: any) {
      if (borrow?.id) {
        await supabase.from("borrows").delete().eq("id", borrow.id);
      }

      console.error("Borrow error:", err);
      toast.error(err.message || "Failed to borrow book.");
    }
  };

  // Toggle favorite locally (persist if you have a wishlist API later)
  const toggleFavorite = () => {
    setIsFavorite((v) => !v);
    if (!isFavorite) {
      toast.success("Saved to your reading list (local only).");
    } else {
      toast.success("Removed from your reading list (local only).");
    }
  };

  // If still loading initial data
  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-display font-bold">Book Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The requested book was not found.
        </p>
        <Link to="/browse">
          <Button className="mt-6">Browse All Books</Button>
        </Link>
      </div>
    );
  }

  // Safe destructure with fallbacks
  const {
    id: bookId,
    title,
    author,
    cover,
    category,
    rating,
    reviewCount,
    available,
    description,
    pages,
    publish_year,
    borrow_duration_days,
    total_borrows,
    isbn,
    publisher,
    language,
    gradeLevel,
    subjects,
  } = book;

  const ratingDistribution = [
    { stars: 5, percentage: 72 },
    { stars: 4, percentage: 18 },
    { stars: 3, percentage: 7 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ];
  console.log("Route ID:", id);
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="relative aspect-[2/3] max-w-[260px] sm:max-w-[300px] lg:max-w-none mx-auto rounded-2xl overflow-hidden shadow-book bg-muted">
                <img
                  src={cover}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="book-spine" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleBorrow}
                >
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
                    onClick={toggleFavorite}
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
            <span className="category-badge mb-4">{category}</span>

            {/* Title & Author */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold break-words text-foreground mb-2">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              by <span className="text-foreground">{author}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(rating ?? 0)
                        ? "fill-secondary text-secondary"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{rating ?? 0}</span>
              <span className="text-muted-foreground">
                ({reviewCount ?? 0} reviews)
              </span>
            </div>

            {/* Availability Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                available
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  available ? "bg-success" : "bg-destructive"
                }`}
              />
              {available ? "Available to borrow" : "Currently borrowed"}
            </div>

            {/* Description */}
            <div className="prose prose-sm sm:prose-lg max-w-none mb-8 break-words">
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Book Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-muted/50 rounded-xl p-4">
                <FileText className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Pages</p>
                <p className="font-semibold">{pages ?? "—"}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <Calendar className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="font-semibold">{publish_year ?? "—"}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <Clock className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Borrow Period</p>
                <p className="font-semibold">
                  {borrow_duration_days ?? 14} days
                </p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <BookOpen className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Total Borrows</p>
                <p className="font-semibold">
                  {(total_borrows ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 text-sm">
              <div className="flex">
                <span className="w-32 text-muted-foreground">ISBN:</span>
                <span className="font-medium">{isbn ?? "—"}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Publisher:</span>
                <span className="font-medium">{publisher ?? "—"}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Language:</span>
                <span className="font-medium">{language ?? "English"}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Grade Level:</span>
                <span className="font-medium">{gradeLevel ?? "—"}</span>
              </div>
              <div className="flex flex-wrap items-start">
                <span className="w-32 text-muted-foreground">Subjects:</span>
                <div className="flex flex-wrap gap-2 max-w-full break-words">
                  {subjects && subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-3 py-1 bg-muted rounded-full text-xs font-medium"
                      >
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
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
                    {rating ?? 0}
                  </p>
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(rating ?? 0)
                            ? "fill-secondary text-secondary"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {reviewCount ?? 0} reviews
                  </p>
                </div>

                {/* Rating Bars */}
                <div className="space-y-3">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="text-sm w-8">{item.stars}★</span>
                      <Progress
                        value={item.percentage}
                        className="flex-1 h-2"
                      />
                      <span className="text-sm text-muted-foreground w-10">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                {reviews.length === 0 ? (
                  <div className="bg-card rounded-xl p-6 border border-border/50 text-center text-muted-foreground">
                    No reviews yet. Be the first to review this book.
                  </div>
                ) : (
                  reviews.map((review) => (
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
                            <p className="font-medium">{review.user_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
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
                  ))
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fetchReviews(bookId, 1)}
                  >
                    Refresh Reviews
                  </Button>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={loadMoreReviews}
                    disabled={loadingMoreReviews}
                  >
                    {loadingMoreReviews ? <>Loading...</> : "Load More Reviews"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h3 className="text-lg font-display font-semibold mb-4">
                About This Book
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                {description}
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
            {relatedBooks.length === 0 ? (
              <div className="text-muted-foreground col-span-full">
                No related books found.
              </div>
            ) : (
              relatedBooks.map((b, index) => (
                <div
                  key={b.id}
                  className="opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <BookCard book={b} />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
