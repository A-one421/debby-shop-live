import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scissors, BookOpen, Sparkles, MessageCircle, ChevronDown, Phone, Mail, MapPin } from 'lucide-react'
import emailjs from '@emailjs/browser'
import useReveal from './useReveal'
import { showToast } from './Toast'
import { timePriceMap, PHONE, EMAILJS_SERVICE, EMAILJS_TEMPLATE_OWNER, EMAILJS_TEMPLATE_CUST } from './data'

function R({ children, className='' }) { const ref = useReveal(); return <div ref={ref} className={`reveal-on-scroll ${className}`}>{children}</div> }

export default function BespokePage() {
  const navigate = useNavigate()
  const [minutes, setMinutes] = useState(60)
  const [form, setForm] = useState({ name:'', email:'', phone:'', type:'60 minutes - ₦40,000', description:'', agreed:false })
  const [sending, setSending] = useState(false)

  const price = timePriceMap[minutes] || 40000

  function updateSlider(val) {
    setMinutes(val)
    const opt = `${val} minutes - ₦${(timePriceMap[val]||0).toLocaleString()}`
    setForm(f => ({ ...f, type: opt }))
  }

  function selectSlot() {
    document.getElementById('booking-form')?.scrollIntoView({ behavior:'smooth' })
    showToast(`${minutes} minutes — ₦${price.toLocaleString()} selected`)
    setTimeout(() => document.getElementById('bespoke_name')?.focus(), 400)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.type || !form.description) { showToast('Please fill all required fields','error'); return }
    if (!form.agreed) { showToast('Please confirm your booking','error'); return }
    setSending(true)
    const date = new Date().toLocaleDateString('en-US',{ year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })
    const ref = Math.floor(100000 + Math.random()*900000)
    const ownerParams = { bespoke_name:form.name, bespoke_email:form.email, bespoke_phone:form.phone, bespoke_type:form.type, project_description:form.description, date }
    const custParams = { customer_name:form.name, customer_email:form.email, consultation_type:form.type, reference_number:ref, submission_date:date, project_summary:form.description.substring(0,200) }
    try {
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_OWNER, ownerParams)
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_CUST, custParams)
      showToast('✨ Consultation reserved! Confirmation sent to your email.')
      const waMsg = `🪡 BESPOKE BOOKING\nName: ${form.name}\nDuration: ${form.type}\nEmail: ${form.email}\nMessage: ${form.description.substring(0,100)}...`
      window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(waMsg)}`,'_blank')
      setForm({ name:'', email:'', phone:'', type:'60 minutes - ₦40,000', description:'', agreed:false })
    } catch {
      showToast('Booking received! We\'ll contact you shortly.')
      window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(`Bespoke inquiry from ${form.name}: ${form.description.substring(0,80)}`)}`,'_blank')
    } finally { setSending(false) }
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative bg-black text-white py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <R><span className="text-gold-400 text-sm uppercase tracking-[0.2em] font-medium">Couture Atelier</span></R>
            <R><h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mt-4 mb-6 leading-tight">Bespoke &<br/>Custom Orders</h1></R>
            <R><div className="w-20 h-0.5 bg-gold-400 mb-8"/></R>
            <R><p className="text-gray-300 text-lg leading-relaxed">Every piece tells a story. Work directly with our master tailors to create a garment that embodies your vision—crafted exclusively for you.</p></R>
          </div>
        </div>
      </div>

      {/* Bespoke Journey */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <R className="text-center mb-12">
            <span className="text-gold-400 text-sm uppercase tracking-[0.2em] font-medium">The Art of Craftsmanship</span>
            <h2 className="font-serif text-3xl md:text-4xl mt-3 mb-4">The Bespoke Journey</h2>
            <div className="w-20 h-0.5 bg-gold-400 mx-auto"/>
          </R>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { img:'/haute1.jpg', label:'Atelier Process', desc:'Precision measurements & fittings' },
              { img:'/img5.jpg', label:'Curated Fabrics', desc:'Premium materials from around the world' },
              { img:'/img3.jpg', label:'Master Tailoring', desc:'Hand-finished with precision' },
            ].map((c,i) => (
              <R key={i} className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
                  <img src={c.img} alt={c.label} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" onError={e=>e.target.src='https://placehold.co/600x750/f5f5f5/D4AF37?text=Debby'}/>
                </div>
                <div className="p-4 text-center border border-t-0 border-gray-100 rounded-b-2xl">
                  <p className="text-xs text-gold-400 uppercase tracking-wider">{c.label}</p>
                  <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </div>

      {/* Time-Based Consultation */}
      <div id="time-pricing" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <R className="text-center mb-12">
            <span className="text-gold-400 text-sm uppercase tracking-[0.2em] font-medium">Tailored to You</span>
            <h2 className="font-serif text-3xl md:text-4xl mt-3 mb-4">Time-Based Consultation</h2>
            <div className="w-20 h-0.5 bg-gold-400 mx-auto"/>
            <p className="text-gray-600 max-w-2xl mx-auto mt-5">Select your preferred consultation duration. Each session includes personalized design guidance, fabric selection, and preliminary sketches.</p>
          </R>

          <R className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 mb-10">
            <div className="text-center mb-8">
              <h3 className="font-serif text-2xl mb-2">Estimate Your Investment</h3>
              <p className="text-gray-500 text-sm">Select consultation duration to view pricing</p>
            </div>
            <div className="mb-8">
              <input type="range" min="15" max="180" value={minutes} step="15"
                className="time-slider w-full" onChange={e=>updateSlider(Number(e.target.value))}/>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                {[15,30,45,60,90,120,150,180].map(n=><span key={n}>{n}</span>)}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div style={{ width:130, height:130, borderRadius:'50%', background:'linear-gradient(135deg,#fff8f0,#fff3e6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 25px rgba(212,175,55,0.15)', border:'1px solid rgba(212,175,55,0.3)' }}>
                <div className="text-center">
                  <div className="text-3xl font-serif font-bold text-gray-800">{minutes}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">minutes</div>
                </div>
              </div>
              <div className="mt-5 text-center">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-gray-600">{minutes} minutes</span>
                  <span className="text-gold-400">→</span>
                  <span className="text-xl font-semibold text-gray-900">₦{price.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Includes consultation & design notes</p>
              </div>
              <button onClick={selectSlot} className="mt-6 px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gold-400 hover:text-black transition-all">
                Select This Duration
              </button>
            </div>
          </R>

          {/* Booking Form */}
          <R id="booking-form" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
            <div className="text-center mb-8">
              <h3 className="font-serif text-2xl mb-2">Reserve Your Consultation</h3>
              <div className="w-16 h-0.5 bg-gold-400 mx-auto"/>
              <p className="text-gray-500 text-sm mt-4">Complete the form to secure your time slot</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="elegant-input border-b border-gray-200 pb-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Full Name *</label>
                  <input id="bespoke_name" type="text" className="w-full bg-transparent py-2 text-gray-900 placeholder-gray-400 focus:outline-none" placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/>
                </div>
                <div className="elegant-input border-b border-gray-200 pb-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email Address *</label>
                  <input type="email" className="w-full bg-transparent py-2 text-gray-900 placeholder-gray-400 focus:outline-none" placeholder="hello@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="elegant-input border-b border-gray-200 pb-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone Number *</label>
                  <input type="tel" className="w-full bg-transparent py-2 text-gray-900 placeholder-gray-400 focus:outline-none" placeholder="+234 806 616 3249" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} required/>
                </div>
                <div className="elegant-input border-b border-gray-200 pb-2 relative">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Consultation Duration *</label>
                  <select className="w-full bg-transparent py-2 text-gray-900 appearance-none cursor-pointer focus:outline-none" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} required>
                    <option value="">Select duration</option>
                    {Object.entries(timePriceMap).map(([m,p]) => (
                      <option key={m} value={`${m} minutes - ₦${p.toLocaleString()}`}>{m} minutes - ₦{p.toLocaleString()}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 bottom-3 h-4 w-4 text-gray-400 pointer-events-none"/>
                </div>
              </div>
              <div className="elegant-input border-b border-gray-200 pb-2">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Describe Your Vision *</label>
                <textarea rows={3} className="w-full bg-transparent py-2 text-gray-900 placeholder-gray-400 resize-none focus:outline-none" placeholder="Tell us about your inspiration, occasion, style preferences..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required/>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" id="agree_terms" className="mt-1 h-4 w-4 rounded border-gray-300 text-gold-400 accent-gold-400" checked={form.agreed} onChange={e=>setForm(f=>({...f,agreed:e.target.checked}))} required/>
                <label htmlFor="agree_terms" className="text-sm text-gray-500">I confirm my consultation booking request *</label>
              </div>
              <button type="submit" disabled={sending}
                className="w-full bg-black text-white py-4 rounded-full font-semibold uppercase tracking-wider hover:bg-gold-400 hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {sending ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Processing...</> : 'Secure Time Slot'}
              </button>
              <p className="text-center text-xs text-gray-400">Confirmation sent via email and WhatsApp within minutes</p>
            </form>
          </R>
        </div>
      </div>

      {/* Why Bespoke */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <R className="text-center mb-12">
            <span className="text-gold-400 text-sm uppercase tracking-[0.2em] font-medium">The Difference</span>
            <h2 className="font-serif text-3xl md:text-4xl mt-3">Why Choose Bespoke?</h2>
            <div className="w-20 h-0.5 bg-gold-400 mx-auto mt-4"/>
          </R>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon:<Scissors className="h-7 w-7 text-gold-400"/>, title:'Perfect Fit', desc:'Custom measurements ensure a silhouette that flatters your unique proportions.' },
              { icon:<BookOpen className="h-7 w-7 text-gold-400"/>, title:'Endless Choice', desc:'Select from our curated collection of premium fabrics, colors, and finishes.' },
              { icon:<Sparkles className="h-7 w-7 text-gold-400"/>, title:'One of a Kind', desc:'Your garment is crafted exclusively for you—no mass production.' },
            ].map((c,i) => (
              <R key={i} className="text-center p-6 service-card rounded-2xl bg-white">
                <div className="w-14 h-14 rounded-full bg-gold-50 flex items-center justify-center mx-auto mb-4">{c.icon}</div>
                <h3 className="font-serif text-xl mb-2">{c.title}</h3>
                <p className="text-gray-500 text-sm">{c.desc}</p>
              </R>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <R className="bg-white rounded-2xl shadow-sm p-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-50 flex items-center justify-center animate-float">
              <MessageCircle className="h-8 w-8 text-gold-400"/>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl mb-4">Need Immediate Assistance?</h3>
            <p className="text-gray-600 mb-6">Connect with our atelier team for instant pricing and availability.</p>
            <button onClick={() => window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent("Hello DEBBY HAUTE COUTURE, I'd like to discuss a bespoke order.")}`, '_blank')}
              className="inline-flex items-center gap-3 px-8 py-3 bg-[#25D366] text-white rounded-full font-medium hover:bg-[#20b859] transition-all">
              <MessageCircle className="h-5 w-5"/>
              <span>Chat on WhatsApp</span>
            </button>
            <p className="text-xs text-gray-400 mt-4">Response within 15 minutes during business hours</p>
          </R>
        </div>
      </div>

      {/* Bespoke Footer */}
      <footer className="bg-black text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
            <div>
              <span className="font-serif text-2xl tracking-tight">DEBBY <span className="text-gold-400">CA</span></span>
              <p className="text-gray-400 text-sm mt-4 leading-relaxed">Craftsmanship meets personal expression. Every piece tells your story.</p>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-4 text-gold-400">Navigation</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => document.getElementById('time-pricing')?.scrollIntoView({behavior:'smooth'})} className="footer-link">Bespoke Consultation</button></li>
                <li><button onClick={() => navigate('/shop')} className="footer-link">Ready-to-Wear</button></li>
                <li><button onClick={() => navigate('/')} className="footer-link">Home</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-4 text-gold-400">Contact</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><Phone className="h-3 w-3"/> +234 806 616 3249</li>
                <li className="flex items-center gap-2"><Mail className="h-3 w-3"/> debbyhautecourture23@gmail.com</li>
                <li className="flex items-start gap-2"><MapPin className="h-3 w-3 mt-1"/> Aromokeye Shopping Complex, Ido Ekiti</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-4 text-gold-400">Atelier Hours</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex justify-between"><span>Mon - Fri</span><span>9:00 AM - 6:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span><span>10:00 AM - 4:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span><span>By Appointment</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 text-center text-gray-500 text-xs flex flex-col md:flex-row justify-between">
            <p>© 2026 Debby Couture Atelier. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Bespoke luxury • Handcrafted with precision</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
