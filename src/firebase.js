// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUupovypgdxejwv8WWpwd3X4YF0ocZCDc",
  authDomain: "agenda-rfp.firebaseapp.com",
  projectId: "agenda-rfp",
  storageBucket: "agenda-rfp.firebasestorage.app",
  messagingSenderId: "324698774249",
  appId: "1:324698774249:web:af41166bded51e6b6a2e78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 