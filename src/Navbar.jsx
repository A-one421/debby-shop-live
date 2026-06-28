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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerClosing, setDrawerClosing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lock body scroll while drawer is open
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
    if (val) navigate(`/shop?q=${encodeURIComponent(val)}`);
  };

  function closeDrawer() {
    setDrawerClosing(true);
    setTimeout(() => {
      setDrawerOpen(false);
      setDrawerClosing(false);
    }, 220);
  }

  return (
    <>
      {/* Slim promo strip */}
      <div className="bg-black text-white text-center text-[11px] sm:text-xs tracking-wide py-2 px-4">
        Free delivery on orders over{" "}
        <span style={{ color: "#D4AF37" }}>&#8358;100,000</span>
        <span className="hidden sm:inline">
          {" "}
          &nbsp;•&nbsp; Bespoke consultations now open
        </span>
      </div>

      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile: menu trigger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden -ml-1 p-2 text-gray-800"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <div
              className="flex-shrink-0 flex items-center cursor-pointer md:mr-8"
              onClick={() => goTo("/")}
            >
              <span className="font-serif text-2xl font-bold tracking-tighter">
                DEBBY{" "}
                <span className="text-gold-500 text-sm align-top">HC</span>
              </span>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-7 mr-auto ml-2">
              {NAV_LINKS.map((l) => {
                const active = location.pathname === l.path;
                return (
                  <button
                    key={l.path}
                    onClick={() => goTo(l.path)}
                    className={`text-sm uppercase tracking-widest font-medium transition-colors relative py-1 ${active ? "text-black" : "text-gray-500 hover:text-black"}`}
                  >
                    {l.label}
                    {active && (
                      <span
                        className="absolute -bottom-[1px] left-0 right-0 h-0.5"
                        style={{ background: "#D4AF37" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-sm mx-6">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 placeholder-gray-400 focus:bg-white focus:border-gold-500 sm:text-sm transition-colors"
                  placeholder="Search for luxury pieces..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch(search)}
                />
              </div>
            </div>

            {/* Desktop icons */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={share}
                className="text-gray-600 hover:text-gold-500 transition-colors flex flex-col items-center gap-1"
              >
                <Share2 className="h-5 w-5" />
                <span className="text-[10px] uppercase tracking-wider font-medium">
                  Share
                </span>
              </button>
              <button
                onClick={() => goTo("/shop/favorites")}
                className="text-gray-600 hover:text-gold-500 transition-colors flex flex-col items-center gap-1 relative"
              >
                <Heart className="h-5 w-5" />
                <span className="text-[10px] uppercase tracking-wider font-medium">
                  Saved
                </span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => goTo("/shop/cart")}
                className="text-gray-600 hover:text-gold-500 transition-colors flex flex-col items-center gap-1 relative"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="text-[10px] uppercase tracking-wider font-medium">
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile: search + bag (saved/cart live in the bottom nav) */}
            <div className="flex items-center md:hidden gap-1">
              <button
                onClick={() => setMobileSearchOpen((v) => !v)}
                className="p-2 text-gray-800"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                onClick={() => goTo("/shop/cart")}
                className="p-2 text-gray-800 relative"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 h-3.5 w-3.5 flex items-center justify-center rounded-full bg-gold-500 text-[9px] font-bold text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search — expands below header */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-3 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  autoFocus
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full bg-gray-50 placeholder-gray-400 focus:bg-white focus:border-gold-500 text-sm"
                  placeholder="Search for luxury pieces..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch(search)}
                />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile slide-out drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm sheet-overlay ${drawerClosing ? "closing" : ""}`}
            onClick={closeDrawer}
          />
          <div
            className={`absolute right-0 top-0 bottom-0 w-[78%] max-w-xs bg-white shadow-2xl ${drawerClosing ? "drawer-out" : "drawer-in"}`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <span className="font-serif text-xl tracking-tight">
                  DEBBY{" "}
                  <span className="text-gold-500 text-xs align-top">HC</span>
                </span>
                <button
                  onClick={closeDrawer}
                  className="p-2 -mr-2 text-gray-500"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                  Browse
                </p>
                <ul className="space-y-1 mb-8">
                  {NAV_LINKS.map((l) => (
                    <li key={l.path}>
                      <button
                        onClick={() => {
                          closeDrawer();
                          goTo(l.path);
                        }}
                        className="w-full text-left py-2.5 font-serif text-lg text-gray-900 hover:text-gold-500 transition-colors"
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => {
                        closeDrawer();
                        goTo("/shop/favorites");
                      }}
                      className="w-full text-left py-2.5 font-serif text-lg text-gray-900 hover:text-gold-500 transition-colors flex items-center justify-between"
                    >
                      Saved
                      {wishlistCount > 0 && (
                        <span className="text-xs bg-gold-50 text-gold-600 px-2 py-0.5 rounded-full font-sans font-semibold">
                          {wishlistCount}
                        </span>
                      )}
                    </button>
                  </li>
                </ul>

                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
                  Get in touch
                </p>
                <div className="space-y-3 mb-8">
                  <a
                    href={`tel:${PHONE}`}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    <Phone className="h-4 w-4 text-gold-500" /> {PHONE}
                  </a>
                  <button
                    onClick={share}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    <Share2 className="h-4 w-4 text-gold-500" /> Share this site
                  </button>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    <Instagram className="h-4 w-4 text-gold-500" />{" "}
                    @debbyhautecouture
                  </a>
                </div>
              </div>

              <div className="px-6 py-5 border-t border-gray-100">
                <button
                  onClick={() => {
                    closeDrawer();
                    goTo("/bespoke");
                  }}
                  className="w-full bg-black text-white py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-gold-400 hover:text-black transition-all"
                >
                  Book a Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
