import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  created_at: string;
  book: { title: string } | null;
  profile: { first_name: string | null; last_name: string | null } | null;
}

export default function ManageReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        approved,
        created_at,
        books:book_id ( title ),
        profiles:user_id ( first_name, last_name )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch reviews");
    } else {
      setReviews(
        (data || []).map((r: any) => ({
          ...r,
          book: r.books,
          profile: r.profiles,
        }))
      );
    }
    setLoading(false);
  };

  const updateReview = async (id: string, approved: boolean) => {
    const { error } = await supabase
      .from("reviews")
      .update({ approved })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update review");
    } else {
      toast.success(approved ? "Review approved" : "Review rejected");
      fetchReviews();
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-5xl">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">Review Moderation</h1>

        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews found</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-xl p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {review.book?.title ?? "Unknown Book"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By{" "}
                      {review.profile
                        ? `${review.profile.first_name ?? ""} ${review.profile.last_name ?? ""}`
                        : "Unknown User"}
                    </p>
                  </div>
                  <span className="text-sm">⭐ {review.rating}</span>
                </div>

                {review.comment && (
                  <p className="text-sm">{review.comment}</p>
                )}

                <div className="flex gap-2">
                  {!review.approved && (
                    <Button
                      size="sm"
                      onClick={() => updateReview(review.id, true)}
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateReview(review.id, false)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
