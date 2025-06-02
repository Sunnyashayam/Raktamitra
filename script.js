// After 2.5 seconds, go to dashboard
setTimeout(() => {
  window.location.href = "dashboard.html";
}, 2500);

// Firebase Initialization and Messaging code
const firebaseConfig = {
  
  autapiKey:"AIzaSyDZ4e3ewMyVkUJFbLZyRb1SH37cakFwMiQ",
  authDomain: "raktamitra-4c4ee.firebaseapp.com",
  projectId: "raktamitra-4c4ee",
  storageBucket: "raktamitra-4c4ee.firebasestorage.app",
  messagingSenderId: "997339508669",
  appId: "1:997339508669:web:399ae9f6b7bf8e4e83acd4"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Request permission and get token for notifications
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    messaging.getToken({ vapidKey: 'BGA01IprnWmuwWGcmOdRzaWoj1e409RdF9gjEr5b1CPt76dIIN5eJCV1YwgIAnmMmbJ1SKeXngGe8TjBtKzoigI' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('FCM Token:', currentToken);
          // TODO: Send this token to your backend/database to send notifications later
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  } else {
    console.log('Notification permission not granted.');
  }
});
