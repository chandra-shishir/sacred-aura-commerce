import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Award,
  RefreshCw,
  PlayCircle,
  BookOpen,
  Infinity as InfinityIcon,
  ScrollText,
  Users,
  Smartphone,
  ChevronRight,
  Search,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import { useCourse } from "@/hooks/useCourses";
import { useEnroll } from "@/hooks/useCourseContent";
import { useAuth } from "@/context/AuthContext";
import courseReikiFallback from "@/assets/course-reiki.jpg";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const CourseCheckout = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourse(slug || "");
  const { user } = useAuth();
  const enroll = useEnroll();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [coupon, setCoupon] = useState("");
  const [discountApplied, setDiscountApplied] = useState(true); // default 50% off shown
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [optIn, setOptIn] = useState(true);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const update = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: false }));
  };

  const price = Number(course?.price ?? 149);
  const mrp = Number(course?.mrp ?? 299);
  const discount = discountApplied ? mrp - price : 0;
  const total = mrp - discount;

  const handleApplyCoupon = () => {
    if (!coupon.trim()) {
      toast.error("Enter a coupon code");
      return;
    }
    setDiscountApplied(true);
    toast.success(`Coupon "${coupon.toUpperCase()}" applied`);
  };

  const validate = () => {
    const req = ["firstName", "lastName", "email", "cardNumber", "cardName", "expiry", "cvv"];
    const e: Record<string, boolean> = {};
    req.forEach((k) => {
      if (!form[k as keyof typeof form]?.toString().trim()) e[k] = true;
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEnroll = async () => {
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!user) {
      toast.error("Please sign in to enroll");
      navigate("/auth");
      return;
    }
    if (!course?.id) {
      toast.error("Course not found");
      return;
    }
    try {
      await enroll.mutateAsync(course.id);
      toast.success("Enrollment confirmed — welcome aboard ✨");
      setTimeout(() => navigate(`/courses/${slug}/learn`), 600);
    } catch (e: any) {
      toast.error(e.message || "Enrollment failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#130d2a]">
        <div className="w-8 h-8 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const courseTitle = course?.title || "Reiki Level 1 — Shoden";
  const courseSubtitle = course?.subtitle || "Foundation of Healing Energy";
  const courseInstructor = course?.instructor || "Dr. Priya Sharma";
  const courseCategory = course?.category || "Reiki";
  const courseLevel = course?.level || "Beginner";
  const courseImage = course?.image_url || courseReikiFallback;
  const discountPct = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const inputBase =
    "w-full px-4 py-3 rounded-xl bg-[#1a1238] border border-purple-500/20 text-violet-50 font-jost text-sm placeholder:text-violet-300/40 focus:outline-none focus:border-fuchsia-400/60 focus:ring-2 focus:ring-fuchsia-400/30 focus:shadow-[0_0_24px_-6px_rgba(217,70,239,0.6)] transition-all";
  const errInput = "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/30";

  const brandPills = ["VISA", "MC", "AMEX", "RuPay", "UPI"];

  const receive = [
    { icon: PlayCircle, label: "8 hrs HD video lessons" },
    { icon: BookOpen, label: "21 in-depth lessons" },
    { icon: InfinityIcon, label: "Lifetime access" },
    { icon: ScrollText, label: "Completion certificate" },
    { icon: Users, label: "Private community" },
    { icon: Smartphone, label: "Mobile & desktop access" },
  ];

  const trustBadges = [
    { icon: Lock, label: "SSL Encrypted" },
    { icon: ShieldCheck, label: "Secure Payment" },
    { icon: Award, label: "Certified Course" },
    { icon: RefreshCw, label: "7-Day Refund" },
  ];

  return (
    <div className="min-h-screen bg-[#130d2a] font-jost text-violet-100">
      <SEO title={`Checkout — ${courseTitle}`} description="Complete your Sacred Aura course enrollment." canonical={`/course-checkout/${slug}`} noindex />

      {/* Mystical ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-fuchsia-600/15 blur-[120px]" />
      </div>

      {/* Custom Nav */}
      <header className="relative z-10 border-b border-purple-500/10 backdrop-blur-md bg-[#130d2a]/70">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-cormorant text-2xl tracking-wide text-violet-50">
            Sacred<span className="text-fuchsia-400">Aura</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2 font-jost text-xs uppercase tracking-[0.2em] text-violet-300/70">
            <span>Cart</span>
            <ChevronRight size={14} className="text-fuchsia-400/60" />
            <span className="text-violet-50">Checkout</span>
            <ChevronRight size={14} className="text-purple-500/40" />
            <span className="text-violet-300/40">Confirmation</span>
          </nav>
          <div className="flex items-center gap-4 text-violet-200/80">
            <Search size={18} />
            <Heart size={18} />
            <ShoppingBag size={18} />
            <User size={18} />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-10 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 space-y-6">
            {/* Course Summary Card */}
            <div className="rounded-2xl bg-white/[0.03] border border-purple-500/15 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex gap-5">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden flex-shrink-0 border border-purple-500/20">
                  <img src={courseImage} alt={courseTitle} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/20 text-violet-200 text-[10px] uppercase tracking-wider">
                      {courseCategory}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/20 text-violet-200 text-[10px] uppercase tracking-wider">
                      {courseLevel}
                    </span>
                    {discountPct > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white text-[10px] font-semibold uppercase tracking-wider shadow-[0_4px_14px_-4px_rgba(217,70,239,0.6)]">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>
                  <h2 className="font-cormorant text-2xl md:text-3xl text-violet-50 leading-tight">{courseTitle}</h2>
                  <p className="font-jost text-sm text-violet-300/80 mt-1">{courseSubtitle}</p>
                  <p className="font-jost text-xs text-fuchsia-300/80 mt-2 uppercase tracking-wider">Taught by {courseInstructor}</p>
                  <div className="flex items-baseline gap-3 mt-3">
                    <span className="font-cormorant text-3xl text-violet-50">₹{price}</span>
                    {mrp > price && <span className="font-jost text-sm text-violet-300/40 line-through">₹{mrp}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <section className="rounded-2xl bg-white/[0.03] border border-purple-500/15 p-6">
              <h3 className="font-cormorant text-xl text-violet-50 mb-1">Personal Details</h3>
              <p className="font-jost text-xs text-violet-300/60 mb-5">Where shall we send your certificate?</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-violet-300/70 mb-1.5">First Name *</label>
                  <input className={`${inputBase} ${errors.firstName ? errInput : ""}`} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Priya" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-violet-300/70 mb-1.5">Last Name *</label>
                  <input className={`${inputBase} ${errors.lastName ? errInput : ""}`} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Sharma" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-violet-300/70 mb-1.5">Email *</label>
                  <input type="email" className={`${inputBase} ${errors.email ? errInput : ""}`} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-violet-300/70 mb-1.5">Phone <span className="text-violet-300/40 normal-case">(optional)</span></label>
                  <input type="tel" className={inputBase} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
                </div>
              </div>
            </section>

            {/* Payment Details */}
            <section className="rounded-2xl bg-white/[0.03] border border-purple-500/15 p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-cormorant text-xl text-violet-50">Payment Details</h3>
                <div className="flex items-center gap-1.5">
                  {brandPills.map((b) => (
                    <span key={b} className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] tracking-wider text-violet-200 uppercase font-jost">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              <p className="font-jost text-xs text-violet-300/60 mb-5">All transactions are encrypted end-to-end.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-violet-300/70 mb-1.5">Card Number *</label>
                  <input className={`${inputBase} ${errors.cardNumber ? errInput : ""}`} value={form.cardNumber} onChange={(e) => update("cardNumber", e.target.value)} placeholder="1234 5678 9012 3456" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-violet-300/70 mb-1.5">Cardholder Name *</label>
                  <input className={`${inputBase} ${errors.cardName ? errInput : ""}`} value={form.cardName} onChange={(e) => update("cardName", e.target.value)} placeholder="Name as on card" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-violet-300/70 mb-1.5">Expiry *</label>
                  <input className={`${inputBase} ${errors.expiry ? errInput : ""}`} value={form.expiry} onChange={(e) => update("expiry", e.target.value)} placeholder="MM / YY" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-violet-300/70 mb-1.5">CVV *</label>
                  <input className={`${inputBase} ${errors.cvv ? errInput : ""}`} value={form.cvv} onChange={(e) => update("cvv", e.target.value)} placeholder="•••" maxLength={4} />
                </div>
              </div>
            </section>

            {/* Coupon */}
            <section className="rounded-2xl bg-white/[0.03] border border-purple-500/15 p-6">
              <h3 className="font-cormorant text-xl text-violet-50 mb-3">Have a coupon?</h3>
              <div className="flex gap-3">
                <input className={inputBase} value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter coupon code" />
                <button
                  onClick={handleApplyCoupon}
                  className="px-6 py-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-violet-100 font-jost text-sm uppercase tracking-wider hover:bg-purple-500/25 transition-colors"
                >
                  Apply
                </button>
              </div>
            </section>

            {/* Checkboxes */}
            <section className="space-y-3 px-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-purple-500/40 bg-[#1a1238] text-fuchsia-500 focus:ring-fuchsia-400/40"
                />
                <span className="font-jost text-sm text-violet-200/80">
                  I agree to the <a className="text-fuchsia-300 underline underline-offset-2">Terms of Service</a> and <a className="text-fuchsia-300 underline underline-offset-2">Refund Policy</a>
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={optIn}
                  onChange={(e) => setOptIn(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-purple-500/40 bg-[#1a1238] text-fuchsia-500 focus:ring-fuchsia-400/40"
                />
                <span className="font-jost text-sm text-violet-200/80">Send me spiritual insights, course updates &amp; rituals via email</span>
              </label>
            </section>
          </div>

          {/* RIGHT COLUMN — Sticky Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6 space-y-5">
              <div className="rounded-2xl bg-white/[0.03] border border-purple-500/20 p-6 shadow-[0_30px_80px_-30px_rgba(168,85,247,0.25)]">
                <h3 className="font-cormorant text-2xl text-violet-50 mb-5">Order Summary</h3>

                <div className="space-y-3 font-jost text-sm">
                  <div className="flex justify-between text-violet-200/80">
                    <span>Original Price</span>
                    <span className="line-through text-violet-300/50">₹{mrp}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount {discountPct ? `(${discountPct}%)` : ""}</span>
                    <span>−₹{discount}</span>
                  </div>
                  <div className="flex justify-between text-violet-200/80">
                    <span>Taxes</span>
                    <span>₹0</span>
                  </div>
                </div>

                <div className="my-5 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                <div className="flex items-baseline justify-between">
                  <span className="font-jost text-xs uppercase tracking-[0.2em] text-violet-300/70">Total</span>
                  <span className="font-cormorant text-5xl text-violet-50">₹{total}</span>
                </div>

                {/* Trust Badges 2x2 */}
                <div className="grid grid-cols-2 gap-2 mt-6">
                  {trustBadges.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-purple-500/5 border border-purple-500/15">
                      <Icon size={14} className="text-fuchsia-300 flex-shrink-0" />
                      <span className="font-jost text-[11px] text-violet-200/90">{label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={handleEnroll}
                  disabled={!agreeTerms}
                  className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-jost text-sm uppercase tracking-[0.18em] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(217,70,239,0.7)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  Enroll Now — ₹{total}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-violet-300/70">
                  <ShieldCheck size={14} className="text-fuchsia-300" />
                  <span className="font-jost text-[11px]">30-day satisfaction guarantee</span>
                </div>
              </div>

              {/* What you'll receive */}
              <div className="rounded-2xl bg-white/[0.03] border border-purple-500/15 p-6">
                <h4 className="font-cormorant text-lg text-violet-50 mb-4">What you'll receive</h4>
                <ul className="space-y-3">
                  {receive.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3 font-jost text-sm text-violet-200/90">
                      <span className="w-7 h-7 rounded-full bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
                        <Icon size={13} className="text-fuchsia-300" />
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CourseCheckout;
