import { useNavigate, useLocation } from "react-router-dom";
import { Home, Grid2x2, Sparkles, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export default function MobileBottomNav() {
  const { cartCount, wishlistCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const go = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const isHome = location.pathname === "/";
  const isShop =
    location.pathname === "/shop" ||
    location.pathname.startsWith("/shop/product");
  const isBespoke = location.pathname === "/bespoke";
  const isSaved = location.pathname === "/shop/favorites";
  const isCart = location.pathname === "/shop/cart";

  const sideItems = [
    {
      key: "home",
      icon: Home,
      label: "Home",
      fn: () => go("/"),
      active: isHome,
    },
    {
      key: "shop",
      icon: Grid2x2,
      label: "Shop",
      fn: () => go("/shop"),
      active: isShop,
    },
  ];
  const sideItemsRight = [
    {
      key: "bespoke",
      icon: Sparkles,
      label: "Bespoke",
      fn: () => go("/bespoke"),
      active: isBespoke,
    },
    {
      key: "saved",
      icon: Heart,
      label: "Saved",
      fn: () => go("/shop/favorites"),
      active: isSaved,
      badge: wishlistCount,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <div className="relative grid grid-cols-5 h-16 items-center">
        {sideItems.map(({ key, icon: Icon, label, fn, active }) => (
          <button
            key={key}
            onClick={fn}
            className="flex flex-col items-center justify-center gap-1 h-full"
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className="h-5 w-5"
              strokeWidth={active ? 2.4 : 1.8}
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
            {active && (
              <span
                className="absolute top-0 h-0.5 w-8 rounded-full"
                style={{ background: "#D4AF37" }}
              />
            )}
          </button>
        ))}

        {/* Elevated center cart action */}
        <div className="flex items-center justify-center h-full relative">
          <button
            onClick={() => go("/shop/cart")}
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="nav-fab relative -translate-y-3"
            style={{ background: isCart ? "#D4AF37" : "#0a0a0a" }}
          >
            <ShoppingBag className="h-5 w-5 text-white" />
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="badge-pop absolute -top-1 -right-1 h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: "#D4AF37", border: "2px solid #fff" }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>

        {sideItemsRight.map(({ key, icon: Icon, label, fn, active, badge }) => (
          <button
            key={key}
            onClick={fn}
            className="flex flex-col items-center justify-center gap-1 h-full relative"
            aria-current={active ? "page" : undefined}
          >
            <span className="relative">
              <Icon
                className="h-5 w-5"
                strokeWidth={active ? 2.4 : 1.8}
                style={{ color: active ? "#0a0a0a" : "#9ca3af" }}
              />
              {badge > 0 && (
                <span
                  key={badge}
                  className="badge-pop absolute -top-1.5 -right-2 h-[16px] min-w-[16px] px-1 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
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
            {active && (
              <span
                className="absolute top-0 h-0.5 w-8 rounded-full"
                style={{ background: "#D4AF37" }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
