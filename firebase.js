// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAF6RDpYFHgfJqy1kzxsYHaZwLxccVifMA",
  authDomain: "financly-web-app.firebaseapp.com",
  projectId: "financly-web-app",
  storageBucket: "financly-web-app.appspot.com",
  messagingSenderId: "39103531967",
  appId: "1:39103531967:web:27a85cafc75078aa3faf0a",
  measurementId: "G-9M0Z2EHEER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

export {
    db,
    auth,
    provider,
    doc,
    setDoc,
    firestore,
};