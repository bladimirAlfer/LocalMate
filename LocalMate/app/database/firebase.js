// app/database/firebase.js
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCwbe71xv08YvYs1qZ2uadXfR4mSx-jFbs",
  authDomain: "localmate-e5528.firebaseapp.com",
  projectId: "localmate-e5528",
  storageBucket: "localmate-e5528.firebasestorage.app",
  messagingSenderId: "743928314158",
  appId: "1:743928314158:web:c2d6fd6b18f88646b562bf",
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  useFetchStreams: false, 
});
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };