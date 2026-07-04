import { useNavigate, useLocation } from "react-router-dom";
import { Home, Grid2x2, Sparkles, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

const TABS = [
  { key: "home", icon: Home, label: "Home", path: "/" },
  { key: "shop", icon: Grid2x2, label: "Shop", path: "/shop" },
  // centre slot is the cart FAB — handled separately
  { key: "bespoke", icon: Sparkles, label: "Bespoke", path: "/bespoke" },
  { key: "saved", icon: Heart, label: "Saved", path: "/shop/favorites" },
];

export default function MobileBottomNav() {
  const { cartCount, wishlistCount } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const go = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };
  const isCart = pathname === "/shop/cart";

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary navigation"
    >
      {/* Gold active indicator bar sits at the very top of the nav */}
      <div className="relative grid grid-cols-5 h-16 items-end pb-1">
        {/* LEFT two tabs */}
        {TABS.slice(0, 2).map(({ key, icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <button
              key={key}
              onClick={() => go(path)}
              className="flex flex-col items-center justify-end gap-0.5 pb-1 h-full relative"
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                  style={{ background: "#D4AF37" }}
                />
              )}
              <Icon
                className="h-[22px] w-[22px]"
                strokeWidth={active ? 2.4 : 1.7}
                style={{ color: active ? "#0a0a0a" : "#9ca3af" }}
              />
              <span
                className="text-[10px] tracking-wide"
                style={{
                  color: active ? "#0a0a0a" : "#9ca3af",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}

        {/* CENTRE: elevated cart FAB */}
        <div
          className="flex items-start justify-center pt-0 relative"
          style={{ marginTop: "-18px" }}
        >
          <button
            onClick={() => go("/shop/cart")}
            aria-label={`Cart — ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="nav-fab relative"
            style={{ background: isCart ? "#D4AF37" : "#0a0a0a" }}
          >
            <ShoppingBag className="h-[22px] w-[22px] text-white" />
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="badge-pop absolute -top-1 -right-1 h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ background: "#D4AF37", border: "2px solid #fff" }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>

        {/* RIGHT two tabs */}
        {TABS.slice(2).map(({ key, icon: Icon, label, path }) => {
          const active = isActive(path);
          const badge = key === "saved" ? wishlistCount : 0;
          return (
            <button
              key={key}
              onClick={() => go(path)}
              className="flex flex-col items-center justify-end gap-0.5 pb-1 h-full relative"
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                  style={{ background: "#D4AF37" }}
                />
              )}
              <span className="relative">
                <Icon
                  className="h-[22px] w-[22px]"
                  strokeWidth={active ? 2.4 : 1.7}
                  style={{ color: active ? "#0a0a0a" : "#9ca3af" }}
                />
                {badge > 0 && (
                  <span
                    key={badge}
                    className="badge-pop absolute -top-1.5 -right-2 h-[15px] min-w-[15px] px-0.5 flex items-center justify-center rounded-full text-[8px] font-bold text-white"
                    style={{ background: "#D4AF37" }}
                  >
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </span>
              <span
                className="text-[10px] tracking-wide"
                style={{
                  color: active ? "#0a0a0a" : "#9ca3af",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
