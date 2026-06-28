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

function R({ children, className = "", style = {} }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal-on-scroll ${className}`} style={style}>
      {children}
    </div>
  );
}

function HeroSlider() {
  const [cur, setCur] = useState(0);
  const navigate = useNavigate();
  const startX = useRef(null);

  useEffect(() => {
    const id = setInterval(
      () => setCur((c) => (c + 1) % heroSlides.length),
      4500,
    );
    return () => clearInterval(id);
  }, []);

  const go = (i) =>
    setCur(((i % heroSlides.length) + heroSlides.length) % heroSlides.length);

  return (
    <div
      className="hero-slider-modern relative"
      onTouchStart={(e) => (startX.current = e.changedTouches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current === null) return;
        const diff = startX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) go(cur + (diff > 0 ? 1 : -1));
        startX.current = null;
      }}
    >
      <div className="relative w-full h-full" id="heroSliderContainer">
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
        <div className="absolute inset-0 bg-black/60 z-[3]" />
      </div>
      <div className="absolute bottom-[15%] md:bottom-[20%] left-0 right-0 z-[4] text-center text-white px-6">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-xs md:text-sm tracking-[0.25em] uppercase mb-4 bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full font-medium border border-gold-400/60">
            For culture and class
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight md:leading-[1.2] tracking-wide mb-5 drop-shadow-lg">
            Individuality <br />
            <span className="text-gold-400 italic">Over trends</span>
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto text-white/90 mb-8">
            Luxury women's fashion crafted with timeless elegance and premium
            tailoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/shop")}
              className="inline-block px-8 py-3 bg-white text-black font-semibold tracking-wide text-sm hover:bg-gold-400 hover:text-black transition-all duration-300 shadow-md"
            >
              EXPLORE COLLECTION
            </button>
            <button
              onClick={() => navigate("/bespoke")}
              className="inline-block px-8 py-3 border-2 border-white text-white font-semibold tracking-wide text-sm hover:bg-gold-400 hover:text-black hover:border-gold-400 transition-all duration-300"
            >
              BESPOKE & CUSTOM
            </button>
          </div>
        </div>
      </div>
      {/* Slide indicators */}
      <div className="absolute bottom-5 left-0 right-0 z-[4] flex justify-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === cur ? 22 : 8,
              background: i === cur ? "#D4AF37" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryRail() {
  const navigate = useNavigate();
  const tiles = [
    { key: "tops", label: "Tops & Blouses", img: "/img4.jpg" },
    { key: "pants", label: "Pants & Trousers", img: "/img2.jpg" },
    { key: "ankara", label: "Ankara & Heritage", img: "/heritage1.jpg" },
    { key: "bridal", label: "Bridal & Asoebi", img: "/img5.jpg" },
  ];
  return (
    <div className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl md:text-2xl text-black">
            Shop by Category
          </h2>
          <button
            onClick={() => navigate("/shop")}
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-1"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1 md:grid md:grid-cols-4 md:gap-5">
          {tiles.map((t) => (
            <button
              key={t.key}
              onClick={() => navigate(`/shop?category=${t.key}`)}
              className="group flex-shrink-0 w-28 md:w-auto text-center"
            >
              <div className="relative w-28 h-28 md:w-full md:aspect-square rounded-full md:rounded-2xl overflow-hidden bg-gray-100 mx-auto mb-2.5 ring-1 ring-gray-100">
                <img
                  src={t.img}
                  alt={t.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/300x300/0a0a0a/D4AF37?text=Debby")
                  }
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-800 group-hover:text-gold-600 transition-colors leading-tight">
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrendingNow() {
  const navigate = useNavigate();
  const products = useProducts();
  const items = products.slice(0, 8);
  if (items.length === 0) return null;
  return (
    <div className="py-16 md:py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <R className="flex items-end justify-between mb-8">
          <div>
            <span className="text-gold-400 text-sm uppercase tracking-[0.2em] font-semibold">
              Fresh on the rack
            </span>
            <h2 className="font-serif text-3xl md:text-4xl mt-2 text-black">
              Trending Now
            </h2>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="hidden sm:flex text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors items-center gap-1"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </R>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 md:grid md:grid-cols-4 md:gap-6">
          {items.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/shop/product/${p.id}`)}
              className="group flex-shrink-0 w-[42%] sm:w-[30%] md:w-auto text-left"
            >
              <div
                className="relative overflow-hidden bg-[#f7f7f7] mb-3"
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
                    className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${p.tag === "NEW" ? "bg-black text-white" : p.tag === "BEST" ? "bg-gold-500 text-white" : "bg-red-600 text-white"}`}
                  >
                    {p.tag}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">
                {p.name}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                From ₦{p.price.toLocaleString()}
              </p>
            </button>
          ))}
        </div>
        <button
          onClick={() => navigate("/shop")}
          className="sm:hidden w-full mt-6 border border-black text-black py-3 text-xs uppercase tracking-widest font-semibold hover:bg-black hover:text-white transition-all"
        >
          View All Products
        </button>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="py-20 bg-white border-b border-gray-100" id="about">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <R className="text-center max-w-2xl mx-auto">
          <span className="text-gold-400 text-sm uppercase tracking-[0.2em] font-semibold">
            The Debby Experience
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-5 text-black">
            Luxury craftsmanship,
            <br />
            effortless elegance
          </h2>
          <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-7" />
          <p className="text-gray-600 leading-relaxed text-lg">
            Finest fabrics from around the world, tailored to celebrate
            confidence, culture, and modern femininity.
          </p>
        </R>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: <Scissors className="w-7 h-7" />,
              title: "Luxury grade tailoring",
              desc: "Finest fabrics from around the world, precision cuts",
            },
            {
              icon: <Truck className="w-7 h-7" />,
              title: "Global shipping",
              desc: "Fast delivery nationwide with premium packaging",
            },
            {
              icon: <Award className="w-7 h-7" />,
              title: "Effortless comfort & fit",
              desc: "Satisfaction guarantee, tailored for you",
            },
          ].map((f, i) => (
            <R key={i} className="text-center p-6 hover-lift">
              <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-5 text-gold-400">
                {f.icon}
              </div>
              <h3 className="font-serif text-xl mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </R>
          ))}
        </div>
      </div>
    </div>
  );
}

function About() {
  const navigate = useNavigate();
  return (
    <div className="py-20 bg-gray-50" id="story">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <R className="order-2 lg:order-1">
            <span className="text-gold-400 text-sm uppercase tracking-[0.2em] font-semibold">
              Our Atelier
            </span>
            <h2 className="font-serif text-4xl md:text-5xl mt-2 mb-5">
              About Debby Couture Atelier
            </h2>
            <div className="w-20 h-0.5 bg-gold-400 mb-6" />
            <p className="text-gray-600 leading-relaxed mb-4">
              We are a fashion brand dedicated to creating luxury and premium
              classic outfits for women who appreciate elegance and quality.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our designs blend the richness of local fabrics with refined
              foreign fabrics, delivering timeless pieces that are stylish,
              comfortable, and well-tailored.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Every outfit is thoughtfully crafted to celebrate confidence,
              culture, and modern femininity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/shop")}
                className="px-8 py-3 bg-black text-white font-medium tracking-widest hover:bg-gold-400 hover:text-black transition-colors text-center text-sm"
              >
                SHOP THE COLLECTION
              </button>
              <button
                onClick={() => navigate("/bespoke")}
                className="px-8 py-3 border border-black text-black font-medium tracking-widest hover:bg-black hover:text-white transition-colors text-center text-sm"
              >
                BESPOKE SERVICES
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
    </div>
  );
}

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
    { img: "/img1.jpg", title: "Gold & Glitz", desc: "Premium accessories" },
  ];
  return (
    <div className="py-20 bg-white" id="shop">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <R className="text-center mb-12">
          <span className="text-gold-400 text-sm uppercase tracking-[0.2em]">
            curated for elegance
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mt-2">
            Curated Collections
          </h2>
          <div className="w-20 h-0.5 bg-gold-400 mx-auto mt-4" />
        </R>
        <div className="grid md:grid-cols-3 gap-8">
          {cols.map((c, i) => (
            <R
              key={i}
              className="group relative h-[480px] overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-serif text-3xl mb-1">{c.title}</h3>
                <p className="text-gray-200 text-sm mb-2">{c.desc}</p>
                <span className="inline-block border-b border-gold-400 pb-1 text-gold-400 uppercase tracking-widest text-xs">
                  Explore
                </span>
              </div>
            </R>
          ))}
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      showToast("Please fill in all required fields correctly.", "error");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      showToast("Delivered! We'll get back to you soon.");
    }, 800);
  }

  return (
    <div className="py-24 bg-gray-50" id="contact">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <R className="text-center mb-12">
          <span className="text-gold-400 text-sm uppercase tracking-[0.2em]">
            get in touch
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mt-2">
            We're Here to Help
          </h2>
          <div className="w-20 h-0.5 bg-gold-400 mx-auto mt-4" />
          <p className="text-gray-600 mt-5">
            Have a question or need styling advice? Our team is here for you.
          </p>
        </R>
        <R className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            {
              icon: <MapPin className="w-5 h-5 text-gold-400" />,
              title: "Visit Our Boutique",
              val: ADDRESS,
            },
            {
              icon: <Phone className="w-5 h-5 text-gold-400" />,
              title: "Call Us",
              val: PHONE,
            },
            {
              icon: <Mail className="w-5 h-5 text-gold-400" />,
              title: "Email Us",
              val: EMAIL,
            },
            {
              icon: <MessageCircle className="w-5 h-5 text-gold-400" />,
              title: "Send us DM",
              val: PHONE,
            },
          ].map(({ icon, title, val }, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-4 shadow-sm hover:shadow-md transition hover-lift"
            >
              <div className="w-12 h-12 rounded-full bg-gold-400/20 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-black font-bold text-sm mb-1">{title}</p>
                <p className="text-gray-600 text-xs">{val}</p>
              </div>
            </div>
          ))}
        </R>
        <R>
          <form
            onSubmit={submit}
            className="space-y-6 bg-white p-8 rounded-2xl shadow-md border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg transition"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg transition"
                  placeholder="youremail@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition"
                placeholder="+234 806 616 3249"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition"
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition resize-none"
                placeholder="Tell us how we can help you..."
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                required
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gold-400 hover:text-black transition-all shadow-lg rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {sending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
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
                  Delivering...
                </>
              ) : (
                "Send Message"
              )}
            </button>
            <p className="text-xs text-gray-500 text-center">
              * Required fields
            </p>
          </form>
        </R>
      </div>
    </div>
  );
}

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
