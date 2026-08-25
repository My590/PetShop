// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk1HAbuuttDrfT2bggecrSBLMYHEvweMI",
  authDomain: "merenda-99b86.firebaseapp.com",
  projectId: "merenda-99b86",
  storageBucket: "merenda-99b86.firebasestorage.app",
  messagingSenderId: "178898447481",
  appId: "1:178898447481:web:2b7251ee33ab53247378a8",
  measurementId: "G-MSK8FGTJFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);