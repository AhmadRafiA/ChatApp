import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData,
  setDoc,
  doc,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdPJR7nxTqFM7J_3i3HlTmlJ5X84VN-ZI",
  authDomain: "chatapp-8435a.firebaseapp.com",
  projectId: "chatapp-8435a",
  storageBucket: "chatapp-8435a.firebasestorage.app",
  messagingSenderId: "480514811014",
  appId: "1:480514811014:web:ad2c7b39e3695516d09d07",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);


export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,

  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  collection,
  setDoc,
  doc,

  ref,
  uploadBytes,
  getDownloadURL,
};
