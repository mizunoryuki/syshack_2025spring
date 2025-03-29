// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDCTTpjLtI8H6qbm1xeehQzLuZgMvCVm6A",
    authDomain: "qrtest-77295.firebaseapp.com",
    projectId: "qrtest-77295",
    storageBucket: "qrtest-77295.firebasestorage.app",
    messagingSenderId: "598967892397",
    appId: "1:598967892397:web:6c0ef987086402942ec924",
    measurementId: "G-3G0RBH5SL1"
};

const app = initializeApp(firebaseConfig);

// 🔑 Firebase Authentication 関連
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();