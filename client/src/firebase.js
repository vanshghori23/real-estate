// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-23bd5.firebaseapp.com",
  projectId: "real-estate-23bd5",
  storageBucket: "real-estate-23bd5.appspot.com",
  messagingSenderId: "284996345027",
  appId: "1:284996345027:web:16d8e88983c08a44569676"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);