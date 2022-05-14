// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9qTRk01Eo-C0OEHnfvoDYQrGjI6fLCDg",
  authDomain: "kerry-logistics-cargo-tracking.firebaseapp.com",
  databaseURL: "https://kerry-logistics-cargo-tracking-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kerry-logistics-cargo-tracking",
  storageBucket: "kerry-logistics-cargo-tracking.appspot.com",
  messagingSenderId: "561386564609",
  appId: "1:561386564609:web:567ae6b00590dd665da400",
  measurementId: "G-QL1WE7RNMY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const functions = getFunctions(app);
connectFunctionsEmulator(functions, "localhost", 5001);
export const messaging = getMessaging(app);