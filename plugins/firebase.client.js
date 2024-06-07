import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  // const firebaseConfig = {
  //   apiKey: "AIzaSyA4jV14KIauflNLMmNGmtn3zXIvkfkceU4",
  //   authDomain: "push-tester-4f803.firebaseapp.com",
  //   projectId: "push-tester-4f803",
  //   storageBucket: "push-tester-4f803.appspot.com",
  //   messagingSenderId: "750758173611",
  //   appId: "1:750758173611:web:044f2c47514e61925850ee",
  //   measurementId: "G-5XYQ19D2TD",
  // };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  //   provide auth
  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);

  //   provide messaging
  nuxtApp.vueApp.provide("messaging", messaging);
  nuxtApp.provide("messaging", messaging);

  nuxtApp.vueApp.provide("firestore", firestore);
  nuxtApp.provide("firestore", firestore);
});
