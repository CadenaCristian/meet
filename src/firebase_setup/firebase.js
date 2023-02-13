// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBIAwUMQkBDzFiXwouvv6mu5-fjVnNnFSY",
    authDomain: "meetings-test-e3d20.firebaseapp.com",
    projectId: "meetings-test-e3d20",
    storageBucket: "meetings-test-e3d20.appspot.com",
    messagingSenderId: "181499651355",
    appId: "1:181499651355:web:574b8f6514a667f7cc1fbe",
    measurementId: "G-0W1FJWJK18"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
