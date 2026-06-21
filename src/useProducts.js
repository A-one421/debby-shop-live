import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import { products as staticProducts } from './data'

// Combines the original hand-coded products with anything the owner
// uploads through the shop manager, so the storefront never depends
// on Firebase being reachable to show its core catalog.
export function useProducts() {
  const [liveProducts, setLiveProducts] = useState([])

  useEffect(() => {
    let q
    try {
      q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    } catch {
      return
    }
    const unsub = onSnapshot(
      q,
      (snap) => {
        setLiveProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      },
      () => setLiveProducts([]),
    )
    return unsub
  }, [])

  return [...liveProducts, ...staticProducts]
}
