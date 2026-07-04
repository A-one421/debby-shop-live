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
  SlidersHorizontal,
} from "lucide-react";
import { useCart } from "./CartContext";
import SizeGuide from "./SizeGuide";
import { CATEGORIES } from "./data";
import { useProducts } from "./useProducts";
import { showToast } from "./Toast";

const GOLD = "#C9A84C";

/* ════════════════════════════════════════════
   IMAGE SLIDER  (swipe + arrows, dot indicators)
════════════════════════════════════════════ */
function ImageSlider({ images, alt }) {
  const [idx, setIdx] = useState(0);
  const startX = useRef(null);

  useEffect(() => setIdx(0), [images.join(",")]);

  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="relative select-none">
      {/* Main frame */}
      <div
        className="relative overflow-hidden bg-[#f5f5f5]"
        style={{ aspectRatio: "3/4" }}
        onTouchStart={(e) => (startX.current = e.changedTouches[0].clientX)}
        onTouchEnd={(e) => {
          if (startX.current === null) return;
          const diff = startX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 35) diff > 0 ? next() : prev();
          startX.current = null;
        }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${alt} — view ${i + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-400"
            style={{ opacity: i === idx ? 1 : 0 }}
            onError={(e) =>
              (e.target.src =
                "https://placehold.co/400x600/f0ede8/aaa?text=Debby")
            }
          />
        ))}

        {/* Arrow buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="flex-shrink-0 w-16 h-20 overflow-hidden bg-gray-100 transition-all"
              style={{
                outline:
                  i === idx ? `2px solid ${GOLD}` : "2px solid transparent",
                outlineOffset: "2px",
              }}
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/80x100/f0ede8/aaa?text=.")
                }
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   STYLE GRID  (variants of one product)
════════════════════════════════════════════ */
function StyleGrid({ product, onSelect, onBack }) {
  useEffect(() => window.scrollTo(0, 0), [product.id]);

  const variants = product.variants?.length
    ? product.variants
    : [{ ...product }];

  return (
    <div className="animate-fade-in">
      <div className="px-4 sm:px-8 pt-8 pb-6 flex items-center gap-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <span className="text-gray-200">|</span>
        <span className="font-serif text-lg text-gray-900">{product.name}</span>
      </div>

      <div className="px-4 sm:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelect(v, product)}
              className="group relative overflow-hidden bg-[#f5f5f5] focus:outline-none"
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-all duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-xs font-medium">{v.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   VARIANT DETAIL  (PDP: image + order panel)
════════════════════════════════════════════ */
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
    showToast(`${variant.name} added to bag ✓`);
  }

  const siblings = (parent?.variants || [])
    .filter((v) => v.id !== variant.id)
    .slice(0, 4);
  const allProducts = useProducts();
  const related = allProducts
    .filter((p) => p.id !== parent?.id && p.category === parent?.category)
    .slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-8 pt-8 pb-4 flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400 flex-wrap">
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

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-36 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Image ── */}
          <ImageSlider images={images} alt={variant.name} />

          {/* ── Info panel ── */}
          <div className="flex flex-col pt-1">
            <h1 className="font-serif text-2xl md:text-3xl text-gray-900 leading-snug mb-1">
              {variant.name}
            </h1>
            <p className="text-xl font-semibold text-gray-900 mb-2">
              ₦{variant.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed mb-7">
              {variant.description ||
                "Premium quality fashion, crafted with care."}
            </p>

            {/* Size selector */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
                  Select Size
                </span>
                <button
                  onClick={() => setShowSG(true)}
                  className="text-[11px] text-gray-400 hover:text-black transition-colors flex items-center gap-1"
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

            {/* Desktop: inline qty + add */}
            <div className="hidden md:flex gap-3 mb-4">
              <div className="flex items-center border border-gray-300">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-gray-500 hover:text-black text-lg leading-none transition-colors"
                >
                  −
                </button>
                <span className="px-4 text-sm font-medium text-gray-900">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-3 text-gray-500 hover:text-black text-lg leading-none transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 bg-black text-white text-xs font-semibold uppercase tracking-widest py-3 hover:bg-[#C9A84C] transition-all duration-300"
              >
                Add to Bag
              </button>
            </div>

            {/* WhatsApp order */}
            <button
              onClick={() => {
                const msg = `Hi! I'd like to order:\n*${variant.name}*\nSize: ${size || "TBD"}, Qty: ${qty}\nPrice: ₦${(variant.price * qty).toLocaleString()}`;
                window.open(
                  `https://wa.me/2348066163249?text=${encodeURIComponent(msg)}`,
                  "_blank",
                );
              }}
              className="w-full border border-gray-200 text-gray-700 text-xs font-semibold uppercase tracking-widest py-3 hover:border-black hover:text-black transition-all duration-300 flex items-center justify-center gap-2 mb-5"
            >
              <MessageCircle className="h-4 w-4" style={{ color: "#25D366" }} />
              Order via WhatsApp
            </button>

            {/* Wishlist toggle */}
            <button
              onClick={() => {
                const added = toggleWishlist(variant);
                showToast(
                  added ? "Saved to wishlist ♥" : "Removed from wishlist",
                );
              }}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors mb-8 w-fit"
            >
              <Heart
                className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`}
              />
              {saved ? "Saved to wishlist" : "Save to wishlist"}
            </button>

            {/* Accordion info */}
            <div className="border-t border-gray-100 divide-y divide-gray-100">
              {[
                [
                  "Description",
                  variant.description ||
                    "Premium quality fashion item crafted with care and precision.",
                ],
                [
                  "Fabric & Care",
                  "95% Polyester, 5% Elastane. Dry clean recommended. Iron on low heat.",
                ],
                [
                  "Shipping & Returns",
                  "Free shipping on all orders. Returns within 14 days in original unworn condition.",
                ],
              ].map(([title, content]) => (
                <div key={title}>
                  <button
                    className="flex justify-between items-center w-full text-left py-4 text-[11px] font-bold uppercase tracking-widest text-gray-900"
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

        {/* ── More from this style ── */}
        {siblings.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-100">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-8">
              More from this style
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {siblings.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onRelatedClick(v, parent)}
                  className="group relative overflow-hidden bg-[#f5f5f5] focus:outline-none"
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
                    <p className="text-white/75 text-xs">
                      ₦{v.price.toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── You may also like ── */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-100">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-8">
              You may also like
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {related.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onRelatedClick(null, p, true)}
                  className="group text-left focus:outline-none"
                >
                  <div
                    className="relative overflow-hidden bg-[#f5f5f5] mb-3"
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
                  <p className="text-sm text-gray-400 mt-0.5">
                    From ₦{p.price.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showSG && <SizeGuide onClose={() => setShowSG(false)} />}

      {/* ── Mobile sticky add-to-bag bar (above bottom nav) ── */}
      <div
        className="md:hidden fixed inset-x-0 z-40 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3"
        style={{ bottom: "calc(64px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center border border-gray-300 flex-shrink-0">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2.5 text-gray-500 text-base leading-none"
          >
            −
          </button>
          <span className="px-3 text-sm font-medium text-gray-900">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-2.5 text-gray-500 text-base leading-none"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 bg-black text-white text-[11px] font-bold uppercase tracking-[0.18em] py-3.5 hover:bg-[#C9A84C] transition-all duration-300"
        >
          {size ? "Add to Bag" : "Select a Size"}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   COLLECTION GRID  (main shop grid)
════════════════════════════════════════════ */
function CollectionGrid({ onSelect }) {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [category, setCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [sort, setSort] = useState("newest");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetClosing, setSheetClosing] = useState(false);
  const { toggleWishlist, isInWishlist } = useCart();

  function closeSheet() {
    setSheetClosing(true);
    setTimeout(() => {
      setSheetOpen(false);
      setSheetClosing(false);
    }, 230);
  }

  const allProducts = useProducts();

  /* Build category options dynamically (so admin-added cats appear too) */
  const categoryOptions = useMemo(() => {
    const known = new Map(CATEGORIES.map((c) => [c.key, c.label]));
    const seen = new Map();
    allProducts.forEach((p) => {
      if (!p.category || seen.has(p.category)) return;
      seen.set(
        p.category,
        known.get(p.category) ||
          p.category.charAt(0).toUpperCase() + p.category.slice(1),
      );
    });
    return [
      { key: "all", label: "All Products" },
      ...Array.from(seen, ([key, label]) => ({ key, label })),
    ];
  }, [allProducts]);

  const filtered = useMemo(() => {
    let arr = [...allProducts];
    if (category !== "all") arr = arr.filter((p) => p.category === category);
    if (q) {
      const ql = q.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(ql) ||
          (p.collection || "").toLowerCase().includes(ql),
      );
    }
    if (sort === "price-low") arr.sort((a, b) => a.price - b.price);
    if (sort === "price-high") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [allProducts, category, sort, q]);

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="px-4 sm:px-8 pt-10 pb-6 border-b border-gray-100">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-1">
          Debby Haute Couture
        </p>
        <div className="flex items-end justify-between">
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900">
            The Collection
          </h1>
          <span className="text-xs text-gray-400 hidden sm:block">
            {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-52 flex-shrink-0 px-8 pt-10">
          <div className="sticky top-24 space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                Category
              </p>
              <ul className="space-y-2.5">
                {categoryOptions.map((c) => (
                  <li key={c.key}>
                    <button
                      onClick={() => setCategory(c.key)}
                      className={`text-sm transition-colors text-left w-full ${category === c.key ? "text-black font-semibold" : "text-gray-400 hover:text-black"}`}
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                Sort by
              </p>
              <ul className="space-y-2.5">
                {[
                  ["newest", "Newest"],
                  ["price-low", "Price: Low–High"],
                  ["price-high", "Price: High–Low"],
                ].map(([val, label]) => (
                  <li key={val}>
                    <button
                      onClick={() => setSort(val)}
                      className={`text-sm transition-colors text-left w-full ${sort === val ? "text-black font-semibold" : "text-gray-400 hover:text-black"}`}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Mobile: sticky chip toolbar */}
        <div className="md:hidden sticky top-16 z-20 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar flex-1">
              {categoryOptions.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={`chip ${category === c.key ? "active" : ""}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSheetOpen(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-300 rounded-full text-[11px] font-medium uppercase tracking-wide"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Sort
            </button>
          </div>
        </div>

        {/* Mobile: sort bottom sheet */}
        {sheetOpen && (
          <div className="md:hidden fixed inset-0 z-[60]">
            <div
              className={`absolute inset-0 bg-black/50 sheet-overlay ${sheetClosing ? "closing" : ""}`}
              onClick={closeSheet}
            />
            <div
              className={`absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[75dvh] overflow-y-auto sheet-panel ${sheetClosing ? "closing" : ""}`}
            >
              <div className="sheet-handle" />
              <div className="px-6 pb-8 pt-1">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif text-lg">Sort & Filter</h3>
                  <button onClick={closeSheet} className="p-1.5 text-gray-400">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Category
                </p>
                <div className="flex flex-wrap gap-2 mb-7">
                  {categoryOptions.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setCategory(c.key)}
                      className={`chip ${category === c.key ? "active" : ""}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                  Sort by
                </p>
                <div className="space-y-0 mb-8">
                  {[
                    ["newest", "Newest"],
                    ["price-low", "Price: Low–High"],
                    ["price-high", "Price: High–Low"],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setSort(val)}
                      className="w-full flex items-center justify-between py-3.5 text-sm border-b border-gray-100"
                    >
                      <span
                        className={
                          sort === val
                            ? "font-semibold text-black"
                            : "text-gray-500"
                        }
                      >
                        {label}
                      </span>
                      {sort === val && (
                        <Check className="h-4 w-4" style={{ color: GOLD }} />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={closeSheet}
                  className="w-full bg-black text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#C9A84C] transition-all"
                >
                  Show {filtered.length} Result
                  {filtered.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product grid */}
        <main className="flex-1 px-4 sm:px-6 pt-8 pb-28">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-200" />
              <p>No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {filtered.map((p) => {
                const saved = isInWishlist(p.id);
                return (
                  <div key={p.id} className="group relative">
                    <button
                      onClick={() => onSelect(p)}
                      className="block w-full text-left focus:outline-none"
                    >
                      <div
                        className="relative overflow-hidden bg-[#f5f5f5]"
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
                            className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5"
                            style={{
                              background:
                                p.tag === "NEW"
                                  ? "#0a0a0a"
                                  : p.tag === "BEST"
                                    ? GOLD
                                    : "#dc2626",
                              color: "#fff",
                            }}
                          >
                            {p.tag}
                          </span>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/6 transition-all duration-300" />
                      </div>
                      <div className="py-3 px-0.5">
                        <p className="text-sm font-medium text-gray-900 leading-tight">
                          {p.name}
                        </p>
                        <p className="text-sm text-gray-400 mt-0.5">
                          From ₦{p.price.toLocaleString()}
                        </p>
                      </div>
                    </button>

                    {/* Quick wishlist toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const added = toggleWishlist(p);
                        showToast(added ? "Saved ♥" : "Removed");
                      }}
                      aria-label={
                        saved ? "Remove from wishlist" : "Save to wishlist"
                      }
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   CART
════════════════════════════════════════════ */
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
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-12 pb-40 md:pb-16 animate-fade-in">
      <h1 className="font-serif text-2xl text-gray-900 mb-1">Your Bag</h1>
      <p className="text-sm text-gray-400 mb-10">
        {cart.reduce((s, i) => s + i.quantity, 0)} item
        {cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
      </p>

      {cart.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingBag className="h-14 w-14 text-gray-200 mx-auto mb-5" />
          <p className="text-gray-400 mb-6 text-sm">Your bag is empty</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-black text-white px-8 py-3.5 text-[11px] uppercase tracking-[0.18em] font-semibold hover:bg-[#C9A84C] transition-all"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <>
          {/* Item list */}
          <div className="border-t border-gray-100 divide-y divide-gray-100 mb-10">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-5 py-5">
                <div className="w-20 h-28 flex-shrink-0 bg-gray-100 overflow-hidden">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/200x300/f0ede8/aaa")
                    }
                    alt={item.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-0.5 gap-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <span className="text-sm text-gray-900 flex-shrink-0">
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
                        className="px-3 py-1.5 text-gray-400 hover:text-black transition-colors"
                      >
                        −
                      </button>
                      <span className="px-3 text-xs font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.id, item.size, item.color, 1)
                        }
                        className="px-3 py-1.5 text-gray-400 hover:text-black transition-colors"
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

          {/* Email capture */}
          <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">
              Email for payment receipt
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:border-gold-400 transition-colors"
              />
              <button
                onClick={saveEmail}
                className="bg-black text-white text-xs px-4 py-2 rounded hover:bg-[#C9A84C] transition-all"
              >
                Save
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="space-y-3 mb-8">
            {[
              ["Subtotal", `₦${subtotal.toLocaleString()}`],
              ["Shipping", "Free"],
              ["Tax (8%)", `₦${tax.toFixed(2)}`],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-gray-400">{l}</span>
                <span
                  className={
                    v === "Free"
                      ? "text-green-600 font-medium"
                      : "text-gray-900"
                  }
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

          {/* Desktop checkout buttons */}
          <div className="hidden md:block space-y-3">
            <button
              onClick={() => payWithPaystack(email)}
              className="w-full bg-black text-white py-4 text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#C9A84C] transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4" /> Pay with Paystack
            </button>
            <button
              onClick={checkoutWhatsApp}
              className="w-full border border-black text-black py-4 text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
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

          {/* Mobile sticky checkout bar */}
          <div
            className="md:hidden fixed inset-x-0 z-40 bg-white border-t border-gray-100 px-4 pt-3 pb-2"
            style={{ bottom: "calc(64px + env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">
                Total
              </span>
              <span className="text-base font-bold text-gray-900">
                ₦{total.toLocaleString()}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={checkoutWhatsApp}
                aria-label="Order via WhatsApp"
                className="flex-shrink-0 h-12 w-12 border border-gray-300 text-gray-700 flex items-center justify-center hover:border-black transition-all"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => payWithPaystack(email)}
                className="flex-1 bg-black text-white h-12 text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-[#C9A84C] transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="h-4 w-4" /> Pay with Paystack
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   FAVORITES / WISHLIST
════════════════════════════════════════════ */
function FavoritesView({ onOpenProduct }) {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useCart();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 pb-24 animate-fade-in">
      <h1 className="font-serif text-2xl text-gray-900 mb-1">Wishlist</h1>
      <p className="text-sm text-gray-400 mb-10">
        {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
      </p>

      {wishlist.length === 0 ? (
        <div className="text-center py-24">
          <Heart className="h-14 w-14 text-gray-200 mx-auto mb-5" />
          <p className="text-gray-400 mb-6 text-sm">Nothing saved yet</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-black text-white px-8 py-3.5 text-[11px] uppercase tracking-[0.18em] font-semibold hover:bg-[#C9A84C] transition-all"
          >
            Browse Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {wishlist.map((p) => (
            <div key={p.id} className="group">
              <div
                className="relative overflow-hidden bg-[#f5f5f5] mb-3"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={p.image}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) =>
                    (e.target.src =
                      "https://placehold.co/400x600/f0ede8/aaa?text=Debby")
                  }
                  alt={p.name}
                />
                <button
                  onClick={() => {
                    toggleWishlist(p);
                    showToast("Removed");
                  }}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <X className="h-3.5 w-3.5 text-gray-600" />
                </button>
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">
                {p.name}
              </p>
              <p className="text-sm text-gray-400 mb-3">
                ₦{p.price.toLocaleString()}
              </p>
              <button
                onClick={() => onOpenProduct(p)}
                className="w-full border border-black text-[11px] uppercase tracking-[0.18em] font-semibold py-2.5 hover:bg-black hover:text-white transition-all"
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

/* ════════════════════════════════════════════
   ROOT — state machine router
════════════════════════════════════════════ */
export default function ShopPage({ initialView }) {
  const navigate = useNavigate();
  const [view, setView] = useState("collection");
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeVariant, setActiveVariant] = useState(null);

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
          if (isNewProduct) goToStyles(product);
          else goToDetail(variant, product);
        }}
      />
    );
  }

  if (view === "styles" && activeProduct) {
    return (
      <StyleGrid
        product={activeProduct}
        onSelect={goToDetail}
        onBack={goToCollection}
      />
    );
  }

  return <CollectionGrid onSelect={goToStyles} />;
}
