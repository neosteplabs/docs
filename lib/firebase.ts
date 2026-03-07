import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiml1s05I8x5Zr2dxQOYGRlRnr9nAb2gs",
  authDomain: "neostep-portal-b9ea3.firebaseapp.com",
  projectId: "neostep-portal-b9ea3",
  storageBucket: "neostep-portal-b9ea3.firebasestorage.app",
  messagingSenderId: "312972875460",
  appId: "1:312972875460:web:20cb8d4663b436f9a09b91",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);