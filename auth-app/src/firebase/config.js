import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDi6mDdrZWTpuLF-_l8EUcT3_t7wCSAM1s",
  authDomain: "logisticx-4dd07.firebaseapp.com",
  projectId: "logisticx-4dd07",
  storageBucket: "logisticx-4dd07.firebasestorage.app",
  messagingSenderId: "648334461773",
  appId: "1:648334461773:web:54f8f718674bdfbb8e0504",
  measurementId: "G-5QRLJYHSTS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };