import { X } from 'lucide-react'
import { useState } from 'react'

export default function SizeGuide({ onClose }) {
  const [tab, setTab] = useState('cm')
  const cmData = [
    ['XS','81-84 cm','63-66 cm','88-91 cm'],
    ['S','85-88 cm','67-70 cm','92-95 cm'],
    ['M','89-92 cm','71-74 cm','96-99 cm'],
    ['L','93-96 cm','75-78 cm','100-103 cm'],
    ['XL','97-100 cm','79-82 cm','104-107 cm'],
  ]
  const inchData = [
    ['XS','32-33"','25-26"','35-36"'],
    ['S','33-35"','26-28"','36-37"'],
    ['M','35-36"','28-29"','38-39"'],
    ['L','37-38"','30-31"','39-41"'],
    ['XL','38-39"','31-32"','41-42"'],
  ]
  const rows = tab === 'cm' ? cmData : inchData

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
      <div className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl slide-in-left">
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl">Size Guide</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-6 w-6"/></button>
          </div>
          <div className="mb-8">
            <div className="flex border-b border-gray-200 mb-4">
              {['cm','inch'].map(t => (
                <button key={t} onClick={() => setTab(t)} className={`pb-2 text-sm mr-6 ${tab===t ? 'border-b-2 border-black font-bold' : 'text-gray-400 hover:text-black'}`}>{t==='cm'?'CM':'INCHES'}</button>
              ))}
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>{['Size','Bust','Waist','Hips'].map(h=><th key={h} className="px-4 py-3">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map(([sz,...vals]) => (
                  <tr key={sz}><td className="px-4 py-3 font-bold">{sz}</td>{vals.map((v,i)=><td key={i} className="px-4 py-3">{v}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-serif text-lg mb-4">How to Measure</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex gap-3"><span className="font-bold text-black">1. Bust</span><span>Measure around the fullest part of your chest.</span></li>
              <li className="flex gap-3"><span className="font-bold text-black">2. Waist</span><span>Measure at the narrowest part of your waistline.</span></li>
              <li className="flex gap-3"><span className="font-bold text-black">3. Hips</span><span>Measure at the fullest part of your hips.</span></li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded text-sm text-amber-800">
            <p><strong>Tip:</strong> If you are between sizes, we recommend sizing up for a more comfortable fit.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
