import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const config = {
    apiKey: "AIzaSyD9qTRk01Eo-C0OEHnfvoDYQrGjI6fLCDg",
    authDomain: "kerry-logistics-cargo-tracking.firebaseapp.com",
    databaseURL: "https://kerry-logistics-cargo-tracking-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "kerry-logistics-cargo-tracking",
    storageBucket: "kerry-logistics-cargo-tracking.appspot.com",
    messagingSenderId: "561386564609",
    appId: "1:561386564609:web:567ae6b00590dd665da400",
    measurementId: "G-QL1WE7RNMY"
}
const app = initializeApp(config);

export const myFirebase = app;
export const db = getDatabase(app);