import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './CartContext'
import Preloader from './Preloader'
import Navbar from './Navbar'
import MobileBottomNav from './MobileBottomNav'
import Footer from './Footer'
import HomePage from './HomePage'
import ShopPage from './ShopPage'
import BespokePage from './BespokePage'
import ToastContainer from './Toast'
import { init } from '@emailjs/browser'
init('vW0VXl5PsbOQnRic2')

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0,0) }, [pathname])
  return null
}

export default function App() {
  return (
    <CartProvider>
      <Preloader/>
      <ToastContainer/>
      <ScrollToTop/>
      <div className="flex flex-col min-h-screen">
        <Navbar/>
        <main className="flex-1 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/shop" element={<ShopPage/>}/>
            <Route path="/shop/cart" element={<ShopPage initialView="cart"/>}/>
            <Route path="/shop/favorites" element={<ShopPage initialView="favorites"/>}/>
            <Route path="/shop/product/:productId" element={<ShopPage initialView="product"/>}/>
            <Route path="/bespoke" element={<BespokePage/>}/>
            <Route path="*" element={<HomePage/>}/>
          </Routes>
        </main>
        <Footer/>
      </div>
      <MobileBottomNav/>
    </CartProvider>
  )
}
