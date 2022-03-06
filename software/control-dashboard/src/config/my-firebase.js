import firebase from 'firebase'

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
firebase.initializeApp(config)
firebase.firestore().settings({
  timestampsInSnapshots: true
})

export const myFirebase = firebase;
export const db = getDatabase(firebase);