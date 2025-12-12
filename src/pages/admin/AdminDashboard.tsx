import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { SectionHeader } from "@/components/ui/section-header";
import {
  BookOpen,
  Users,
  BookMarked,
  Star,
  Plus,
  Settings,
  BarChart3,
  Upload,
  UserCog,
  FileText,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalBooks: number;
  totalUsers: number;
  activeBorrows: number;
  totalReviews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    totalReviews: 0,
  });
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentBooks();
  }, []);

  const fetchStats = async () => {
    const [booksRes, profilesRes, borrowsRes, reviewsRes] = await Promise.all([
      supabase.from("books").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("borrows").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("reviews").select("id", { count: "exact", head: true }),
    ]);

    setStats({
      totalBooks: booksRes.count || 0,
      totalUsers: profilesRes.count || 0,
      activeBorrows: borrowsRes.count || 0,
      totalReviews: reviewsRes.count || 0,
    });
    setIsLoading(false);
  };

  const fetchRecentBooks = async () => {
    const { data } = await supabase
      .from("books")
      .select("*, categories(name)")
      .order("created_at", { ascending: false })
      .limit(5);
    setRecentBooks(data || []);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your library, users, and content
            </p>
          </div>
          <Link to="/admin/books/new">
            <Button variant="default" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Book
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatsCard
            title="Total Books"
            value={stats.totalBooks}
            icon={BookOpen}
            trend={{ value: 12, positive: true }}
          />
          <StatsCard
            title="Registered Users"
            value={stats.totalUsers}
            icon={Users}
            trend={{ value: 8, positive: true }}
          />
          <StatsCard
            title="Active Borrows"
            value={stats.activeBorrows}
            icon={BookMarked}
          />
          <StatsCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon={Star}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/admin/books/new" className="block">
            <div className="bg-card rounded-xl p-6 border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group">
              <Upload className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">Upload Book</h3>
              <p className="text-sm text-muted-foreground">Add new books with PDF/EPUB</p>
            </div>
          </Link>
          <Link to="/admin/books" className="block">
            <div className="bg-card rounded-xl p-6 border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group">
              <FileText className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">Manage Books</h3>
              <p className="text-sm text-muted-foreground">Edit or remove books</p>
            </div>
          </Link>
          <Link to="/admin/users" className="block">
            <div className="bg-card rounded-xl p-6 border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group">
              <UserCog className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">User Management</h3>
              <p className="text-sm text-muted-foreground">Manage users and roles</p>
            </div>
          </Link>
          <Link to="/admin/reviews" className="block">
            <div className="bg-card rounded-xl p-6 border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group">
              <Star className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-foreground mb-1">Review Moderation</h3>
              <p className="text-sm text-muted-foreground">Approve or reject reviews</p>
            </div>
          </Link>
        </div>

        {/* Recent Books */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <SectionHeader
            title="Recently Added Books"
            subtitle="Latest additions to the library"
            action={
              <Link to="/admin/books">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            }
          />

          {recentBooks.length > 0 ? (
            <div className="space-y-4">
              {recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl"
                >
                  <div className="w-12 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {book.cover_url ? (
                      <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{book.title}</h4>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {book.categories?.name || "Uncategorized"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(book.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No books added yet</p>
              <Link to="/admin/books/new">
                <Button variant="outline" className="mt-4">Add Your First Book</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
