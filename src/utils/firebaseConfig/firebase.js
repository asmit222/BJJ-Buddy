// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app'
// import { getDatabase } from 'firebase/database'
import { initializeApp } from 'firebase/app'
import { getFirestore } from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyDthJ8vbHI8NHxz0Du5xNk75LsqiHYctFs',
  authDomain: 'kindle-books-app.firebaseapp.com',
  projectId: 'kindle-books-app',
  storageBucket: 'kindle-books-app.appspot.com',
  messagingSenderId: '207722033546',
  appId: '1:207722033546:web:6b6b1c036a80cde0651873',
  measurementId: 'G-GNN3NPPNFG'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
