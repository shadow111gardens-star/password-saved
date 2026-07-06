// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
// 1. doc, setDoc, અને getDoc અહીં ઉમેર્યા છે 👇
import { getFirestore, collection, addDoc, getDocs, query, where, doc, setDoc, getDoc } from "firebase/firestore";

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

export const db = getFirestore(app);
export { collection, addDoc, getDocs, query, where };

// Google Login ફંક્શન (હવે આ યુઝરનો રોલ પણ મેનેજ કરશે)
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (user) {
      // ૧. users કલેક્શનમાં યુઝરના UID વાળા ડોક્યુમેન્ટનો રેફરન્સ લો
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // ૨. જો યુઝર નવો હોય, તો ડેટાબેઝમાં "free" પ્લાન સાથે એન્ટ્રી પાડો
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: "free", // બાય ડિફોલ્ટ નવો યુઝર "free" રહેશે
          createdAt: new Date()
        });
        console.log("નવો યુઝર 'free' પ્લાન સાથે રજીસ્ટર થયો!");
      } else {
        console.log("જૂનો યુઝર છે, ઓલરેડી ડેટાબેઝમાં અવેલેબલ છે.");
      }
    }

    return user; 
  } catch (error) {
    console.error("Google Auth Error:", error);
    return null;
  }
};