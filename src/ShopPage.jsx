import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Share2,
  Star,
  StarHalf,
  Ruler,
  ChevronDown,
  ChevronUp,
  X,
  CreditCard,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Check,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "./CartContext";
import SizeGuide from "./SizeGuide";
import { CATEGORIES } from "./data";
import { useProducts } from "./useProducts";
import { showToast } from "./Toast";

/* ─── helpers ─── */
const GOLD = "#C9A84C";

/* ══════════════════════════════════════════════
   IMAGE SLIDER  — swipe + arrow, same outfit
══════════════════════════════════════════════ */
function ImageSlider({ images, alt }) {
  const [idx, setIdx] = useState(0);
  const startX = useRef(null);

  useEffect(() => setIdx(0), [images.join()]);

  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="relative">
      {/* Main frame */}
      <div
        className="relative overflow-hidden bg-[#f7f7f7] cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: "3/4" }}
        onTouchStart={(e) => (startX.current = e.changedTouches[0].clientX)}
        onTouchEnd={(e) => {
          const diff = startX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 35) diff > 0 ? next() : prev();
        }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${alt} view ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              i === idx ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/600x800/f0ede8/aaa?text=Debby")
            }
          />
        ))}

        {/* Side arrows — only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-black" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow transition-all"
            >
              <ChevronRight className="h-4 w-4 text-black" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`flex-1 aspect-square overflow-hidden border-b-2 transition-all duration-200 ${
                i === idx
                  ? "border-black opacity-100"
                  : "border-transparent opacity-40 hover:opacity-70"
              }`}
            >
              <img
                src={src}
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/120x160/f0ede8/aaa?text=+")
                }
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   STYLE GRID  — plain image tiles, no labels
   (shown after clicking a category product)
══════════════════════════════════════════════ */
function StyleGrid({ product, onSelect, onBack }) {
  useEffect(() => window.scrollTo(0, 0), [product.id]);

  const variants = product.variants?.length
    ? product.variants
    : [{ ...product }];

  return (
    <div className="animate-fade-in">
      {/* Minimal header */}
      <div className="px-4 sm:px-8 pt-8 pb-6 flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <span className="text-gray-200">|</span>
        <span className="font-serif text-lg text-gray-900">{product.name}</span>
      </div>

      {/* Pure image grid — no badges, no counts */}
      <div className="px-4 sm:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelect(v, product)}
              className="group relative overflow-hidden bg-[#f7f7f7] focus:outline-none"
              style={{ aspectRatio: "3/4" }}
            >
              <img
                src={v.image || (v.images && v.images[0])}
                alt={v.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/400x600/f0ede8/aaa?text=Debby")
                }
              />
              {/* Hover overlay — just a subtle darken */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   VARIANT DETAIL — slider + order panel
══════════════════════════════════════════════ */
function VariantDetail({
  variant,
  parent,
  onBack,
  onBackToStyles,
  onRelatedClick,
}) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [showSG, setShowSG] = useState(false);
  const [open, setOpen] = useState(null);
  const saved = isInWishlist(variant.id);

  useEffect(() => {
    setSize("");
    setQty(1);
    window.scrollTo(0, 0);
  }, [variant.id]);

  const images = (
    variant.images?.length ? variant.images : [variant.image]
  ).filter(Boolean);

  function handleAdd() {
    if (!size) {
      showToast("Please select a size", "error");
      return;
    }
    addToCart(variant, size, "", qty);
    showToast(`${variant.name} added to cart`);
  }

  // Related: other variants of same parent
  const siblings = (parent?.variants || [])
    .filter((v) => v.id !== variant.id)
    .slice(0, 4);
  // Also similar products (same category, different parent)
  const allProducts = useProducts();
  const related = allProducts
    .filter((p) => p.id !== parent?.id && p.category === parent?.category)
    .slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb nav */}
      <div className="px-4 sm:px-8 pt-8 pb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
        <button onClick={onBack} className="hover:text-black transition-colors">
          Shop
        </button>
        <ChevronRight className="h-3 w-3" />
        <button
          onClick={onBackToStyles}
          className="hover:text-black transition-colors"
        >
          {parent?.name}
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-black">{variant.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Left: image slider ── */}
          <div>
            <ImageSlider images={images} alt={variant.name} />
          </div>

          {/* ── Right: details ── */}
          <div className="flex flex-col pt-2">
            <h1 className="font-serif text-2xl md:text-3xl text-gray-900 leading-snug mb-1">
              {variant.name}
            </h1>

            <p className="text-xl font-medium text-gray-900 mb-6">
              ₦{variant.price.toLocaleString()}
            </p>

            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              {variant.description ||
                "Premium quality fashion, crafted with care."}
            </p>

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-900">
                  Size
                </span>
                <button
                  onClick={() => setShowSG(true)}
                  className="text-xs text-gray-400 hover:text-black transition-colors flex items-center gap-1"
                >
                  <Ruler className="h-3 w-3" /> Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(variant.sizes || ["XS", "S", "M", "L", "XL"]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[48px] px-3 py-2.5 text-xs font-medium border transition-all ${
                      s === size
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-700 hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add */}
            <div className="flex gap-3 mb-4">
              <div className="flex items-center border border-gray-300 bg-white">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-gray-500 hover:text-black transition-colors text-lg leading-none"
                >
                  −
                </button>
                <span className="px-4 text-sm font-medium text-gray-900">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-3 text-gray-500 hover:text-black transition-colors text-lg leading-none"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 bg-black text-white text-xs font-semibold uppercase tracking-widest py-3 hover:bg-[#C9A84C] transition-all duration-300"
              >
                Add to Cart
              </button>
            </div>

            {/* WhatsApp */}
            <button
              onClick={() => {
                const msg = `Hi! I'd like to order:\n*${variant.name}*\nSize: ${size || "TBD"}, Qty: ${qty}\nPrice: ₦${(variant.price * qty).toLocaleString()}`;
                window.open(
                  `https://wa.me/2348066163249?text=${encodeURIComponent(msg)}`,
                  "_blank",
                );
              }}
              className="w-full border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-widest py-3 hover:border-black hover:text-black transition-all duration-300 flex items-center justify-center gap-2 mb-8"
            >
              <MessageCircle className="h-4 w-4" style={{ color: "#25D366" }} />{" "}
              Order via WhatsApp
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                const added = toggleWishlist(variant);
                showToast(added ? "Saved" : "Removed");
              }}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors mb-8 w-fit"
            >
              <Heart
                className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`}
              />
              {saved ? "Saved to wishlist" : "Save to wishlist"}
            </button>

            {/* Accordions */}
            <div className="border-t border-gray-100 divide-y divide-gray-100">
              {[
                [
                  "Description",
                  variant.description ||
                    "Premium quality fashion item crafted with care and precision.",
                ],
                [
                  "Fabric & Care",
                  "95% Polyester, 5% Elastane. Dry clean only. Iron on low heat.",
                ],
                [
                  "Shipping & Returns",
                  "Free shipping on all orders. Returns accepted within 14 days in original unworn condition.",
                ],
              ].map(([title, content]) => (
                <div key={title}>
                  <button
                    className="flex justify-between items-center w-full text-left py-4 text-xs font-semibold uppercase tracking-widest text-gray-900"
                    onClick={() => setOpen(open === title ? null : title)}
                  >
                    {title}
                    {open === title ? (
                      <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                    )}
                  </button>
                  {open === title && (
                    <div className="pb-4 text-sm text-gray-500 leading-relaxed">
                      {content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Other styles in this collection ── */}
        {siblings.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-100">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-8">
              More from this style
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {siblings.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onRelatedClick(v, parent)}
                  className="group relative overflow-hidden bg-[#f7f7f7] focus:outline-none"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={v.image || v.images?.[0]}
                    alt={v.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) =>
                      (e.target.src =
                        "https://placehold.co/400x600/f0ede8/aaa?text=Debby")
                    }
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-xs font-medium">{v.name}</p>
                    <p className="text-white/80 text-xs">
                      ₦{v.price.toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-100">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-8">
              You may also like
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onRelatedClick(null, p, true)}
                  className="group text-left focus:outline-none"
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
                  </div>
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    From ₦{p.price.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showSG && <SizeGuide onClose={() => setShowSG(false)} />}
    </div>
  );
}

/* ══════════════════════════════════════════════
   COLLECTION GRID  — category cards
══════════════════════════════════════════════ */
function CollectionGrid({ onSelect }) {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const allProducts = useProducts();
  const filtered = useMemo(() => {
    let arr = [...allProducts];
    if (category !== "all") arr = arr.filter((p) => p.category === category);
    if (q) {
      const ql = q.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(ql) ||
          p.collection.toLowerCase().includes(ql),
      );
    }
    if (sort === "price-low") arr.sort((a, b) => a.price - b.price);
    if (sort === "price-high") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [allProducts, category, sort, q]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-4 sm:px-8 pt-10 pb-8 border-b border-gray-100">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
          Debby Haute Couture
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900">
          The Collection
        </h1>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="hidden md:block w-48 flex-shrink-0 px-8 pt-10">
          <div className="sticky top-24">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
              Filter
            </p>
            <ul className="space-y-3">
              {CATEGORIES.map((c) => (
                <li
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`text-sm cursor-pointer transition-colors ${
                    category === c.key
                      ? "text-black font-semibold"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  {c.label}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                Sort
              </p>
              <ul className="space-y-3">
                {[
                  ["newest", "Newest"],
                  ["price-low", "Price: Low–High"],
                  ["price-high", "Price: High–Low"],
                ].map(([val, label]) => (
                  <li
                    key={val}
                    onClick={() => setSort(val)}
                    className={`text-sm cursor-pointer transition-colors ${sort === val ? "text-black font-semibold" : "text-gray-400 hover:text-black"}`}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Mobile filter chips */}
        <div className="md:hidden flex gap-2 overflow-x-auto px-4 py-4 hide-scrollbar border-b border-gray-100">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider whitespace-nowrap border transition-all flex-shrink-0 ${
                category === c.key
                  ? "bg-black text-white border-black"
                  : "border-gray-300 text-gray-600 hover:border-black"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 px-4 sm:px-8 pt-10 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="group relative overflow-hidden bg-[#f7f7f7] focus:outline-none text-left"
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden"
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
                      className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${
                        p.tag === "NEW"
                          ? "bg-black text-white"
                          : p.tag === "BEST"
                            ? "bg-[#C9A84C] text-white"
                            : "bg-red-600 text-white"
                      }`}
                    >
                      {p.tag}
                    </span>
                  )}
                </div>
                {/* Caption */}
                <div className="py-3 px-1">
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    From ₦{p.price.toLocaleString()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CART
══════════════════════════════════════════════ */
function CartView() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQty,
    subtotal,
    tax,
    total,
    checkoutWhatsApp,
    payWithPaystack,
  } = useCart();
  const [email, setEmail] = useState(
    () => localStorage.getItem("debby_customer_email") || "",
  );

  function saveEmail() {
    if (!email.includes("@")) {
      showToast("Enter a valid email", "error");
      return;
    }
    localStorage.setItem("debby_customer_email", email);
    showToast("Email saved ✓");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-16 animate-fade-in">
      <h1 className="font-serif text-2xl text-gray-900 mb-1">Your Bag</h1>
      <p className="text-sm text-gray-400 mb-10">
        {cart.reduce((s, i) => s + i.quantity, 0)} items
      </p>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">Your bag is empty</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#C9A84C] transition-all"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <>
          <div className="border-t border-gray-100 divide-y divide-gray-100 mb-10">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-5 py-6">
                <div className="w-20 h-28 flex-shrink-0 bg-gray-100 overflow-hidden">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/200x300/f0ede8/aaa")
                    }
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <span className="text-sm text-gray-900">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Size: {item.size}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200">
                      <button
                        onClick={() =>
                          updateQty(item.id, item.size, item.color, -1)
                        }
                        className="px-3 py-1.5 text-gray-400 hover:text-black"
                      >
                        −
                      </button>
                      <span className="px-3 text-xs text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.id, item.size, item.color, 1)
                        }
                        className="px-3 py-1.5 text-gray-400 hover:text-black"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.id, item.size, item.color);
                        showToast("Removed");
                      }}
                      className="text-xs text-gray-400 hover:text-black transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="bg-gray-50 p-4 mb-8">
            <p className="text-xs text-gray-500 mb-2">
              Email for payment receipt
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-gray-200 px-3 py-2 text-sm mb-2"
            />
            <button
              onClick={saveEmail}
              className="text-xs bg-black text-white px-4 py-2"
            >
              Save
            </button>
          </div>

          {/* Totals */}
          <div className="space-y-3 mb-8">
            {[
              ["Subtotal", `₦${subtotal.toLocaleString()}`],
              ["Shipping", "Free"],
              ["Tax (8%)", `₦${tax.toFixed(2)}`],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-gray-400">{l}</span>
                <span
                  className={v === "Free" ? "text-green-600" : "text-gray-900"}
                >
                  {v}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-base font-semibold pt-4 border-t border-gray-100">
              <span>Total</span>
              <span>₦{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => payWithPaystack(email)}
              className="w-full bg-black text-white py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#C9A84C] transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4" /> Pay with Paystack
            </button>
            <button
              onClick={checkoutWhatsApp}
              className="w-full border border-black text-black py-4 text-xs font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4" /> Order via WhatsApp
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="w-full text-center text-xs text-gray-400 hover:text-black transition-colors pt-2"
            >
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   FAVORITES
══════════════════════════════════════════════ */
function FavoritesView({ onOpenProduct }) {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useCart();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 animate-fade-in">
      <h1 className="font-serif text-2xl text-gray-900 mb-1">Wishlist</h1>
      <p className="text-sm text-gray-400 mb-10">
        {wishlist.length} items saved
      </p>
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">Nothing saved yet</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#C9A84C] transition-all"
          >
            Browse Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wishlist.map((p) => (
            <div key={p.id} className="group">
              <div
                className="relative overflow-hidden bg-gray-100 mb-3"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={p.image}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/400x600/f0ede8/aaa?text=Debby")
                  }
                />
                <button
                  onClick={() => {
                    toggleWishlist(p);
                    showToast("Removed");
                  }}
                  className="absolute top-2 right-2 bg-white p-1.5 rounded-full"
                >
                  <X className="h-3.5 w-3.5 text-gray-600" />
                </button>
              </div>
              <p className="text-sm font-medium text-gray-900">{p.name}</p>
              <p className="text-sm text-gray-500 mb-3">
                ₦{p.price.toLocaleString()}
              </p>
              <button
                onClick={() => onOpenProduct(p)}
                className="w-full border border-black text-xs uppercase tracking-widest font-semibold py-2.5 hover:bg-black hover:text-white transition-all"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ROOT — state machine: collection → styles → detail
══════════════════════════════════════════════ */
export default function ShopPage({ initialView }) {
  const navigate = useNavigate();

  // "collection" | "styles" | "detail"
  const [view, setView] = useState("collection");
  const [activeProduct, setActiveProduct] = useState(null); // parent product
  const [activeVariant, setActiveVariant] = useState(null); // chosen style

  function goToStyles(product) {
    setActiveProduct(product);
    setView("styles");
    window.scrollTo(0, 0);
  }

  function goToDetail(variant, parent) {
    setActiveVariant(variant);
    if (parent) setActiveProduct(parent);
    setView("detail");
    window.scrollTo(0, 0);
  }

  function goToCollection() {
    setView("collection");
    setActiveProduct(null);
    setActiveVariant(null);
    navigate("/shop");
  }

  // Special routes
  if (initialView === "cart") return <CartView />;
  if (initialView === "favorites")
    return <FavoritesView onOpenProduct={goToStyles} />;

  if (view === "detail" && activeVariant) {
    return (
      <VariantDetail
        variant={activeVariant}
        parent={activeProduct}
        onBack={goToCollection}
        onBackToStyles={() => {
          setView("styles");
          setActiveVariant(null);
          window.scrollTo(0, 0);
        }}
        onRelatedClick={(variant, product, isNewProduct) => {
          if (isNewProduct) {
            goToStyles(product);
          } else {
            goToDetail(variant, product);
          }
        }}
      />
    );
  }

  if (view === "styles" && activeProduct) {
    return (
      <StyleGrid
        product={activeProduct}
        onSelect={(variant, parent) => goToDetail(variant, parent)}
        onBack={goToCollection}
      />
    );
  }

  return <CollectionGrid onSelect={goToStyles} />;
}
