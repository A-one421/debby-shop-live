import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  Truck,
  Award,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import useReveal from "./useReveal";
import { showToast } from "./Toast";
import { heroSlides, CATEGORIES, PHONE, EMAIL, ADDRESS } from "./data";
import { useProducts } from "./useProducts";

/* ── Scroll-reveal wrapper ── */
function R({ children, className = "", style = {} }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════
   HERO SLIDER
════════════════════════════════════════════ */
function HeroSlider() {
  const [cur, setCur] = useState(0);
  const navigate = useNavigate();
  const startX = useRef(null);
  const total = heroSlides.length;

  useEffect(() => {
    const id = setInterval(() => setCur((c) => (c + 1) % total), 4800);
    return () => clearInterval(id);
  }, [total]);

  const go = (i) => setCur(((i % total) + total) % total);

  return (
    <div
      className="hero-slider-modern"
      onTouchStart={(e) => (startX.current = e.changedTouches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current === null) return;
        const diff = startX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) go(cur + (diff > 0 ? 1 : -1));
        startX.current = null;
      }}
    >
      {/* Slides */}
      {heroSlides.map((sl, i) => (
        <div key={i} className={`slide-modern${i === cur ? " active" : ""}`}>
          <img
            src={sl.src}
            alt={sl.alt}
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/1200x800/0a0a0a/D4AF37?text=Debby+Couture")
            }
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/58 z-[3]" />

      {/* Text / CTAs */}
      <div className="absolute inset-x-0 bottom-[18%] md:bottom-[22%] z-[4] text-center text-white px-6">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-[11px] md:text-xs tracking-[0.28em] uppercase mb-5 bg-black/40 backdrop-blur-sm px-5 py-1.5 rounded-full font-medium border border-white/20">
            For culture and class
          </span>
          <h1 className="font-serif text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-wide mb-5 drop-shadow-lg">
            Individuality <br />
            <em className="not-italic" style={{ color: "#D4AF37" }}>
              Over trends
            </em>
          </h1>
          <p className="text-sm md:text-lg max-w-lg mx-auto text-white/85 mb-8 leading-relaxed">
            Luxury women's fashion crafted with timeless elegance and premium
            tailoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/shop")}
              className="px-8 py-3.5 bg-white text-black text-xs font-semibold tracking-[0.18em] uppercase hover:bg-gold-400 hover:text-black transition-all duration-300 shadow-md"
            >
              Explore Collection
            </button>
            <button
              onClick={() => navigate("/bespoke")}
              className="px-8 py-3.5 border-2 border-white/80 text-white text-xs font-semibold tracking-[0.18em] uppercase hover:bg-gold-400 hover:text-black hover:border-gold-400 transition-all duration-300"
            >
              Bespoke & Custom
            </button>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 inset-x-0 z-[4] flex justify-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === cur ? 24 : 8,
              background: i === cur ? "#D4AF37" : "rgba(255,255,255,0.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   CATEGORY RAIL
════════════════════════════════════════════ */
function CategoryRail() {
  const navigate = useNavigate();
  const tiles = [
    { key: "tops", label: "Tops & Blouses", img: "/img4.jpg" },
    { key: "pants", label: "Pants & Trousers", img: "/img2.jpg" },
    { key: "ankara", label: "Ankara & Heritage", img: "/heritage1.jpg" },
    { key: "bridal", label: "Bridal & Asoebi", img: "/img5.jpg" },
  ];

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between mb-7">
          <h2 className="font-serif text-xl md:text-2xl text-black">
            Shop by Category
          </h2>
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-gray-400 hover:text-black transition-colors"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile: horizontal scroll; Desktop: 4-col grid */}
        <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-1 md:grid md:grid-cols-4 md:gap-6">
          {tiles.map((t) => (
            <button
              key={t.key}
              onClick={() => navigate(`/shop?category=${t.key}`)}
              className="group flex-shrink-0 w-[110px] md:w-auto text-center"
            >
              <div className="relative w-[110px] h-[110px] md:w-full md:aspect-square rounded-full md:rounded-2xl overflow-hidden bg-gray-100 mx-auto mb-3 ring-2 ring-transparent group-hover:ring-gold-400 transition-all duration-300">
                <img
                  src={t.img}
                  alt={t.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/300x300/f5f5f5/D4AF37?text=Debby")
                  }
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-800 group-hover:text-black transition-colors leading-tight block">
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   FEATURES STRIP
════════════════════════════════════════════ */
function Features() {
  return (
    <section className="py-20 bg-white border-y border-gray-100" id="about">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <R className="text-center max-w-2xl mx-auto mb-16">
          <span
            className="text-xs uppercase tracking-[0.22em] font-semibold"
            style={{ color: "#D4AF37" }}
          >
            The Debby Experience
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-5 text-black">
            Luxury craftsmanship,
            <br />
            effortless elegance
          </h2>
          <div
            className="w-16 h-0.5 mx-auto mb-6"
            style={{ background: "#D4AF37" }}
          />
          <p className="text-gray-500 leading-relaxed">
            Finest fabrics from around the world, tailored to celebrate
            confidence, culture, and modern femininity.
          </p>
        </R>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Scissors className="w-6 h-6" />,
              title: "Luxury-grade Tailoring",
              desc: "Finest fabrics from around the world, precision-cut for you.",
            },
            {
              icon: <Truck className="w-6 h-6" />,
              title: "Nationwide Delivery",
              desc: "Fast delivery across Nigeria with elegant premium packaging.",
            },
            {
              icon: <Award className="w-6 h-6" />,
              title: "Effortless Comfort & Fit",
              desc: "Guaranteed satisfaction — each piece tailored to celebrate you.",
            },
          ].map((f, i) => (
            <R
              key={i}
              className="text-center p-8 border border-gray-100 hover-lift rounded-2xl"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}
              >
                {f.icon}
              </div>
              <h3 className="font-serif text-xl mb-2 text-black">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   TRENDING NOW  (live from Firestore + static)
════════════════════════════════════════════ */
function TrendingNow() {
  const navigate = useNavigate();
  const products = useProducts();
  const items = products.slice(0, 8);
  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span
              className="text-[11px] uppercase tracking-[0.22em] font-semibold"
              style={{ color: "#D4AF37" }}
            >
              Fresh on the rack
            </span>
            <h2 className="font-serif text-3xl md:text-4xl mt-1.5 text-black">
              Trending Now
            </h2>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="hidden sm:flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-gray-400 hover:text-black transition-colors"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile: horizontal scroll; Desktop: 4-col grid */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 md:grid md:grid-cols-4 md:gap-6">
          {items.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate("/shop")}
              className="group flex-shrink-0 w-[44%] sm:w-[32%] md:w-auto text-left focus:outline-none"
            >
              <div
                className="relative overflow-hidden bg-gray-100 mb-3"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/400x600/f0ede8/aaa?text=Debby")
                  }
                />
                {p.tag && (
                  <span
                    className={`absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 ${
                      p.tag === "NEW"
                        ? "bg-black text-white"
                        : p.tag === "BEST"
                          ? "text-white"
                          : "bg-red-600 text-white"
                    }`}
                    style={p.tag === "BEST" ? { background: "#D4AF37" } : {}}
                  >
                    {p.tag}
                  </span>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-all duration-300" />
              </div>
              <p className="text-sm font-medium text-gray-900 truncate leading-tight">
                {p.name}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">
                From ₦{p.price.toLocaleString()}
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/shop")}
          className="sm:hidden w-full mt-6 border border-black text-black py-3 text-[11px] uppercase tracking-[0.18em] font-semibold hover:bg-black hover:text-white transition-all"
        >
          View All Products
        </button>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   ABOUT
════════════════════════════════════════════ */
function About() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gray-50" id="story">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <R className="order-2 lg:order-1">
            <span
              className="text-[11px] uppercase tracking-[0.22em] font-semibold"
              style={{ color: "#D4AF37" }}
            >
              Our Atelier
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-2 mb-5 text-black">
              About Debby Couture Atelier
            </h2>
            <div
              className="w-20 h-0.5 mb-6"
              style={{ background: "#D4AF37" }}
            />
            <p className="text-gray-600 leading-relaxed mb-4">
              We are a fashion brand dedicated to creating luxury and premium
              classic outfits for women who appreciate elegance and quality.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our designs blend the richness of local fabrics with refined
              foreign fabrics, delivering timeless pieces that are stylish,
              comfortable, and well-tailored.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Every outfit is thoughtfully crafted to celebrate confidence,
              culture, and modern femininity.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/shop")}
                className="px-8 py-3.5 bg-black text-white text-xs font-semibold tracking-[0.18em] uppercase hover:bg-gold-400 hover:text-black transition-all"
              >
                Shop the Collection
              </button>
              <button
                onClick={() => navigate("/bespoke")}
                className="px-8 py-3.5 border border-black text-black text-xs font-semibold tracking-[0.18em] uppercase hover:bg-black hover:text-white transition-all"
              >
                Bespoke Services
              </button>
            </div>
          </R>

          <R className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-md">
                <img
                  src="/E.jpg"
                  alt="Atelier"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/400x600/f5f5f5/D4AF37?text=Debby")
                  }
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden mt-8 rounded-2xl shadow-md">
                <img
                  src="/img3.jpg"
                  alt="Fashion"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/400x600/f5f5f5/D4AF37?text=Debby")
                  }
                />
              </div>
            </div>
          </R>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   COLLECTIONS
════════════════════════════════════════════ */
function Collections() {
  const navigate = useNavigate();
  const cols = [
    {
      img: "/img2.jpg",
      title: "Evening Luxe",
      desc: "Elegant dresses for special nights",
    },
    {
      img: "/img6.jpg",
      title: "Urban Minimal",
      desc: "Contemporary street style",
    },
    { img: "/img1.jpg", title: "Gold & Glitz", desc: "Premium curated pieces" },
  ];
  return (
    <section className="py-20 bg-white" id="shop">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <R className="text-center mb-12">
          <span
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "#D4AF37" }}
          >
            Curated for elegance
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mt-2 text-black">
            Curated Collections
          </h2>
          <div
            className="w-20 h-0.5 mx-auto mt-4"
            style={{ background: "#D4AF37" }}
          />
        </R>
        <div className="grid md:grid-cols-3 gap-6">
          {cols.map((c, i) => (
            <R
              key={i}
              className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer"
              style={{ height: 480 }}
              onClick={() => navigate("/shop")}
            >
              <img
                src={c.img}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={c.title}
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/600x800/0a0a0a/D4AF37?text=Debby")
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-serif text-3xl mb-1">{c.title}</h3>
                <p className="text-white/75 text-sm mb-3">{c.desc}</p>
                <span
                  className="inline-block border-b pb-0.5 text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: "#D4AF37", borderColor: "#D4AF37" }}
                >
                  Explore
                </span>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   CONTACT
════════════════════════════════════════════ */
function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      showToast("Delivered! We'll get back to you soon.");
    }, 900);
  }

  const inputCls =
    "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-gold-400 transition-colors";

  return (
    <section className="py-24 bg-gray-50" id="contact">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <R className="text-center mb-12">
          <span
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "#D4AF37" }}
          >
            Get in touch
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mt-2 text-black">
            We're Here to Help
          </h2>
          <div
            className="w-20 h-0.5 mx-auto mt-4"
            style={{ background: "#D4AF37" }}
          />
          <p className="text-gray-500 mt-5">
            Have a question or need styling advice? Our team is here for you.
          </p>
        </R>

        <R className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            {
              icon: <MapPin className="w-5 h-5" />,
              title: "Visit Our Boutique",
              val: ADDRESS,
            },
            {
              icon: <Phone className="w-5 h-5" />,
              title: "Call Us",
              val: PHONE,
            },
            {
              icon: <Mail className="w-5 h-5" />,
              title: "Email Us",
              val: EMAIL,
            },
            {
              icon: <MessageCircle className="w-5 h-5" />,
              title: "WhatsApp DM",
              val: PHONE,
            },
          ].map(({ icon, title, val }, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition hover-lift"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  color: "#D4AF37",
                }}
              >
                {icon}
              </div>
              <div>
                <p className="text-black font-semibold text-sm mb-0.5">
                  {title}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">{val}</p>
              </div>
            </div>
          ))}
        </R>

        <R>
          <form
            onSubmit={submit}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Your Name"
                  value={form.name}
                  onChange={set("name")}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  className={inputCls}
                  placeholder="youremail@example.com"
                  value={form.email}
                  onChange={set("email")}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                className={inputCls}
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={set("phone")}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Subject *
              </label>
              <select
                className={inputCls}
                value={form.subject}
                onChange={set("subject")}
                required
              >
                <option value="">Select a subject</option>
                {[
                  "General Inquiry",
                  "Order Support",
                  "Styling Consultation",
                  "Custom Orders",
                  "Press & Media",
                  "Other",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Message *
              </label>
              <textarea
                rows={5}
                className={`${inputCls} resize-none`}
                placeholder="Tell us how we can help you..."
                value={form.message}
                onChange={set("message")}
                required
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-black text-white py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-gold-400 hover:text-black transition-all rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {sending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Delivering…
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </R>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   PAGE ROOT
════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <CategoryRail />
      <Features />
      <TrendingNow />
      <About />
      <Collections />
      <Contact />
    </div>
  );
}
