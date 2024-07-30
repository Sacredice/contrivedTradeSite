import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "tradegame-6e7fb.firebaseapp.com",
  projectId: "tradegame-6e7fb",
  storageBucket: "tradegame-6e7fb.appspot.com",
  messagingSenderId: "1016240506083",
  appId: import.meta.env.VITE_APP_ID,
  measurementId: "G-SHXFRLSLG5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
