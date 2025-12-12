import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 hero-gradient">
        <div className="container text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-6">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            About MSS Library
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Smart School e-Library System - Your gateway to endless learning
            opportunities
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                MSS Library is dedicated to providing students and educators with
                seamless access to a vast collection of educational resources.
                We believe that knowledge should be accessible to everyone,
                anywhere, anytime.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our digital library bridges the gap between traditional learning
                and modern technology, offering an intuitive platform that makes
                discovering and borrowing books easier than ever before.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl p-6 text-center shadow-md">
                <p className="text-4xl font-display font-bold text-primary mb-2">
                  12K+
                </p>
                <p className="text-muted-foreground">Books Available</p>
              </div>
              <div className="bg-card rounded-2xl p-6 text-center shadow-md">
                <p className="text-4xl font-display font-bold text-primary mb-2">
                  3K+
                </p>
                <p className="text-muted-foreground">Active Students</p>
              </div>
              <div className="bg-card rounded-2xl p-6 text-center shadow-md">
                <p className="text-4xl font-display font-bold text-primary mb-2">
                  50+
                </p>
                <p className="text-muted-foreground">Categories</p>
              </div>
              <div className="bg-card rounded-2xl p-6 text-center shadow-md">
                <p className="text-4xl font-display font-bold text-primary mb-2">
                  98%
                </p>
                <p className="text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Vast Collection",
                description:
                  "Access over 12,000 books covering all subjects from literature to science, mathematics to history.",
              },
              {
                title: "Easy Borrowing",
                description:
                  "Borrow digital books instantly with just a few clicks. No physical pickup required.",
              },
              {
                title: "Read Anywhere",
                description:
                  "Access your borrowed books from any device - computer, tablet, or smartphone.",
              },
              {
                title: "Personal Reading",
                description:
                  "Track your reading progress, save favorites, and get personalized recommendations.",
              },
              {
                title: "24/7 Access",
                description:
                  "The library never closes. Access resources anytime, day or night.",
              },
              {
                title: "Teacher Resources",
                description:
                  "Special tools for teachers to assign readings and track student progress.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-md border border-border/50"
              >
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions or need assistance? Our library team is here to
              help.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">library@mss.edu</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium">Hours</p>
                <p className="text-sm text-muted-foreground">24/7 Online Access</p>
              </div>
            </div>

            <Link to="/register">
              <Button variant="default" size="lg" className="gap-2">
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
