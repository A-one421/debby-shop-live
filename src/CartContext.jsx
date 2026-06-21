import { createContext, useContext, useState, useEffect } from "react";
import { PHONE, PAYSTACK_KEY } from "./data";

const Ctx = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("debby_cart") || "[]");
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("debby_wishlist") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("debby_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("debby_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const wishlistCount = wishlist.length;
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  function addToCart(product, size = "S", color = "Black", qty = 1) {
    setCart((prev) => {
      const ex = prev.find(
        (i) => i.id === product.id && i.size === size && i.color === color,
      );
      if (ex)
        return prev.map((i) =>
          i.id === product.id && i.size === size && i.color === color
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      return [...prev, { ...product, size, color, quantity: qty }];
    });
  }

  function removeFromCart(id, size, color) {
    setCart((p) =>
      p.filter((i) => !(i.id === id && i.size === size && i.color === color)),
    );
  }

  function updateQty(id, size, color, delta) {
    setCart((prev) => {
      const item = prev.find(
        (i) => i.id === id && i.size === size && i.color === color,
      );
      if (!item) return prev;
      if (item.quantity + delta < 1)
        return prev.filter(
          (i) => !(i.id === id && i.size === size && i.color === color),
        );
      return prev.map((i) =>
        i.id === id && i.size === size && i.color === color
          ? { ...i, quantity: i.quantity + delta }
          : i,
      );
    });
  }

  function clearCart() {
    setCart([]);
  }

  function toggleWishlist(product) {
    const ex = wishlist.some((i) => i.id === product.id);
    if (ex) setWishlist((p) => p.filter((i) => i.id !== product.id));
    else setWishlist((p) => [...p, product]);
    return !ex;
  }

  function isInWishlist(id) {
    return wishlist.some((i) => i.id === id);
  }

  function checkoutWhatsApp() {
    let msg = "Hi, I want to order from DEBBY HAUTE COUTURE:\n\n";
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} (Size: ${item.size}) - ₦${item.price.toFixed(2)} x ${item.quantity} = ₦${(item.price * item.quantity).toFixed(2)}\n`;
    });
    msg += `\nSubtotal: ₦${subtotal.toFixed(2)}\nTax: ₦${tax.toFixed(2)}\nTotal: ₦${total.toFixed(2)}\n\nPlease confirm my order.`;
    window.open(
      `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  }

  function payWithPaystack(email) {
    if (!window.PaystackPop) {
      alert("Payment loading, try again");
      return;
    }
    if (!email || !email.includes("@")) {
      alert("Enter a valid email");
      return;
    }
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_KEY,
      email,
      amount: Math.round(total * 100),
      currency: "NGN",
      ref: "DEBBY_" + Date.now(),
      callback: () => {
        clearCart();
        alert("Payment successful! Order confirmed 🎉");
      },
      onClose: () => {},
    });
    handler.openIframe();
  }

  return (
    <Ctx.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        wishlistCount,
        subtotal,
        tax,
        total,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleWishlist,
        isInWishlist,
        checkoutWhatsApp,
        payWithPaystack,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  return useContext(Ctx);
}
