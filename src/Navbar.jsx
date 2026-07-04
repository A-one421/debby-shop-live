import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Share2,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Phone,
  Instagram,
} from "lucide-react";
import { useCart } from "./CartContext";
import { PHONE } from "./data";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Bespoke", path: "/bespoke" },
];

export default function Navbar() {
  const { cartCount, wishlistCount } = useCart();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerClosing, setDrawerClosing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /* lock body scroll while drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const goTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const share = () => {
    if (navigator.share)
      navigator.share({
        title: "DEBBY HAUTE COUTURE",
        url: window.location.href,
      });
    else navigator.clipboard?.writeText(window.location.href);
  };

  const runSearch = (val) => {
    const q = val.trim();
    if (q) {
      navigate(`/shop?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    }
  };

  function openDrawer() {
    setDrawerOpen(true);
    setDrawerClosing(false);
  }
  function closeDrawer() {
    setDrawerClosing(true);
    setTimeout(() => {
      setDrawerOpen(false);
      setDrawerClosing(false);
    }, 240);
  }

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <>
      {/* ── Promo strip ── */}
      <div className="bg-black text-white text-center text-[11px] tracking-wide py-[9px] px-4">
        Free delivery on orders over{" "}
        <span style={{ color: "#D4AF37" }}>₦100,000</span>
        <span className="hidden sm:inline">
          &nbsp;•&nbsp; Bespoke consultations now open
        </span>
      </div>

      {/* ── Main nav ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile: hamburger */}
            <button
              onClick={openDrawer}
              className="md:hidden -ml-1 p-2 text-gray-800"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <button
              onClick={() => goTo("/")}
              className="flex-shrink-0 font-serif text-2xl font-bold tracking-tight leading-none"
            >
              DEBBY
              <sup
                className="text-[11px] font-sans ml-0.5"
                style={{ color: "#D4AF37", verticalAlign: "super" }}
              >
                HC
              </sup>
            </button>

            {/* Desktop: nav links */}
            <div className="hidden md:flex items-center gap-8 mr-auto ml-6">
              {NAV_LINKS.map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => goTo(path)}
                  className={`relative text-xs uppercase tracking-[0.18em] font-medium py-1 transition-colors ${
                    isActive(path)
                      ? "text-black"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  {label}
                  {isActive(path) && (
                    <span
                      className="absolute -bottom-[1px] left-0 right-0 h-0.5"
                      style={{ background: "#D4AF37" }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop: search */}
            <div className="hidden md:flex flex-1 max-w-xs mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch(search)}
                  placeholder="Search luxury pieces..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:bg-white focus:border-gold-400 transition-colors"
                />
              </div>
            </div>

            {/* Desktop: action icons */}
            <div className="hidden md:flex items-center gap-5">
              <button
                onClick={share}
                className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-black transition-colors"
              >
                <Share2 className="h-[18px] w-[18px]" />
                <span className="text-[9px] uppercase tracking-widest">
                  Share
                </span>
              </button>
              <button
                onClick={() => goTo("/shop/favorites")}
                className="relative flex flex-col items-center gap-0.5 text-gray-500 hover:text-black transition-colors"
              >
                <Heart className="h-[18px] w-[18px]" />
                <span className="text-[9px] uppercase tracking-widest">
                  Saved
                </span>
                {wishlistCount > 0 && (
                  <span
                    key={wishlistCount}
                    className="badge-pop absolute -top-1.5 -right-2 h-[16px] min-w-[16px] px-0.5 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ background: "#D4AF37" }}
                  >
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => goTo("/shop/cart")}
                className="relative flex flex-col items-center gap-0.5 text-gray-500 hover:text-black transition-colors"
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                <span className="text-[9px] uppercase tracking-widest">
                  Bag
                </span>
                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="badge-pop absolute -top-1.5 -right-2 h-[16px] min-w-[16px] px-0.5 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ background: "#0a0a0a" }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile: search + bag */}
            <div className="flex items-center md:hidden gap-1">
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2 text-gray-800"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => goTo("/shop/cart")}
                className="relative p-2 text-gray-800"
                aria-label={`Cart, ${cartCount} items`}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="badge-pop absolute top-1 right-1 h-[14px] min-w-[14px] flex items-center justify-center rounded-full text-[8px] font-bold text-white"
                    style={{ background: "#D4AF37" }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile: expanding search bar */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch(search)}
                  placeholder="Search for luxury pieces..."
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:bg-white focus:border-gold-400 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── Mobile slide-out drawer ── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm sheet-overlay ${drawerClosing ? "closing" : ""}`}
            onClick={closeDrawer}
          />
          {/* Panel */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-[78%] max-w-[300px] bg-white shadow-2xl flex flex-col ${drawerClosing ? "drawer-out" : "drawer-in"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <span className="font-serif text-xl font-bold tracking-tight">
                DEBBY
                <sup
                  className="text-[10px] font-sans ml-0.5"
                  style={{ color: "#D4AF37", verticalAlign: "super" }}
                >
                  HC
                </sup>
              </span>
              <button
                onClick={closeDrawer}
                className="p-2 -mr-2 text-gray-400"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                Navigate
              </p>
              <ul className="space-y-0 mb-8 border-b border-gray-100">
                {NAV_LINKS.map(({ label, path }) => (
                  <li key={path}>
                    <button
                      onClick={() => {
                        closeDrawer();
                        goTo(path);
                      }}
                      className={`w-full text-left py-3.5 font-serif text-xl border-t border-gray-100 transition-colors ${isActive(path) ? "text-black" : "text-gray-700 hover:text-black"}`}
                    >
                      {label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      closeDrawer();
                      goTo("/shop/favorites");
                    }}
                    className="w-full text-left py-3.5 font-serif text-xl border-t border-gray-100 text-gray-700 hover:text-black transition-colors flex items-center justify-between"
                  >
                    Saved
                    {wishlistCount > 0 && (
                      <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-sans font-semibold">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                </li>
              </ul>

              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                Contact
              </p>
              <div className="space-y-4">
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center gap-3 text-sm text-gray-500 hover:text-black transition-colors"
                >
                  <Phone
                    className="h-4 w-4 flex-shrink-0"
                    style={{ color: "#D4AF37" }}
                  />
                  {PHONE}
                </a>
                <button
                  onClick={share}
                  className="flex items-center gap-3 text-sm text-gray-500 hover:text-black transition-colors"
                >
                  <Share2
                    className="h-4 w-4 flex-shrink-0"
                    style={{ color: "#D4AF37" }}
                  />
                  Share this site
                </button>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-500 hover:text-black transition-colors"
                >
                  <Instagram
                    className="h-4 w-4 flex-shrink-0"
                    style={{ color: "#D4AF37" }}
                  />
                  @debbyhautecouture
                </a>
              </div>
            </div>

            {/* CTA */}
            <div className="px-6 pb-8 pt-4">
              <button
                onClick={() => {
                  closeDrawer();
                  goTo("/bespoke");
                }}
                className="w-full bg-black text-white py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-gold-400 hover:text-black transition-all"
              >
                Book a Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
