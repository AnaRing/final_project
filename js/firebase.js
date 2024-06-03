// firebase import file

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { get } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDbxyv6XxAraVCNdOdHCPGtCngi3g5aSbM",
    authDomain: "final-project2024-13c41.firebaseapp.com",
    projectId: "final-project2024-13c41",
    storageBucket: "final-project2024-13c41.appspot.com",
    messagingSenderId: "260544955462",
    appId: "1:260544955462:web:6b58aaacd9b8e69032f647"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };