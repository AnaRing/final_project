// auth javascript file

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

export function signup(firstname, surname, email, password) {
    return createUserWithEmailAndPassword(auth, firstname, surname, email, password)
    .then((userCredential) => {
        console.log('User signed up:', userCredential.user);
        // put the code for redirection here
    })
}

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password) 
        .then((userCredential) => {
            console.log('Logged in:', userCredential.user);
            // put the code for redirection here
        })
        .catch((error) => {
            console.error('Error logging in:', error);
            // error handling
        });
    }

export function logout(){
    return signOut(auth)
    .then(() => {
        console.log('Logged out');
        // code for redirection when signed out
    })
    // error handling?
    /* .catch((error) => {
        console.error('Error', error);
    }) */
}
