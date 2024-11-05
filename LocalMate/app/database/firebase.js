// app/database/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyBH512zkMbrB3QvDZp_Zd1Qg8wMmlm0gE0",
    authDomain: "localmate-9cc45.firebaseapp.com",
    projectId: "localmate-9cc45",
    storageBucket: "localmate-9cc45.firebasestorage.app",
    messagingSenderId: "687975485209",
    appId: "1:687975485209:web:51c40c5ea31edb57a67f88",
    measurementId: "G-G7YXJRH8BG"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };