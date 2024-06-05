// auth javascript file

import { createUserWithEmailAndPassword, updateProfile, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

export async function signup(firstname, lastname, email, password) {
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: `${firstname} ${lastname}`
        });

        return userCredential;
    } catch (error) {
        throw error;
    }
}

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password) 
        .then((userCredential) => {
            console.log('Logged in:', userCredential.user);
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
