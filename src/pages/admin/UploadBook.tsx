import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Image, FileText, X, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Category {
  id: string;
  name: string;
}

export default function UploadBook() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    isbn: "",
    publisher: "",
    publishYear: "",
    pages: "",
    language: "English",
    gradeLevel: "",
    categoryId: "",
    borrowDurationDays: "14",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name").order("name");
    setCategories(data || []);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["application/pdf", "application/epub+zip"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PDF or EPUB file");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }
      setBookFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author) {
      toast.error("Title and author are required");
      return;
    }

    setIsLoading(true);

    try {
      let coverUrl = null;
      let fileUrl = null;
      let fileType = null;

      // Upload cover image
      if (coverFile) {
        const coverExt = coverFile.name.split(".").pop();
        const coverPath = `covers/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${coverExt}`;
        
        const { error: coverError } = await supabase.storage
          .from("book-covers")
          .upload(coverPath, coverFile);

        if (coverError) throw coverError;

        const { data: { publicUrl } } = supabase.storage
          .from("book-covers")
          .getPublicUrl(coverPath);
        
        coverUrl = publicUrl;
      }

      // Upload book file
      if (bookFile) {
        const fileExt = bookFile.name.split(".").pop()?.toLowerCase();
        const filePath = `books/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { error: fileError } = await supabase.storage
          .from("book-files")
          .upload(filePath, bookFile);

        if (fileError) throw fileError;

        const { data: { publicUrl } } = supabase.storage
          .from("book-files")
          .getPublicUrl(filePath);
        
        fileUrl = publicUrl;
        fileType = fileExt === "epub" ? "epub" : "pdf";
      }

      // Insert book record
      const { error: insertError } = await supabase.from("books").insert({
        title: formData.title,
        author: formData.author,
        description: formData.description || null,
        isbn: formData.isbn || null,
        publisher: formData.publisher || null,
        publish_year: formData.publishYear ? parseInt(formData.publishYear) : null,
        pages: formData.pages ? parseInt(formData.pages) : null,
        language: formData.language,
        grade_level: formData.gradeLevel || null,
        category_id: formData.categoryId || null,
        cover_url: coverUrl,
        file_url: fileUrl,
        file_type: fileType,
        borrow_duration_days: parseInt(formData.borrowDurationDays),
      });

      if (insertError) throw insertError;

      toast.success("Book uploaded successfully!");
      navigate("/admin/books");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload book");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Upload New Book
          </h1>
          <p className="text-muted-foreground">
            Add a new book to the library collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Uploads */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Cover Upload */}
            <div className="space-y-3">
              <Label>Book Cover</Label>
              <div
                className="relative border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("cover-upload")?.click()}
              >
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverFile(null);
                        setCoverPreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Image className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload cover image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </>
                )}
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Book File Upload */}
            <div className="space-y-3">
              <Label>Book File (PDF/EPUB)</Label>
              <div
                className="relative border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer h-full min-h-[200px] flex flex-col items-center justify-center"
                onClick={() => document.getElementById("book-upload")?.click()}
              >
                {bookFile ? (
                  <div className="text-center">
                    <FileText className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">{bookFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(bookFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBookFile(null);
                      }}
                      className="mt-3 text-xs text-destructive hover:underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload book file
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF or EPUB up to 50MB
                    </p>
                  </>
                )}
                <input
                  id="book-upload"
                  type="file"
                  accept=".pdf,.epub,application/pdf,application/epub+zip"
                  onChange={handleBookFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-6">
            <h2 className="text-lg font-display font-semibold">Book Details</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter book title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter book description"
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  placeholder="978-0-000-00000-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  placeholder="Publisher name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishYear">Publish Year</Label>
                <Input
                  id="publishYear"
                  type="number"
                  value={formData.publishYear}
                  onChange={(e) => setFormData({ ...formData, publishYear: e.target.value })}
                  placeholder="2024"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Input
                  id="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  placeholder="e.g. 9-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  placeholder="Number of pages"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  placeholder="English"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="borrowDuration">Borrow Duration (days)</Label>
                <Input
                  id="borrowDuration"
                  type="number"
                  value={formData.borrowDurationDays}
                  onChange={(e) => setFormData({ ...formData, borrowDurationDays: e.target.value })}
                  placeholder="14"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link to="/admin">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                "Upload Book"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
