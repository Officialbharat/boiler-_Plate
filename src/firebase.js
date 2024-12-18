// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Import the analytics module
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKHkv8LL5qEAByj7_Q7WxN8XL6nr1XAgM",
  authDomain: "fir-with-react-d0d70.firebaseapp.com",
  databaseURL: "https://fir-with-react-d0d70-default-rtdb.firebaseio.com",
  projectId: "fir-with-react-d0d70",
  storageBucket: "fir-with-react-d0d70.appspot.com",
  messagingSenderId: "1050554385251",
  appId: "1:1050554385251:web:36d9968587f3275e0a8956",
  measurementId: "G-6VVHT0MSZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // Initialize the app
const auth = getAuth(app); // Firebase Auth instance
const db = getFirestore(app); // Firestore instance

// Export the required instances
// Initialize Analytics
const analytics = getAnalytics(app);

// Export analytics along with other instances
export { app, auth, db, analytics };
