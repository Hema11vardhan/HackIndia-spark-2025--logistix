// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
// Only import analytics if you plan to use it
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi6mDdrZWTpuLF-_l8EUcT3_t7wCSAM1s",
  authDomain: "logisticx-4dd07.firebaseapp.com",
  projectId: "logisticx-4dd07",
  storageBucket: "logisticx-4dd07.firebasestorage.app",
  messagingSenderId: "648334461773",
  appId: "1:648334461773:web:54f8f718674bdfbb8e0504",
  measurementId: "G-5QRLJYHSTS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Initialize Firestore
const db = getFirestore(app); // Initialize Firestore

// Export the auth instance, providers, and Firestore
export { auth, googleProvider, githubProvider, db };