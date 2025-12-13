import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import BookDetail from "./pages/BookDetail";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UploadBook from "./pages/admin/UploadBook";
import ManageBooks from "./pages/admin/ManageBooks";
import ManageUsers from "./pages/admin/ManageUsers";
import NotFound from "./pages/NotFound";
import ManageReviews from "./pages/admin/ManageReviews";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Layout><Browse /></Layout>} />
            <Route path="/book/:id" element={<Layout><BookDetail /></Layout>} />
            <Route path="/categories" element={<Layout><Categories /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/books/new" element={<AdminLayout><UploadBook /></AdminLayout>} />
            <Route path="/admin/books" element={<AdminLayout><ManageBooks /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><ManageUsers /></AdminLayout>} />
            <Route path="/admin/reviews" element={<AdminLayout><ManageReviews/></AdminLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
