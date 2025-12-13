import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard, Book } from "@/components/books/BookCard";
import { CategoryCard } from "@/components/books/CategoryCard";
import { SectionHeader } from "@/components/ui/section-header";
import { Layout } from "@/components/layout/Layout";
import {
  Search,
  ArrowRight,
  BookOpen,
  Users,
  Clock,
  Award,
  Microscope,
  Calculator,
  Globe,
  Palette,
  Code,
  Beaker,
  Languages,
} from "lucide-react";

import heroLibrary from "@/assets/hero-library.jpg";
import gatsbyBook from "@/assets/books/gatsby.jpg";
import physicsBook from "@/assets/books/physics.jpg";
import mathBook from "@/assets/books/mathematics.jpg";
import hamletBook from "@/assets/books/hamlet.jpg";
import historyBook from "@/assets/books/history.jpg";
import biologyBook from "@/assets/books/biology.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const featuredBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: gatsbyBook,
    category: "Literature",
    rating: 4.8,
    reviewCount: 342,
    available: true,
    gradeLevel: "11-12",
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
    id: "3",
    title: "Calculus Fundamentals",
    author: "Prof. James Wilson",
    cover: mathBook,
    category: "Mathematics",
    rating: 4.5,
    reviewCount: 256,
    available: false,
    gradeLevel: "11-12",
  },
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

const categories = [
  {
    name: "Science",
    icon: Microscope,
    bookCount: 324,
    href: "/browse?category=science",
    color: "#3b82f6",
  },
  {
    name: "Mathematics",
    icon: Calculator,
    bookCount: 189,
    href: "/browse?category=mathematics",
    color: "#8b5cf6",
  },
  {
    name: "History",
    icon: Globe,
    bookCount: 245,
    href: "/browse?category=history",
    color: "#f59e0b",
  },
  {
    name: "Literature",
    icon: BookOpen,
    bookCount: 412,
    href: "/browse?category=literature",
    color: "#10b981",
  },
  {
    name: "Art & Music",
    icon: Palette,
    bookCount: 156,
    href: "/browse?category=arts",
    color: "#ec4899",
  },
  {
    name: "Languages",
    icon: Languages,
    bookCount: 178,
    href: "/browse?category=languages",
    color: "#14b8a6",
  },
  {
    name: "Technology",
    icon: Code,
    bookCount: 134,
    href: "/browse?category=technology",
    color: "#6366f1",
  },
  {
    name: "Chemistry",
    icon: Beaker,
    bookCount: 98,
    href: "/browse?category=chemistry",
    color: "#f97316",
  },
];

const stats = [
  { label: "Books Available", value: "12,500+", icon: BookOpen },
  { label: "Active Readers", value: "3,200+", icon: Users },
  { label: "Books Borrowed Daily", value: "450+", icon: Clock },
  { label: "5-Star Reviews", value: "8,900+", icon: Award },
];

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroLibrary}
              alt="MSS Library"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 hero-gradient opacity-90" />
          </div>
          <div className="container relative z-10 py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <span className="text-sm text-primary-foreground/90">
                  Smart School e-Library System
                </span>
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: "100ms",
                  animationFillMode: "forwards",
                }}
              >
                Discover Knowledge,
                <br />
                <span className="text-gradient">Ignite Curiosity</span>
              </h1>
              <p
                className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: "200ms",
                  animationFillMode: "forwards",
                }}
              >
                Access thousands of books, research materials, and educational
                resources. Your gateway to endless learning opportunities.
              </p>
              <div
                className="flex flex-col sm:flex-row gap-3 mb-8 opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: "300ms",
                  animationFillMode: "forwards",
                }}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder="Search books..."
                    className="pl-12 h-14 text-base bg-background/95 backdrop-blur-sm border-0 shadow-lg"
                  />
                </div>
                <Button variant="hero" onClick={handleSearch} size="xl">
                  Search Library
                </Button>
              </div>
              <div
                className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up"
                style={{
                  animationDelay: "400ms",
                  animationFillMode: "forwards",
                }}
              >
                <Link to="/browse">
                  <Button variant="hero-outline" size="lg" className="gap-2">
                    Browse Collection
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Stats Section */}
        <section className="py-12 -mt-16 relative z-20">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <stat.icon className="h-8 w-8 text-secondary mb-3" />
                  <p className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Books Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <SectionHeader
              title="Featured Books"
              subtitle="Handpicked selections for our students"
              action={
                <Link to="/browse">
                  <Button variant="outline" className="gap-2">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              }
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {featuredBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <SectionHeader
              title="Browse by Category"
              subtitle="Find books organized by subject area"
              action={
                <Link to="/categories">
                  <Button variant="outline" className="gap-2">
                    All Categories
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              }
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  className="opacity-0 animate-fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <CategoryCard {...category} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Ready to Start Reading?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of students and teachers who are already
              discovering new worlds through our library.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth">
                <Button variant="hero" size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="hero-outline" size="lg">
                  Explore Library
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
