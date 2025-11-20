import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzhV8FuYZTc2R6DPPwgstyhFmFb_HMTnY",
  authDomain: "pklbimbingan-smk-taruna-bhakti.firebaseapp.com",
  projectId: "pklbimbingan-smk-taruna-bhakti",
  storageBucket: "pklbimbingan-smk-taruna-bhakti.firebasestorage.app",
  messagingSenderId: "687179632485",
  appId: "1:687179632485:web:bdc1a10021662f1c9edb8c",
  measurementId: "G-JQ967KLHY7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
