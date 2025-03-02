import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoGHrecrCfeisbztha1FGKHfzFKUgCA8E",
  authDomain: "bakery-4c8e3.firebaseapp.com",
  projectId: "bakery-4c8e3",
  storageBucket: "bakery-4c8e3.appspot.com",
  messagingSenderId: "528024557029",
  appId: "1:528024557029:web:your-app-id", // Replace if needed
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);