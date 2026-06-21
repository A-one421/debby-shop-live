import { useState, useEffect } from 'react'
export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => { setFading(true); setTimeout(() => setVisible(false), 620) }, 1800)
    return () => clearTimeout(t)
  }, [])
  if (!visible) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'#000', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', transition:'opacity 0.6s ease-out', opacity: fading ? 0 : 1, pointerEvents: fading ? 'none' : 'all' }}>
      <div style={{ textAlign:'center' }}>
        <h1 className="font-serif loader-text-special">DEBBY<sup className="sup-hc">HC</sup></h1>
        <p style={{ color:'#D4AF37', fontSize:'0.7rem', letterSpacing:'0.3em', textTransform:'uppercase', marginTop:'0.75rem', fontFamily:'Inter,sans-serif', fontWeight:500 }}>Haute Couture</p>
        <div className="loader-bar"/>
      </div>
    </div>
  )
}
