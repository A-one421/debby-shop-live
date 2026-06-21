import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Share2, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from './CartContext'

export default function MobileBottomNav() {
  const { cartCount, wishlistCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const share = () => { if (navigator.share) navigator.share({ title:'DEBBY HAUTE COUTURE', url:window.location.href }); else navigator.clipboard?.writeText(window.location.href) }

  const items = [
    { icon:<Home className="h-5 w-5 mb-1"/>, label:'Home', fn:()=>navigate('/'), active:location.pathname==='/' },
    { icon:<Share2 className="h-5 w-5 mb-1"/>, label:'Share', fn:share, active:false },
    { icon:<Heart className="h-5 w-5 mb-1"/>, label:'Saved', fn:()=>navigate('/shop/favorites'), active:location.pathname==='/shop/favorites', badge:wishlistCount, bc:'#D4AF37' },
    { icon:<ShoppingBag className="h-5 w-5 mb-1"/>, label:'Cart', fn:()=>navigate('/shop/cart'), active:location.pathname==='/shop/cart', badge:cartCount, bc:'#000' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50" style={{ paddingBottom:'env(safe-area-inset-bottom)' }}>
      <div className="grid grid-cols-4 h-16">
        {items.map(({ icon, label, fn, active, badge, bc }) => (
          <button key={label} onClick={fn} className="flex flex-col items-center justify-center relative" style={{ color: active ? '#D4AF37' : '#6b7280' }}>
            {icon}
            <span className="text-[10px]">{label}</span>
            {badge > 0 && <span className="absolute top-0 right-1/4 h-3 w-3 flex items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background:bc }}>{badge > 9 ? '9+' : badge}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
