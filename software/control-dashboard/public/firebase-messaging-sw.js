// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
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

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});