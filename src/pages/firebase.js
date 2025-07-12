// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfHu-9s21Z_7XXUuwpocl6EUtEqGJuZpQ",
  authDomain: "medqr-chile.firebaseapp.com",
  projectId: "medqr-chile",
  storageBucket: "medqr-chile.firebasestorage.app",
  messagingSenderId: "545110409627",
  appId: "1:545110409627:web:2dadf90888803e10abe13e",
  measurementId: "G-B4LK2PVZ6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);