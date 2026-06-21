import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

let _set = null
const q = []

export function showToast(msg, type='success') {
  const id = Date.now() + Math.random()
  q.push({ id, msg, type })
  if (_set) _set([...q])
  setTimeout(() => {
    const i = q.findIndex(t => t.id === id)
    if (i > -1) q.splice(i, 1)
    if (_set) _set([...q])
  }, 3500)
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])
  useEffect(() => { _set = setToasts; return () => { _set = null } }, [])
  return (
    <div style={{ position:'fixed', top:96, right:16, zIndex:9999, display:'flex', flexDirection:'column', gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} className="animate-fade-in"
          style={{ background:'rgba(10,10,10,0.95)', color:'#fff', padding:'14px 24px', borderRadius:48, fontSize:'0.9rem', fontWeight:500, boxShadow:'0 10px 25px rgba(0,0,0,0.2)', borderLeft:`5px solid ${t.type==='error'?'#d9534f':'#D4AF37'}`, display:'flex', alignItems:'center', gap:10, backdropFilter:'blur(8px)', fontFamily:'Inter,sans-serif', maxWidth:320 }}>
          <CheckCircle size={16} color="#D4AF37"/>
          <div>
            <div style={{ fontWeight:700, fontSize:'0.82rem' }}>{t.msg.includes('added')||t.msg.includes('cart') ? 'Added to Cart' : t.msg.includes('removed') || t.msg.includes('Removed') ? 'Removed' : t.msg.includes('saved')||t.msg.includes('Saved') ? 'Saved' : 'Success'}</div>
            <div style={{ fontSize:'0.76rem', color:'#ccc' }}>{t.msg}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
