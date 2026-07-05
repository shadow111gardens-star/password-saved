// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";

// તમારી સાચી Firebase કીઝ અહીં સેટ કરી દીધી છે
const firebaseConfig = {
  apiKey: "AIzaSyCFvzMFSb68enwpsItyPO_YLLjxiyBOTLo",
  authDomain: "password-saved.firebaseapp.com",
  projectId: "password-saved",
  storageBucket: "password-saved.firebasestorage.app",
  messagingSenderId: "1066781190450",
  appId: "1:1066781190450:web:07f542f66b3866e08e4f2b",
  measurementId: "G-WPF6GQVQNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google Login ફંક્શન
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user; // લોગીન થયેલા યુઝરનો ડેટા રિટર્ન કરશે
  } catch (error) {
    console.error("Google Auth Error:", error);
    return null;
  }
};