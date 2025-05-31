// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIRE_BASE_API_KEY,
    authDomain: "lang-king.firebaseapp.com",
    databaseURL: "https://lang-king-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "lang-king",
    storageBucket: "lang-king.firebasestorage.app",
    messagingSenderId: "587695602198",
    appId: "1:587695602198:web:36ccadf7807f543be6d337",
    measurementId: "G-0PLBE7F92H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export { database };