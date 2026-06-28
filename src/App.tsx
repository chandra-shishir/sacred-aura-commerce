import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseCheckout from "./pages/CourseCheckout";
import CourseLearn from "./pages/CourseLearn";
import VastuProductDetail from "./pages/VastuProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Architecture from "./pages/Architecture";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/vastu/:slug" element={<VastuProductDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/courses/:slug/learn" element={<CourseLearn />} />
              <Route path="/course-checkout/:slug" element={<CourseCheckout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
