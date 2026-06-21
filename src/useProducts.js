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

  // Live (admin-uploaded / migrated) data takes priority over the
  // hand-coded fallback when both share the same id — this lets us
  // migrate the original products into Firestore later without
  // ever showing duplicates on the storefront.
  const map = new Map()
  staticProducts.forEach((p) => map.set(p.id, p))
  liveProducts.forEach((p) => map.set(p.id, p))
  return Array.from(map.values())
}
