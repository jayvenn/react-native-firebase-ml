// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBU3PFIWJ45nNOYZ42ozn6-Mw19cVWIxtM",
    authDomain: "visiongn-f1eb3.firebaseapp.com",
    projectId: "visiongn-f1eb3",
    storageBucket: "visiongn-f1eb3.appspot.com",
    messagingSenderId: "950706490237",
    appId: "1:950706490237:web:dbf557a4ae8b1c8eea5a14",
    measurementId: "G-YXVJSSHB77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);