import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Share2, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from './CartContext'

export default function Navbar() {
  const { cartCount, wishlistCount } = useCart()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const goTo = path => { navigate(path); window.scrollTo(0,0) }
  const share = () => { if (navigator.share) navigator.share({ title:'DEBBY HAUTE COUTURE', url:window.location.href }); else navigator.clipboard?.writeText(window.location.href) }
  const handleSearch = e => { setSearch(e.target.value); if (e.target.value) navigate(`/shop?q=${encodeURIComponent(e.target.value)}`) }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => goTo('/')}>
            <span className="font-serif text-2xl font-bold tracking-tighter">
              DEBBY <span className="text-gold-500 text-sm align-top">HC</span>
            </span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400"/>
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 placeholder-gray-400 focus:bg-white focus:border-gold-500 sm:text-sm transition-colors"
                placeholder="Search for luxury pieces..." value={search} onChange={handleSearch}
                onKeyDown={e => e.key==='Enter' && search && navigate(`/shop?q=${encodeURIComponent(search)}`)}/>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={share} className="text-gray-600 hover:text-gold-500 transition-colors flex flex-col items-center gap-1">
              <Share2 className="h-5 w-5"/>
              <span className="text-[10px] uppercase tracking-wider font-medium">Share</span>
            </button>
            <button onClick={() => goTo('/shop/favorites')} className="text-gray-600 hover:text-gold-500 transition-colors flex flex-col items-center gap-1 relative">
              <Heart className="h-5 w-5"/>
              <span className="text-[10px] uppercase tracking-wider font-medium">Saved</span>
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">{wishlistCount > 9 ? '9+' : wishlistCount}</span>}
            </button>
            <button onClick={() => goTo('/shop/cart')} className="text-gray-600 hover:text-gold-500 transition-colors flex flex-col items-center gap-1 relative">
              <ShoppingBag className="h-5 w-5"/>
              <span className="text-[10px] uppercase tracking-wider font-medium">Cart</span>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">{cartCount > 9 ? '9+' : cartCount}</span>}
            </button>
          </div>

          {/* Mobile icons */}
          <div className="flex items-center md:hidden space-x-4">
            <button onClick={share} className="text-gray-800"><Share2 className="h-6 w-6"/></button>
            <button onClick={() => goTo('/shop/favorites')} className="text-gray-800 relative">
              <Heart className="h-6 w-6"/>
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">{wishlistCount > 9 ? '9+' : wishlistCount}</span>}
            </button>
            <button onClick={() => goTo('/shop/cart')} className="text-gray-800 relative">
              <ShoppingBag className="h-6 w-6"/>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">{cartCount > 9 ? '9+' : cartCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
