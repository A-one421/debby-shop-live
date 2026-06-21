import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { showToast } from "./Toast";
import { PHONE, EMAIL, ADDRESS } from "./data";

/* ── Real SVG social icons ── */
function IconInstagram() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const nav = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  function subscribe() {
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address", "error");
      return;
    }
    showToast(`Thanks for joining! Check ${email} for your welcome offer.`);
    setEmail("");
  }

  const socials = [
    {
      icon: <IconInstagram />,
      href: "https://instagram.com",
      label: "Instagram",
    },
    { icon: <IconFacebook />, href: "https://facebook.com", label: "Facebook" },
    { icon: <IconTikTok />, href: "https://tiktok.com", label: "TikTok" },
    {
      icon: <IconWhatsApp />,
      href: `https://wa.me/${PHONE.replace(/\D/g, "")}`,
      label: "WhatsApp",
    },
  ];

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <span className="font-serif text-2xl tracking-tight">
              DEBBY<span style={{ color: "#C9A84C" }}> CA</span>
            </span>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              Redefining luxury fashion for the modern woman. Quality, elegance,
              and style in every stitch.
            </p>
            <div className="flex gap-4 mt-6">
              {socials.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "#C9A84C" }}
            >
              Shop
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                "New Arrivals",
                "Tops & Blouses",
                "Pants & Trousers",
                "Bridal & Asoebi",
              ].map((l) => (
                <li key={l}>
                  <button
                    onClick={() => nav("/shop")}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "#C9A84C" }}
            >
              Services
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                ["Bespoke Tailoring", "/bespoke"],
                ["Custom Orders", "/bespoke"],
                ["Consultations", "/bespoke"],
                ["Ready-to-Wear", "/shop"],
              ].map(([l, p]) => (
                <li key={l}>
                  <button
                    onClick={() => nav(p)}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "#C9A84C" }}
            >
              Stay Connected
            </h4>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
              Subscribe for exclusive offers and style inspiration.
            </p>
            <div className="flex border-b border-white/20 pb-2 mb-7">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && subscribe()}
                placeholder="Your email address"
                className="bg-transparent border-none focus:ring-0 w-full text-sm placeholder-gray-600 outline-none text-white"
              />
              <button
                onClick={subscribe}
                className="text-xs font-semibold tracking-widest hover:text-white transition-colors duration-200 flex-shrink-0"
                style={{ color: "#C9A84C" }}
              >
                JOIN →
              </button>
            </div>

            {/* Contact info with real icons */}
            <ul className="space-y-3 text-gray-400 text-xs">
              <li>
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-start gap-2.5 hover:text-white transition-colors duration-200"
                >
                  <Phone className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <span>{PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-start gap-2.5 hover:text-white transition-colors duration-200"
                >
                  <Mail className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <span>{EMAIL}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>{ADDRESS}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs gap-2">
          <p>
            © {new Date().getFullYear()} Debby Haute Couture. All rights
            reserved.
          </p>
          <p>Crafted with elegance.</p>
        </div>
      </div>
    </footer>
  );
}
