import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCH2WaEyNKLC5U4YYJrvsZ-b8HjiJqLG1k",
    authDomain: "getmaxcrm-36dd0.firebaseapp.com",
    projectId: "getmaxcrm-36dd0",
    storageBucket: "getmaxcrm-36dd0.firebasestorage.app",
    messagingSenderId: "511255256485",
    appId: "1:511255256485:web:e24a78505142ead3591c4c",
    measurementId: "G-Z9CR6GZY80"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
