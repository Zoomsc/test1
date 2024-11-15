import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD3j_5OJpU86sc29K48cWUkOdya_Be-K20",
  authDomain: "myzoom-121.firebaseapp.com",
  projectId: "myzoom-121",
  storageBucket: "myzoom-121.firebasestorage.app",
  messagingSenderId: "396659738141",
  appId: "1:396659738141:web:21b37f8cb265a8b1e4a8f4",
  measurementId: "G-B5QWJ8C3WB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
