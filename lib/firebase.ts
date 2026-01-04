import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAcfFgo7F5icxgf364jcS0k7uWt7ZAz15Y",
    authDomain: "neuro-184f1.firebaseapp.com",
    projectId: "neuro-184f1",
    storageBucket: "neuro-184f1.firebasestorage.app",
    messagingSenderId: "149357156340",
    appId: "1:149357156340:web:a4dd87cf710098e1f7cba1",
    measurementId: "G-5Y6DF11953"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
};

export const logout = async () => {
    await signOut(auth);
};
