import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 
import { getStorage } from 'firebase/storage';// Import getFirestore function for Firestore
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBgBeouFvKmEShlE2fG7sR9civqH63Uyw4",
    authDomain: "healthquest-16bec.firebaseapp.com",
    databaseURL: "https://healthquest-16bec-default-rtdb.firebaseio.com",
    projectId: "healthquest-16bec",
    storageBucket: "healthquest-16bec.appspot.com",
    messagingSenderId: "446788055678",
    appId: "1:446788055678:web:6686c67436b981753a5e2f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app); // Initialize Firestore
const storage = getStorage(app);


export { app, auth, firestore,storage }; // Export both auth and firestore