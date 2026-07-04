import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAvAEk9xyZnYCtOC-k-rD9yXhGEf2iuNZw',
  authDomain: 'debby-couture.firebaseapp.com',
  databaseURL: 'https://debby-couture-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'debby-couture',
  storageBucket: 'debby-couture.firebasestorage.app',
  messagingSenderId: '878554006146',
  appId: '1:878554006146:web:f91f70665090c419872a9b',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
