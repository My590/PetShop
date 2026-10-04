import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAk1HAbuuttDrfT2bggecrSBLMYHEvweMI",
  authDomain: "merenda-99b86.firebaseapp.com",
  projectId: "merenda-99b86",
  storageBucket: "merenda-99b86.firebasestorage.app",
  messagingSenderId: "178898447481",
  appId: "1:178898447481:web:2b7251ee33ab53247378a8",
  measurementId: "G-MSK8FGTJFT"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});