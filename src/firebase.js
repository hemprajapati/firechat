import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD_4D4PgKcB2E-TddyvH4-AA3i59ZN7Nx4",
    authDomain: "chat-app-11f0a.firebaseapp.com",
    databaseURL: "https://chat-app-11f0a-default-rtdb.firebaseio.com",
    projectId: "chat-app-11f0a",
    storageBucket: "chat-app-11f0a.appspot.com",
    messagingSenderId: "704490581595",
    appId: "1:704490581595:web:49d80ecf4d63aa92ac997e",
    measurementId: "G-V8SGVEGC4R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const authReady = new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
        resolve(user);
    });
});

const db = getFirestore(app);
const realtimeDb = getDatabase(app); // Initialize Realtime Database
export { app, db, realtimeDb };
