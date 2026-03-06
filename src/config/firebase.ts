import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDweYJTBwwxyszjNkmsB4UZjRfqgc-kduM",
    authDomain: "portfolio-sgl.firebaseapp.com",
    projectId: "portfolio-sgl",
    storageBucket: "portfolio-sgl.firebasestorage.app",
    messagingSenderId: "819568013109",
    appId: "1:819568013109:web:dda5f2bdf58c76fbdba67c",
    measurementId: "G-Y0RJLF5C9Q"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
