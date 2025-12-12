import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  bookCount: number;
  href: string;
  color?: string;
}

export function CategoryCard({ name, icon: Icon, bookCount, href, color }: CategoryCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "bg-card hover:shadow-lg hover:-translate-y-1",
        "border border-border/50 hover:border-primary/20"
      )}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-24 h-24 opacity-10 transition-opacity duration-300 group-hover:opacity-20"
        style={{
          background: color || "hsl(var(--primary))",
          borderRadius: "0 0 0 100%",
        }}
      />
      
      {/* Icon */}
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundColor: color ? `${color}20` : "hsl(var(--primary) / 0.1)",
          color: color || "hsl(var(--primary))",
        }}
      >
        <Icon className="h-6 w-6" />
      </div>
      
      {/* Content */}
      <h3 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <p className="text-sm text-muted-foreground">
        {bookCount} {bookCount === 1 ? "book" : "books"}
      </p>
    </Link>
  );
}
