importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js");

try {
  const firebaseConfig = {
    apiKey: "AIzaSyA4jV14KIauflNLMmNGmtn3zXIvkfkceU4",
    authDomain: "push-tester-4f803.firebaseapp.com",
    projectId: "push-tester-4f803",
    storageBucket: "push-tester-4f803.appspot.com",
    messagingSenderId: "750758173611",
    appId: "1:750758173611:web:044f2c47514e61925850ee",
    measurementId: "G-5XYQ19D2TD",
  };

  // const config = useRuntimeConfig();

  // const firebaseConfig = {
  //   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  //   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  //   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  //   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  //   appId: import.meta.env.VITE_FIREBASE_APP_ID,
  //   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  // };

  const app = firebase.initializeApp(firebaseConfig);
  app.messaging();
} catch (error) {}
